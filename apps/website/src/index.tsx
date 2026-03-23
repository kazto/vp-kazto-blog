import { Hono } from "hono";
import { ssgParams } from "hono/ssg";
import { BLOG_TITLE } from "./constants";
import { buildAtomFeed, buildRssFeed } from "./feed";
import { posts, allTags } from "./posts";
import { extractFirstImage, renderPage, renderTags } from "./render";

const app = new Hono();

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
      pageUrl: "https://blog.kazto.dev",
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
      pageUrl: `https://blog.kazto.dev/posts/${post.slug}`,
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
      pageUrl: `https://blog.kazto.dev/tags/${tag}`,
    }),
  );
});

app.get("/feed.xml", (c) => {
  return c.body(buildRssFeed(), 200, { "Content-Type": "application/rss+xml; charset=utf-8" });
});

app.get("/atom.xml", (c) => {
  return c.body(buildAtomFeed(), 200, { "Content-Type": "application/atom+xml; charset=utf-8" });
});

export default app;
