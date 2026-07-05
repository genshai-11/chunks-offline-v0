#!/usr/bin/env python3
"""
Configure 9Router TTS provider settings in Supabase Vault for CHUNKS.

Security notes:
- Does not accept the API key as a command-line argument.
- Prompts locally with getpass so the key is not echoed.
- Uses Supabase Vault (`vault.create_secret` / `vault.update_secret`) for encrypted storage.
- Supabase CLI requires SQL execution; a temporary SQL file is created and deleted immediately.

Examples:
  python scripts/configure_ninerouter_vault.py
  python scripts/configure_ninerouter_vault.py --url https://rbkqhml.abc-tunnel.us/v1
"""

from __future__ import annotations

import argparse
import getpass
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

DEFAULT_URL = "https://rbkqhml.abc-tunnel.us/v1"
URL_SECRET_NAME = "ninerouter_url"
KEY_SECRET_NAME = "ninerouter_api_key"


def supabase_cmd(*args: str) -> list[str]:
    bin_path = shutil.which("supabase") or shutil.which("supabase.cmd") or shutil.which("supabase.exe")
    if not bin_path:
        raise FileNotFoundError("Supabase CLI not found on PATH")
    if os.name == "nt" and bin_path.lower().endswith((".cmd", ".bat")):
        return ["cmd.exe", "/d", "/c", bin_path, *args]
    return [bin_path, *args]


def run(cmd: list[str], *, timeout: int = 300) -> subprocess.CompletedProcess[str]:
    env = os.environ.copy()
    env.setdefault("SUPABASE_TELEMETRY_DISABLED", "1")
    return subprocess.run(
        cmd,
        text=True,
        encoding="utf-8",
        errors="replace",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        timeout=timeout,
        check=False,
        env=env,
    )


def sql_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def db_query(sql: str, workdir: str) -> list[dict[str, Any]]:
    tmp = tempfile.NamedTemporaryFile("w", suffix=".sql", delete=False, encoding="utf-8")
    try:
        tmp.write(sql)
        tmp.close()
        cp = run(
            supabase_cmd(
                "db",
                "query",
                "--linked",
                "--workdir",
                workdir,
                "--output",
                "json",
                "--file",
                tmp.name,
            ),
            timeout=600,
        )
    finally:
        try:
            Path(tmp.name).unlink(missing_ok=True)
        except Exception:
            pass
    if cp.returncode != 0:
        raise RuntimeError(f"supabase db query failed\nSTDOUT:\n{cp.stdout}\nSTDERR:\n{cp.stderr}")
    out = cp.stdout.strip()
    start = out.find("[")
    return json.loads(out[start:]) if start >= 0 else []


def find_secret_id(name: str, workdir: str) -> str | None:
    rows = db_query(
        f"select id::text from vault.secrets where name = {sql_quote(name)} order by created_at desc limit 1;",
        workdir,
    )
    return rows[0]["id"] if rows else None


def upsert_secret(name: str, secret: str, description: str, workdir: str) -> str:
    existing_id = find_secret_id(name, workdir)
    if existing_id:
        db_query(
            "select vault.update_secret("
            f"{sql_quote(existing_id)}::uuid, {sql_quote(secret)}, {sql_quote(name)}, {sql_quote(description)}"
            ");",
            workdir,
        )
        return existing_id
    rows = db_query(
        "select vault.create_secret("
        f"{sql_quote(secret)}, {sql_quote(name)}, {sql_quote(description)}"
        ")::text as id;",
        workdir,
    )
    return rows[0]["id"]


def main() -> int:
    parser = argparse.ArgumentParser(description="Save 9Router TTS provider settings to Supabase Vault.")
    parser.add_argument("--url", default=DEFAULT_URL, help="9Router OpenAI-compatible base URL.")
    parser.add_argument("--workdir", default=".", help="Supabase linked project workdir.")
    parser.add_argument("--skip-key", action="store_true", help="Only save/update the URL secret, not the API key.")
    args = parser.parse_args()

    url_id = upsert_secret(
        URL_SECRET_NAME,
        args.url,
        "9Router OpenAI-compatible base URL for CHUNKS resource TTS generation",
        args.workdir,
    )
    print(json.dumps({"saved": URL_SECRET_NAME, "id": url_id}))

    if not args.skip_key:
        key = getpass.getpass("Enter rotated NINEROUTER_KEY to save in Supabase Vault: ").strip()
        if not key:
            print("No API key entered; URL saved only.", file=sys.stderr)
            return 2
        key_id = upsert_secret(
            KEY_SECRET_NAME,
            key,
            "9Router API key for CHUNKS server-side/operator TTS generation. Do not expose to browser clients.",
            args.workdir,
        )
        print(json.dumps({"saved": KEY_SECRET_NAME, "id": key_id}))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
