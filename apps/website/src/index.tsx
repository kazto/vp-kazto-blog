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
  html: string;
}

function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  content: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw };
  const yamlBlock = match[1];
  const content = match[2];
  const data: Record<string, string> = {};
  for (const line of yamlBlock.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line
      .slice(colonIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    data[key] = value;
  }
  return { data, content };
}

const posts: Post[] = Object.entries(postFiles)
  .map(([filePath, raw]) => {
    const slug = filePath.split("/").pop()!.replace(".md", "");
    const { data, content } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      html: marked.parse(content, { async: false }),
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

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
`;

function renderPage(title: string, currentSlug: string | null, bodyContent: string): string {
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
      const bskyText = encodeURIComponent(`${url}\n${bskyId}\n`);
      const xcomText = encodeURIComponent(`${url}\n${xcomId}\n`);
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

const app = new Hono();

app.get("/", (c) => {
  const latest = posts[0];
  if (!latest) return c.html(renderPage(BLOG_TITLE, null, "<p>記事がありません。</p>"));
  const body = `
    <div class="post-header">
      <h1>${latest.title}</h1>
      <time datetime="${latest.date}">${latest.date}</time>
    </div>
    <article>${latest.html}</article>`;
  return c.html(renderPage(`${latest.title} | ${BLOG_TITLE}`, latest.slug, body));
});

app.get("/posts/:slug", ssgParams(posts.map((p) => ({ slug: p.slug }))), (c) => {
  const slug = c.req.param("slug");
  const post = posts.find((p) => p.slug === slug);
  if (!post) return c.notFound();
  const body = `
    <div class="post-header">
      <h1>${post.title}</h1>
      <time datetime="${post.date}">${post.date}</time>
    </div>
    <article>${post.html}</article>`;
  return c.html(renderPage(`${post.title} | ${BLOG_TITLE}`, post.slug, body));
});

export default app;
