#!/usr/bin/env bash
# GitHub Issueの添付画像をダウンロードし、Cloudflare R2に再ホストする。
# 記事MarkdownファイルのGitHub画像URLをR2のURLに置換する。
#
# Usage:
#   GH_TOKEN=<token> CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=<id> \
#     bash download-and-rehost-images.sh <markdown_file>

set -euo pipefail

FILENAME="$1"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Processing file: $FILENAME ($(wc -l < "$FILENAME") lines)"

# GitHub画像URLを2パターンで抽出
# 1) private-user-images（JWT付き一時URL）
# 2) user-attachments/assets（安定URL、webhookペイロードはこちらの場合が多い）
URLS=$(
  {
    grep -oP 'https://private-user-images\.githubusercontent\.com/[^\)]+' "$FILENAME" || true
    grep -oP 'https://github\.com/user-attachments/assets/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' "$FILENAME" || true
  } | sort -u
)

URL_COUNT=$(echo "$URLS" | grep -c 'http' || true)
echo "Found URLs: $URL_COUNT"
[ "$URL_COUNT" -eq 0 ] && exit 0

echo "$URLS" | while IFS= read -r URL; do
  [ -z "$URL" ] && continue
  echo "Processing URL: $URL"

  UUID=$(echo "$URL" | grep -oP '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')
  EXT=$(echo "$URL" | grep -oP '\.[a-z]+(?=\?)' | head -1 | tr -d '.')
  [ -z "$UUID" ] && { echo "No UUID found in: $URL"; continue; }
  [ -z "$EXT" ] && EXT="jpg"
  echo "UUID=$UUID EXT=$EXT"

  # 安定URLでダウンロード（JWTは期限切れの可能性があるため）
  STABLE_URL="https://github.com/user-attachments/assets/${UUID}"
  TMPFILE="/tmp/${UUID}.${EXT}"

  HTTP_CODE=$(curl -s -L -w "%{http_code}" -o "$TMPFILE" \
    -H "Authorization: Bearer ${GH_TOKEN}" \
    "$STABLE_URL")
  echo "Download HTTP status: $HTTP_CODE"

  if [ "$HTTP_CODE" != "200" ]; then
    echo "Failed to download $STABLE_URL (HTTP $HTTP_CODE)"
    rm -f "$TMPFILE"
    continue
  fi

  # upload-image.sh でCloudflare R2にアップロード
  R2_OUTPUT=$(bash "$(git rev-parse --show-toplevel)/upload-image.sh" "$TMPFILE" 2>&1) || true
  echo "$R2_OUTPUT"
  R2_URL=$(echo "$R2_OUTPUT" | grep '^URL: ' | sed 's/^URL: //')

  if [ -n "$R2_URL" ]; then
    OLD_URL="$URL" NEW_URL="$R2_URL" python3 "$SCRIPT_DIR/replace-image-urls.py" "$FILENAME"
  else
    echo "Upload failed for $TMPFILE"
  fi

  rm -f "$TMPFILE"
done
