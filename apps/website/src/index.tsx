import { Hono } from "hono";
import { ssgParams } from "hono/ssg";
import { marked } from "marked";

const postFiles = import.meta.glob("../../../posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  html: string;
}

function parseFrontmatter(raw: string): {
  data: Record<string, string | string[]>;
  content: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw };
  const yamlBlock = match[1];
  const content = match[2];
  const data: Record<string, string | string[]> = {};
  for (const line of yamlBlock.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const rawValue = line.slice(colonIdx + 1).trim();
    const arrayMatch = /^\[(.+)\]$/.exec(rawValue);
    if (arrayMatch) {
      data[key] = arrayMatch[1]
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    } else {
      data[key] = rawValue.replace(/^["']|["']$/g, "");
    }
  }
  return { data, content };
}

const posts: Post[] = Object.entries(postFiles)
  .map(([filePath, raw]) => {
    const slug = filePath.split("/").pop()!.replace(".md", "");
    const { data, content } = parseFrontmatter(raw);
    const rawTags = data.tags;
    const tags = Array.isArray(rawTags) ? rawTags : [];
    return {
      slug,
      title: (data.title as string) ?? slug,
      date: (data.date as string) ?? "",
      tags,
      description: (data.description as string) ?? "",
      html: marked.parse(content, { async: false }),
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    display: flex;
    min-height: 100vh;
    background: #f8fafc;
    color: #1e293b;
  }

  /* Sidebar */
  .sidebar {
    width: 300px;
    min-width: 300px;
    background: #0f172a;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    overflow-y: auto;
  }

  .sidebar::-webkit-scrollbar { width: 4px; }
  .sidebar::-webkit-scrollbar-track { background: transparent; }
  .sidebar::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }

  .site-title {
    padding: 28px 24px 20px;
    border-bottom: 1px solid #1e293b;
  }

  .site-title a {
    color: #f1f5f9;
    text-decoration: none;
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .post-list {
    list-style: none;
    padding: 8px 0 24px;
  }

  .post-list li { display: flex; flex-direction: column; }

  .post-list li a {
    padding: 8px 24px 2px;
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.8125rem;
    line-height: 1.5;
    transition: color 0.15s;
  }

  .post-list li a:hover { color: #e2e8f0; }

  .post-list li time {
    padding: 0 24px 6px;
    font-size: 0.6875rem;
    color: #475569;
  }

  .post-list li.active a {
    color: #38bdf8;
    font-weight: 600;
  }

  .post-list li.active time { color: #7dd3fc; }

  /* Content area */
  .content-wrapper {
    margin-left: 300px;
    flex: 1;
    padding: 56px 64px;
    max-width: calc(300px + 860px);
    width: 100%;
  }

  /* Hamburger button (hidden on desktop) */
  .menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    color: #f1f5f9;
    font-size: 1.5rem;
    line-height: 1;
  }

  /* Responsive: mobile */
  @media (max-width: 768px) {
    body {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      min-width: unset;
      height: auto;
      position: relative;
      overflow: hidden;
    }

    .site-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
    }

    .menu-toggle {
      display: block;
    }

    .post-list {
      display: none;
      padding: 0 0 16px;
    }

    .sidebar.open .post-list {
      display: block;
    }

    .content-wrapper {
      margin-left: 0;
      padding: 32px 20px;
      max-width: 100%;
    }

    .post-header h1 {
      font-size: 1.5rem;
    }
  }

  .post-header { margin-bottom: 40px; }

  .post-header h1 {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #0f172a;
    line-height: 1.3;
    margin-bottom: 10px;
  }

  .post-header time {
    font-size: 0.875rem;
    color: #64748b;
  }

  article {
    font-size: 1rem;
    line-height: 1.85;
    color: #334155;
  }

  article p { margin-bottom: 1.25em; }

  article h2 {
    font-size: 1.375rem;
    font-weight: 700;
    color: #0f172a;
    margin: 2em 0 0.75em;
    letter-spacing: -0.02em;
  }

  article h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 1.5em 0 0.5em;
  }

  article ul, article ol {
    padding-left: 1.75em;
    margin-bottom: 1.25em;
  }

  article li { margin-bottom: 0.4em; }

  article a { color: #0ea5e9; text-decoration: none; }
  article a:hover { text-decoration: underline; }

  article img {
    max-width: 95%;
    height: auto;
    display: block;
    margin: 1.5em 0;
    border-radius: 8px;
  }

  article pre {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px;
    overflow-x: auto;
    margin-bottom: 1.25em;
    font-size: 0.875em;
  }

  article code {
    font-family: 'Fira Code', 'Cascadia Code', Consolas, monospace;
    font-size: 0.875em;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 0.1em 0.4em;
  }

  article pre code {
    background: none;
    border: none;
    padding: 0;
  }

  article blockquote {
    border-left: 3px solid #38bdf8;
    padding: 4px 0 4px 20px;
    margin: 0 0 1.25em;
    color: #64748b;
    font-style: italic;
  }

  article hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 2em 0;
  }

  .comment-links {
    margin-top: 3em;
    padding-top: 1.5em;
    border-top: 1px solid #e2e8f0;
    font-size: 0.875rem;
    color: #64748b;
  }

  .comment-links a {
    color: #0ea5e9;
    text-decoration: none;
  }

  .comment-links a:hover {
    text-decoration: underline;
  }

  .copyright {
    font-size: 0.875rem;
    color: #64748b;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
  }

  .tag {
    display: inline-block;
    padding: 2px 10px;
    background: #e0f2fe;
    color: #0369a1;
    border-radius: 9999px;
    font-size: 0.75rem;
    text-decoration: none;
    transition: background 0.15s;
  }

  .tag:hover { background: #bae6fd; }

  .tag-post-list {
    list-style: none;
    margin-top: 24px;
  }

  .tag-post-list li {
    padding: 14px 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .tag-post-list li a {
    color: #0f172a;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
  }

  .tag-post-list li a:hover { color: #0ea5e9; }

  .tag-post-list li time {
    display: block;
    font-size: 0.8125rem;
    color: #64748b;
    margin-top: 2px;
  }
`;

function extractFirstImage(html: string): string | undefined {
  const match = /<img[^>]+src="([^"]+)"/.exec(html);
  if (!match) return undefined;
  const src = match[1];
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return `${BASE_URL}${src}`;
  return undefined;
}

function renderPage(
  title: string,
  currentSlug: string | null,
  bodyContent: string,
  meta?: { pageUrl?: string; postImage?: string; description?: string },
): string {
  const pageUrl = meta?.pageUrl ?? BASE_URL;
  const description = meta?.description ?? "";
  const ogImage = meta?.postImage ?? `${BASE_URL}/ogp.png`;
  const twitterImage = meta?.postImage ?? `${BASE_URL}/ogp2.png`;
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
      const bskyText = encodeURIComponent(`${title} / ${url}\n${bskyId}\n`);
      const xcomText = encodeURIComponent(`${title} / ${url}\n${xcomId}\n`);
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

const BASE_URL = "https://blog.kazto.dev";
const BLOG_TITLE = "kazto_dev blog";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRFC822(dateStr: string): string {
  return new Date(dateStr.replace(" ", "T")).toUTCString();
}

function toISO8601(dateStr: string): string {
  return new Date(dateStr.replace(" ", "T")).toISOString();
}

const app = new Hono();

function renderTags(tags: string[]): string {
  if (tags.length === 0) return "";
  const links = tags.map((t) => `<a href="/tags/${t}" class="tag">${t}</a>`).join("");
  return `<div class="tags">${links}</div>`;
}

app.get("/", (c) => {
  const latest = posts[0];
  if (!latest) return c.html(renderPage(BLOG_TITLE, null, "<p>記事がありません。</p>"));
  const body = `
    <div class="post-header">
      <h1>${latest.title}</h1>
      <time datetime="${latest.date}">${latest.date}</time>
      ${renderTags(latest.tags)}
    </div>
    <article>${latest.html}</article>`;
  return c.html(
    renderPage(`${latest.title} | ${BLOG_TITLE}`, latest.slug, body, {
      pageUrl: BASE_URL,
      postImage: extractFirstImage(latest.html),
      description: latest.description,
    }),
  );
});

app.get("/posts/:slug", ssgParams(posts.map((p) => ({ slug: p.slug }))), (c) => {
  const slug = c.req.param("slug");
  const post = posts.find((p) => p.slug === slug);
  if (!post) return c.notFound();
  const body = `
    <div class="post-header">
      <h1>${post.title}</h1>
      <time datetime="${post.date}">${post.date}</time>
      ${renderTags(post.tags)}
    </div>
    <article>${post.html}</article>`;
  return c.html(
    renderPage(`${post.title} | ${BLOG_TITLE}`, post.slug, body, {
      pageUrl: `${BASE_URL}/posts/${post.slug}`,
      postImage: extractFirstImage(post.html),
      description: post.description,
    }),
  );
});

app.get("/tags/:tag", ssgParams(allTags.map((tag) => ({ tag }))), (c) => {
  const tag = c.req.param("tag");
  const tagPosts = posts.filter((p) => p.tags.includes(tag));
  const items = tagPosts
    .map(
      (p) =>
        `<li><a href="/posts/${p.slug}">${p.title}</a><time>${p.date.slice(0, 10)}</time></li>`,
    )
    .join("");
  const body = `
    <div class="post-header">
      <h1>#${tag}</h1>
    </div>
    <ul class="tag-post-list">${items}</ul>`;
  return c.html(
    renderPage(`#${tag} | ${BLOG_TITLE}`, null, body, {
      pageUrl: `${BASE_URL}/tags/${tag}`,
    }),
  );
});

app.get("/feed.xml", (c) => {
  const items = posts
    .map(
      (p) => `
  <item>
    <title>${escapeXml(p.title)}</title>
    <link>${BASE_URL}/posts/${p.slug}</link>
    <guid isPermaLink="true">${BASE_URL}/posts/${p.slug}</guid>
    <pubDate>${toRFC822(p.date)}</pubDate>
    ${p.description ? `<description>${escapeXml(p.description)}</description>` : ""}
  </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BLOG_TITLE)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(BLOG_TITLE)}</description>
    <language>ja</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return c.body(xml, 200, { "Content-Type": "application/rss+xml; charset=utf-8" });
});

app.get("/atom.xml", (c) => {
  const updated = posts[0] ? toISO8601(posts[0].date) : new Date().toISOString();

  const entries = posts
    .map(
      (p) => `
  <entry>
    <title>${escapeXml(p.title)}</title>
    <link href="${BASE_URL}/posts/${p.slug}"/>
    <id>${BASE_URL}/posts/${p.slug}</id>
    <published>${toISO8601(p.date)}</published>
    <updated>${toISO8601(p.date)}</updated>
    ${p.description ? `<summary>${escapeXml(p.description)}</summary>` : ""}
  </entry>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(BLOG_TITLE)}</title>
  <link href="${BASE_URL}"/>
  <link href="${BASE_URL}/atom.xml" rel="self"/>
  <id>${BASE_URL}/</id>
  <updated>${updated}</updated>
  ${entries}
</feed>`;

  return c.body(xml, 200, { "Content-Type": "application/atom+xml; charset=utf-8" });
});

export default app;
