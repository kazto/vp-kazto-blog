import { BASE_URL, BLOG_TITLE } from "./constants";
import { posts } from "./posts";

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function toRFC822(dateStr: string): string {
  return new Date(dateStr.replace(" ", "T")).toUTCString();
}

export function toISO8601(dateStr: string): string {
  return new Date(dateStr.replace(" ", "T")).toISOString();
}

export function buildRssFeed(): string {
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

  return `<?xml version="1.0" encoding="UTF-8"?>
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
}

export function buildAtomFeed(): string {
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

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(BLOG_TITLE)}</title>
  <link href="${BASE_URL}"/>
  <link href="${BASE_URL}/atom.xml" rel="self"/>
  <id>${BASE_URL}/</id>
  <updated>${updated}</updated>
  ${entries}
</feed>`;
}
