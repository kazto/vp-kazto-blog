#!/usr/bin/env python3
"""
IssueタイトルをURLスラッグに変換する。
英小文字・数字・日本語（ひらがな・カタカナ・漢字）以外をハイフンに置換。

Usage:
    python3 slugify.py "I attended JaSST Tokyo 2026"
    → i-attended-jasst-tokyo-2026
"""
import re
import sys

title = sys.argv[1]
slug = title.lower()
slug = re.sub(r'[^a-z0-9\u3041-\u3096\u30a0-\u30ff\u4e00-\u9fff]', '-', slug)
slug = re.sub(r'-+', '-', slug)
slug = slug.strip('-')
print(slug, end='')
