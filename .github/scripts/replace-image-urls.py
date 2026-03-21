#!/usr/bin/env python3
"""
Markdownファイル内のGitHub画像URLをCloudflare R2のURLに置換する。

Usage:
    OLD_URL=<github_url> NEW_URL=<r2_url> python3 replace-image-urls.py <markdown_file>
"""
import os
import sys

fname = sys.argv[1]
old_url = os.environ['OLD_URL']
new_url = os.environ['NEW_URL']

content = open(fname).read()
content = content.replace(old_url, new_url)
open(fname, 'w').write(content)

print(f"Replaced in {fname}: {old_url} -> {new_url}")
