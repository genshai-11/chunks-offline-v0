#!/usr/bin/env python3
"""
Generate missing resource audio with 9Router TTS, upload to Supabase Storage,
and update public.sentence_resources audio_en_url/audio_vi_url.

Security:
- Does NOT store API keys.
- Reads NINEROUTER_KEY from environment only.
- Uses Supabase CLI linked-project auth for DB queries + Storage upload.

Prereqs:
  supabase link --project-ref ftfxekdxeoxizoyxuqoz --workdir .

Examples:
  # Dry-run first 10 Vietnamese jobs
  python scripts/seed_resource_audio_tts.py --language vi --limit 10 --dry-run

  # Generate/upload first 5 Vietnamese MP3s
  # PowerShell:
  #   $env:NINEROUTER_URL="https://rbkqhml.abc-tunnel.us/v1"
  #   $env:NINEROUTER_KEY="..."
  #   python scripts/seed_resource_audio_tts.py --language vi --limit 5

  # Full Vietnamese run, resumable
  python scripts/seed_resource_audio_tts.py --language vi --batch-size 25

  # Vietnamese Level B first, reading 9Router URL/key from Supabase Vault if env is unset
  python scripts/seed_resource_audio_tts.py --language vi --course-title "Chunks-Material-Level-B" --batch-size 25 --config-source auto

  # English backfill only if audio_en_url is missing
  python scripts/seed_resource_audio_tts.py --language en --batch-size 25
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

DEFAULT_NINEROUTER_URL = "https://rbkqhml.abc-tunnel.us/v1"
DEFAULT_BUCKET = "resource-audio"
DEFAULT_WORKDIR = "."
MODEL_BY_LANG = {
    "en": "edge-tts/en-US-BrianNeural",
    "vi": "edge-tts/vi-VN-HoaiMyNeural",
}
TEXT_COL_BY_LANG = {"en": "text_en", "vi": "text_vi"}
AUDIO_COL_BY_LANG = {"en": "audio_en_url", "vi": "audio_vi_url"}


def supabase_cmd(*args: str) -> list[str]:
    """Resolve Supabase CLI cross-platform, including npm .cmd shim on Windows."""
    bin_path = shutil.which("supabase") or shutil.which("supabase.cmd") or shutil.which("supabase.exe")
    if not bin_path:
        raise FileNotFoundError("Supabase CLI not found on PATH")
    if os.name == "nt" and bin_path.lower().endswith((".cmd", ".bat")):
        return ["cmd.exe", "/d", "/c", bin_path, *args]
    return [bin_path, *args]


def run(cmd: list[str], *, input_text: str | None = None, timeout: int = 300, capture: bool = True) -> subprocess.CompletedProcess[str]:
    # Never print command env; caller must avoid putting secrets in args.
    env = os.environ.copy()
    env.setdefault("SUPABASE_TELEMETRY_DISABLED", "1")
    return subprocess.run(
        cmd,
        input=input_text,
        text=True,
        encoding="utf-8",
        errors="replace",
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None,
        timeout=timeout,
        check=False,
        env=env,
    )


def db_query(sql: str, workdir: str) -> list[dict[str, Any]]:
    # Pass SQL via file to avoid Windows cmd.exe interpreting SQL metacharacters (<, >, &, |).
    tmp = tempfile.NamedTemporaryFile("w", suffix=".sql", delete=False, encoding="utf-8")
    try:
        tmp.write(sql)
        tmp.close()
        cp = run(supabase_cmd(
            "db", "query",
            "--linked",
            "--workdir", workdir,
            "--output", "json",
            "--file", tmp.name,
        ), timeout=600)
    finally:
        try:
            Path(tmp.name).unlink(missing_ok=True)
        except Exception:
            pass
    if cp.returncode != 0:
        raise RuntimeError(f"supabase db query failed\nSTDOUT:\n{cp.stdout}\nSTDERR:\n{cp.stderr}")
    out = cp.stdout.strip()
    # Supabase CLI may print an initial status line before JSON.
    start = out.find("[")
    if start < 0:
        return []
    return json.loads(out[start:])


def sql_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def storage_cp(local_file: Path, bucket: str, object_path: str, workdir: str) -> None:
    dst = f"ss:///{bucket}/{object_path}"
    cp = run(supabase_cmd(
        "--experimental",
        "storage", "cp",
        "--linked",
        "--workdir", workdir,
        "--cache-control", "max-age=31536000",
        "--content-type", "audio/mpeg",
        str(local_file),
        dst,
    ), timeout=600)
    if cp.returncode != 0:
        raise RuntimeError(f"supabase storage cp failed for {object_path}\nSTDOUT:\n{cp.stdout}\nSTDERR:\n{cp.stderr}")


def normalize_path_part(s: str) -> str:
    s = re.sub(r"[^A-Za-z0-9]+", "_", s).strip("_")
    return s or "item"


def target_path(row: dict[str, Any], language: str) -> str:
    # Keep paths deterministic and distinct from old EN paths.
    base = row.get("audio_en_url") or ""
    if language == "vi" and base.startswith("audio/") and base.endswith(".mp3"):
        return base[:-4] + ".vi.mp3"
    course = normalize_path_part(row.get("course_title") or "course")
    lesson = normalize_path_part(row.get("lesson_title") or "lesson")
    section = normalize_path_part(row.get("section_title") or "section")
    idx = int(row.get("order_index") or 0)
    code = normalize_path_part(row.get("sentence_code") or row["id"])
    return f"audio/{course}/{lesson}/{section}/{idx:04d}_{code}.{language}.mp3"


def fetch_jobs(language: str, limit: int | None, workdir: str, course_title: str | None = None) -> list[dict[str, Any]]:
    text_col = TEXT_COL_BY_LANG[language]
    audio_col = AUDIO_COL_BY_LANG[language]
    limit_sql = f"limit {int(limit)}" if limit else ""
    course_filter_sql = f"\n  and c.title = {sql_quote(course_title)}" if course_title else ""
    sql = f"""
select
  sr.id,
  c.title as course_title,
  l.title as lesson_title,
  s.title as section_title,
  sr.order_index,
  sr.sentence_code,
  sr.text_en,
  sr.text_vi,
  sr.audio_en_url,
  sr.audio_vi_url
from public.sentence_resources sr
join public.courses c on c.id = sr.course_id
join public.lessons l on l.id = sr.lesson_id
left join public.lesson_sections s on s.id = sr.section_id
where sr.{text_col} is not null
  and btrim(sr.{text_col}) <> ''
  and (sr.{audio_col} is null or btrim(sr.{audio_col}) = ''){course_filter_sql}
order by c.title, l.order_index, s.order_index, sr.order_index
{limit_sql};
""".strip()
    return db_query(sql, workdir)


def tts_to_mp3(text: str, model: str, out_file: Path, base_url: str, key: str, retries: int = 3) -> None:
    url = base_url.rstrip("/") + "/audio/speech"
    body = json.dumps({"model": model, "input": text}, ensure_ascii=False).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {key}",
    }
    last_error = None
    for attempt in range(1, retries + 1):
        req = urllib.request.Request(url, data=body, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                data = r.read()
                if not data:
                    raise RuntimeError("empty audio response")
                out_file.write_bytes(data)
                return
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, RuntimeError) as e:
            last_error = e
            if attempt < retries:
                time.sleep(min(2 ** attempt, 10))
    raise RuntimeError(f"TTS failed after {retries} attempts: {last_error}")


def update_audio_url(resource_id: str, audio_col: str, object_path: str, workdir: str) -> None:
    sql = f"""
update public.sentence_resources
set {audio_col} = {sql_quote(object_path)}, updated_at = now()
where id = {sql_quote(resource_id)}::uuid
returning id, {audio_col};
""".strip()
    rows = db_query(sql, workdir)
    if len(rows) != 1:
        raise RuntimeError(f"Expected one updated row for {resource_id}, got {len(rows)}")


def fetch_vault_secret(name: str, workdir: str) -> str | None:
    sql = f"""
select decrypted_secret
from vault.decrypted_secrets
where name = {sql_quote(name)}
order by updated_at desc nulls last, created_at desc
limit 1;
""".strip()
    rows = db_query(sql, workdir)
    if not rows:
        return None
    value = rows[0].get("decrypted_secret")
    return str(value) if value else None


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate/upload missing CHUNKS resource audio via 9Router TTS.")
    parser.add_argument("--language", choices=["en", "vi"], required=True, help="Which language/audio column to seed.")
    parser.add_argument("--limit", type=int, default=None, help="Maximum number of missing rows to process.")
    parser.add_argument("--batch-size", type=int, default=25, help="Pause/report interval.")
    parser.add_argument("--course-title", default=None, help="Optional exact course title filter, e.g. Chunks-Material-Level-B.")
    parser.add_argument("--dry-run", action="store_true", help="Show jobs and target paths without TTS/upload/DB update.")
    parser.add_argument("--bucket", default=DEFAULT_BUCKET)
    parser.add_argument("--workdir", default=DEFAULT_WORKDIR)
    parser.add_argument("--ninerouter-url", default=os.environ.get("NINEROUTER_URL"))
    parser.add_argument("--config-source", choices=["env", "vault", "auto"], default="auto", help="Where to read 9Router config from. auto prefers env, then Vault, then built-in URL default.")
    parser.add_argument("--vault-url-name", default="ninerouter_url", help="Vault secret name for the 9Router base URL.")
    parser.add_argument("--vault-key-name", default="ninerouter_api_key", help="Vault secret name for the 9Router API key.")
    parser.add_argument("--model", default=None, help="Override TTS model/voice id.")
    parser.add_argument("--tmp-dir", default=None, help="Optional temp audio output dir. Defaults to .tts_audio_tmp under the current project.")
    args = parser.parse_args()

    model = args.model or MODEL_BY_LANG[args.language]
    text_col = TEXT_COL_BY_LANG[args.language]
    audio_col = AUDIO_COL_BY_LANG[args.language]

    base_url = args.ninerouter_url
    if args.config_source in {"vault", "auto"} and not base_url:
        base_url = fetch_vault_secret(args.vault_url_name, args.workdir)
    if not base_url:
        base_url = DEFAULT_NINEROUTER_URL

    jobs = fetch_jobs(args.language, args.limit, args.workdir, args.course_title)
    print(json.dumps({
        "language": args.language,
        "model": model,
        "jobs": len(jobs),
        "dry_run": args.dry_run,
        "bucket": args.bucket,
        "course_title": args.course_title,
    }, ensure_ascii=False, indent=2))

    if args.dry_run:
        for row in jobs[: min(20, len(jobs))]:
            print(json.dumps({
                "id": row["id"],
                "course": row["course_title"],
                "lesson": row["lesson_title"],
                "section": row.get("section_title"),
                "text": (row.get(text_col) or "")[:120],
                "target": target_path(row, args.language),
            }, ensure_ascii=False))
        return 0

    key = os.environ.get("NINEROUTER_KEY")
    if args.config_source in {"vault", "auto"} and not key:
        key = fetch_vault_secret(args.vault_key_name, args.workdir)
    if not key:
        print(
            "ERROR: NINEROUTER_KEY environment variable or Vault secret 'ninerouter_api_key' is required for non-dry-run.",
            file=sys.stderr,
        )
        return 2

    tmp_root = Path(args.tmp_dir) if args.tmp_dir else Path(".tts_audio_tmp")
    tmp_root.mkdir(parents=True, exist_ok=True)

    processed = 0
    failures: list[dict[str, str]] = []
    for row in jobs:
        rid = row["id"]
        text = row.get(text_col) or ""
        obj = target_path(row, args.language)
        local = tmp_root / (rid + f".{args.language}.mp3")
        try:
            print(f"[{processed+1}/{len(jobs)}] {args.language} {rid} -> {obj}")
            tts_to_mp3(text, model, local, base_url, key)
            storage_cp(local, args.bucket, obj, args.workdir)
            update_audio_url(rid, audio_col, obj, args.workdir)
            processed += 1
            if processed % max(args.batch_size, 1) == 0:
                print(json.dumps({"processed": processed, "remaining": len(jobs) - processed, "failures": len(failures)}))
        except Exception as e:
            failures.append({"id": rid, "error": str(e)[:500]})
            print(f"ERROR row {rid}: {e}", file=sys.stderr)

    print(json.dumps({"processed": processed, "failures": failures}, ensure_ascii=False, indent=2))
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
