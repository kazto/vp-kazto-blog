# scripts/

ブログ運用に使うスクリプト集。リポジトリルートから実行する。

## new-post.sh

記事ファイルの雛形を生成する。

```bash
bash scripts/new-post.sh <slug> <title>
```

**例:**
```bash
bash scripts/new-post.sh my-first-post "はじめての記事"
# → posts/2026-03-21-my-first-post.md を作成
```

- `posts/YYYY-MM-DD-<slug>.md` を作成する
- フロントマター（title / date / tags / description）が挿入された状態で生成される

---

## upload-image.sh

画像ファイルを Cloudflare R2 にアップロードし、公開 URL を表示する。

```bash
bash scripts/upload-image.sh <image-file>
```

**例:**
```bash
bash scripts/upload-image.sh ~/Pictures/photo.jpg
# → URL: https://assets.blog.kazto.dev/images/2026/0321/photo.jpg
```

- 対応フォーマット: jpg / jpeg / png / gif / webp / svg / avif
- アップロード先のキー: `images/YYYY/MMDD/<filename>`
- URL はクリップボードにもコピーされる（xclip が必要）
- Cloudflare の認証に `wrangler` を使用する（npx / pnpm / vp 経由で自動検出）

---

## download-and-rehost-images.sh

Markdown ファイル内の GitHub 添付画像 URL を Cloudflare R2 に移行し、URL を書き換える。
GitHub Actions（publish-issue.yml）から呼び出されるが、手動実行も可能。

```bash
GH_TOKEN=<token> bash scripts/download-and-rehost-images.sh <markdown-file>
```

**例:**
```bash
GH_TOKEN=$(gh auth token) bash scripts/download-and-rehost-images.sh posts/2026-03-21-my-post.md
```

- `private-user-images.githubusercontent.com`（JWT付き）と `github.com/user-attachments/assets`（安定URL）の両パターンに対応
- 内部で `upload-image.sh` と `replace-image-urls.py` を呼び出す
- 環境変数 `GH_TOKEN` / `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` が必要

---

## slugify.py

記事タイトルを URL スラッグに変換する。`new-post.sh` や GitHub Actions から呼び出される。

```bash
python3 scripts/slugify.py <title>
```

**例:**
```bash
python3 scripts/slugify.py "JaSST Tokyo 2026に行ってきたよ"
# → jasst-tokyo-2026に行ってきたよ

python3 scripts/slugify.py "I attended JaSST Tokyo 2026"
# → i-attended-jasst-tokyo-2026
```

- 英小文字・数字・日本語（ひらがな・カタカナ・漢字）以外をハイフンに置換
- 連続するハイフンを圧縮し、先頭・末尾のハイフンを除去

---

## replace-image-urls.py

Markdown ファイル内の特定 URL を別の URL に置換する。`download-and-rehost-images.sh` から呼び出される。

```bash
OLD_URL=<before> NEW_URL=<after> python3 scripts/replace-image-urls.py <markdown-file>
```

**例:**
```bash
OLD_URL="https://private-user-images.githubusercontent.com/..." \
NEW_URL="https://assets.blog.kazto.dev/images/..." \
python3 scripts/replace-image-urls.py posts/2026-03-21-my-post.md
```
