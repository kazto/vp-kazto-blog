#!/usr/bin/env bash
set -euo pipefail

BUCKET="kazto-blog"
BASE_URL="https://assets.blog.kazto.dev"

if [ $# -lt 1 ]; then
  echo "Usage: $0 <image-file>"
  echo "Example: $0 ~/Pictures/photo.jpg"
  exit 1
fi

FILE="$1"

if [ ! -f "$FILE" ]; then
  echo "Error: file not found: $FILE"
  exit 1
fi

FILENAME=$(basename "$FILE")
EXT="${FILENAME##*.}"

case "${EXT,,}" in
  jpg|jpeg) CONTENT_TYPE="image/jpeg" ;;
  png)      CONTENT_TYPE="image/png" ;;
  gif)      CONTENT_TYPE="image/gif" ;;
  webp)     CONTENT_TYPE="image/webp" ;;
  svg)      CONTENT_TYPE="image/svg+xml" ;;
  avif)     CONTENT_TYPE="image/avif" ;;
  *)
    echo "Error: unsupported file type: .${EXT}"
    exit 1
    ;;
esac

YYYY=$(date +"%Y")
MMDD=$(date +"%m%d")
KEY="images/${YYYY}/${MMDD}/${FILENAME}"
WRANGLER_EXE=
if which vpx >/dev/null 2>&1
then
    WRANGLER_EXE="vpx wrangler"
elif which pnpm >/dev/null 2>&1
then
    WRANGLER_EXE="pnpm dlx wrangler"
elif which npx >/dev/null 2>&1
then
    WRANGLER_EXE="npx wrangler"
elif which wrangler >/dev/null 2>&1
then
    WRANGLER_EXE="wrangler"
else
    echo "wrangler not found!"
    exit 1
fi

echo "Uploading: ${FILENAME} → ${KEY}"
$WRANGLER_EXE r2 object put "${BUCKET}/${KEY}" \
  --file "${FILE}" \
  --content-type "${CONTENT_TYPE}" \
  --remote

URL="${BASE_URL}/${KEY}"
echo ""
echo "URL: ${URL}"
echo "${URL}" | xclip -selection clipboard 2>/dev/null \
  && echo "(copied to clipboard)" \
  || true
