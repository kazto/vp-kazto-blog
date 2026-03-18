#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: $0 <slug> <title>"
  echo "Example: $0 my-new-post \"新しい記事のタイトル\""
  exit 1
fi

SLUG="$1"
TITLE="$2"
DATE=$(date +"%Y-%m-%d")
DATETIME=$(date +"%Y-%m-%d %H:%M:%S")
FILENAME="posts/${DATE}-${SLUG}.md"

if [ -f "$FILENAME" ]; then
  echo "Error: $FILENAME already exists"
  exit 1
fi

cat > "$FILENAME" <<EOF
---
title: "${TITLE}"
date: ${DATETIME}
tags: []
---

EOF

echo "Created: $FILENAME"
