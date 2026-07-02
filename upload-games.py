"""
Синхронизация папки games\SMD\ с сервером.
Загружает новые файлы и обновляет изменённые, пропускает видео (.mp4 и др.).

Конфигурация читается из upload.cfg (скопируйте upload.cfg.example и заполните).
"""

import os
import sys
import hashlib
import configparser
import paramiko

BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
LOCAL_GAMES  = os.path.join(BASE_DIR, "games", "SMD")
SKIP_EXTS    = {".mp4", ".webm", ".m4v", ".mov"}

# ── читаем конфиг ────────────────────────────────────────────────
_cfg_path = os.path.join(BASE_DIR, "upload.cfg")
if not os.path.exists(_cfg_path):
    print(f"[ОШИБКА] Файл конфигурации не найден: {_cfg_path}")
    print(f"         Скопируйте upload.cfg.example в upload.cfg и заполните данные.")
    input("\nНажмите Enter для выхода...")
    sys.exit(1)

_cfg = configparser.ConfigParser()
_cfg.read(_cfg_path, encoding="utf-8")
_s = _cfg["server"]

SERVER_HOST  = _s.get("host", "")
SERVER_PORT  = int(_s.get("port", "22"))
SERVER_USER  = _s.get("user", "root")
SERVER_PASS  = _s.get("password", "")
REMOTE_GAMES = _s.get("remote_games", "/home/projects/retro-api/games/SMD")
API_URL      = _s.get("api_url", f"http://{SERVER_HOST}:3721")


def file_md5(path, chunk=65536):
    h = hashlib.md5()
    with open(path, "rb") as f:
        while True:
            block = f.read(chunk)
            if not block:
                break
            h.update(block)
    return h.hexdigest()


def remote_md5(sftp, path):
    try:
        with sftp.open(path, "rb") as f:
            h = hashlib.md5()
            while True:
                block = f.read(65536)
                if not block:
                    break
                h.update(block)
        return h.hexdigest()
    except Exception:
        return None


def remote_exists(sftp, path):
    try:
        sftp.stat(path)
        return True
    except FileNotFoundError:
        return False


def remote_mkdir_p(sftp, path):
    parts = path.lstrip("/").split("/")
    current = ""
    for part in parts:
        current += "/" + part
        try:
            sftp.stat(current)
        except FileNotFoundError:
            sftp.mkdir(current)


def main():
    if not os.path.isdir(LOCAL_GAMES):
        print(f"[ОШИБКА] Папка не найдена: {LOCAL_GAMES}")
        input("\nНажмите Enter для выхода...")
        sys.exit(1)

    print("=" * 60)
    print("  Синхронизация игр с сервером")
    print(f"  Источник : {LOCAL_GAMES}")
    print(f"  Сервер   : {SERVER_HOST}:{SERVER_PORT} → {REMOTE_GAMES}")
    print("=" * 60)
    print()

    print("Подключение к серверу...", end=" ", flush=True)
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(SERVER_HOST, port=SERVER_PORT,
                       username=SERVER_USER, password=SERVER_PASS, timeout=20)
    except Exception as e:
        print(f"ОШИБКА: {e}")
        input("\nНажмите Enter для выхода...")
        sys.exit(1)
    print("OK")

    sftp = client.open_sftp()

    uploaded = 0
    updated  = 0
    skipped  = 0
    errors   = 0
    total_bytes = 0

    game_names = sorted(os.listdir(LOCAL_GAMES))
    for game_name in game_names:
        game_local = os.path.join(LOCAL_GAMES, game_name)
        if not os.path.isdir(game_local):
            continue

        game_remote = REMOTE_GAMES + "/" + game_name
        remote_mkdir_p(sftp, game_remote)
        print(f"  [{game_name}]")

        for root, dirs, files in os.walk(game_local):
            dirs.sort()
            rel = os.path.relpath(root, game_local)
            if rel == ".":
                remote_root = game_remote
            else:
                remote_root = game_remote + "/" + rel.replace(os.sep, "/")
                remote_mkdir_p(sftp, remote_root)

            for fname in sorted(files):
                ext = os.path.splitext(fname)[1].lower()
                if ext in SKIP_EXTS:
                    skipped += 1
                    continue

                local_fp  = os.path.join(root, fname)
                remote_fp = remote_root + "/" + fname
                local_sz  = os.path.getsize(local_fp)

                needs_upload = True
                TEXT_EXTS = {".data", ".md", ".txt", ".json", ".xml", ".ini", ".cfg"}
                if remote_exists(sftp, remote_fp):
                    try:
                        r_stat = sftp.stat(remote_fp)
                        if ext in TEXT_EXTS:
                            # Text files: compare by MD5 to catch content changes
                            if r_stat.st_size == local_sz:
                                local_hash = file_md5(local_fp)
                                remote_hash = remote_md5(sftp, remote_fp)
                                if local_hash == remote_hash:
                                    needs_upload = False
                        else:
                            # Binary files: size comparison is enough
                            if r_stat.st_size == local_sz:
                                needs_upload = False
                    except Exception:
                        pass

                if not needs_upload:
                    continue

                action = "обновление" if remote_exists(sftp, remote_fp) else "загрузка"
                print(f"    {action}: {fname} ({local_sz / 1024:.0f} KB)")
                try:
                    sftp.put(local_fp, remote_fp)
                    total_bytes += local_sz
                    if action == "загрузка":
                        uploaded += 1
                    else:
                        updated += 1
                except Exception as e:
                    print(f"    ОШИБКА: {e}")
                    errors += 1

    sftp.close()
    client.close()

    print()
    print("=" * 60)
    print(f"  Новых файлов      : {uploaded}")
    print(f"  Обновлено файлов  : {updated}")
    print(f"  Пропущено видео   : {skipped}")
    print(f"  Ошибок            : {errors}")
    print(f"  Передано данных   : {total_bytes / 1024 / 1024:.1f} МБ")
    print("=" * 60)

    # Сбросить кэш игр на сервере
    if uploaded + updated > 0:
        print("\nСброс кэша игр на сервере...", end=" ", flush=True)
        try:
            import urllib.request
            req = urllib.request.Request(
                f"{API_URL}/api/reload",
                data=b"",
                method="POST"
            )
            urllib.request.urlopen(req, timeout=8).read()
            print("OK")
        except Exception:
            print("(не критично, кэш обновится автоматически через 1 минуту)")

    print()
    input("Нажмите Enter для выхода...")


if __name__ == "__main__":
    main()
