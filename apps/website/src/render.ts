import { BASE_URL, BLOG_TITLE, IMAGE_URL } from "./constants";
import { posts } from "./posts";
import { CSS } from "./styles";

export function extractFirstImage(html: string): string | undefined {
  const match = /<img[^>]+src="([^"]+)"/.exec(html);
  if (!match) return undefined;
  const src = match[1];
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return `${BASE_URL}${src}`;
  return undefined;
}

export function renderTags(tags: string[]): string {
  if (tags.length === 0) return "";
  const links = tags.map((t) => `<a href="/tags/${t}" class="tag">${t}</a>`).join("");
  return `<div class="tags">${links}</div>`;
}

export function renderPage(
  title: string,
  currentSlug: string | null,
  bodyContent: string,
  meta?: { pageUrl?: string; postImage?: string; description?: string },
): string {
  const pageUrl = meta?.pageUrl ?? BASE_URL;
  const description = meta?.description ?? "";
  const ogImage = meta?.postImage ?? `${IMAGE_URL}/ogp-large.png`;
  const twitterImage = meta?.postImage ?? `${IMAGE_URL}/ogp-square.png`;
  const twitterCard = meta?.postImage ? "summary_large_image" : "summary";

  const sidebarItems = posts
    .map(
      (p) => `
    <li class="${p.slug === currentSlug ? "active" : ""}">
      <a href="/posts/${p.slug}">${p.title}</a>
      <time>${p.date.slice(0, 10)}</time>
    </li>`,
    )
    .join("");

  const makePostLink = (currentSlug: string | null) => {
    if (currentSlug) {
      const url = `${BASE_URL}/posts/${currentSlug}`;
      const bskyId = "@kazto.dev";
      const xcomId = "@kazto_dev";
      const bskyText = encodeURIComponent(`${title}\n${bskyId}\n${url}`);
      const xcomText = encodeURIComponent(`${title}\n${xcomId}\n${url}`);
      const bskyUrl = `https://bsky.app/intent/compose?text=${bskyText}`;
      const xcomUrl = `https://x.com/intent/post?text=${xcomText}`;
      return (
        `<div class="comment-links">comment on` +
        ` <a href="${bskyUrl}" target="_blank" rel="noopener">bluesky</a> /` +
        ` <a href="${xcomUrl}" target="_blank" rel="noopener">x.com</a></div>`
      );
    }
    return "";
  };
  const postLink = makePostLink(currentSlug);

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${description ? `<meta name="description" content="${description}">` : ""}
  <meta property="og:title" content="${title}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:image" content="${ogImage}">
  ${description ? `<meta property="og:description" content="${description}">` : ""}
  <meta property="og:site_name" content="${BLOG_TITLE}">
  <meta property="og:locale" content="ja_JP">
  <meta name="twitter:card" content="${twitterCard}">
  <meta name="twitter:site" content="@kazto_dev">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:image" content="${twitterImage}">
  ${description ? `<meta name="twitter:description" content="${description}">` : ""}
  <link rel="alternate" type="application/rss+xml" title="${BLOG_TITLE}" href="${BASE_URL}/feed.xml">
  <link rel="alternate" type="application/atom+xml" title="${BLOG_TITLE}" href="${BASE_URL}/atom.xml">
  <style>${CSS}</style>
</head>
<body>
  <aside class="sidebar" id="sidebar">
    <div class="site-title">
      <a href="/">${BLOG_TITLE}</a>
      <button class="menu-toggle" id="menu-toggle" aria-label="メニューを開く">&#9776;</button>
    </div>
    <ul class="post-list">${sidebarItems}
    </ul>
  </aside>
  <script>
    document.getElementById('menu-toggle').addEventListener('click', function() {
      document.getElementById('sidebar').classList.toggle('open');
    });
  </script>
  <div class="content-wrapper">
    ${bodyContent}
    ${postLink}
    <div class="copyright">© kazto_dev</div>
  </div>
</body>
</html>`;
}
