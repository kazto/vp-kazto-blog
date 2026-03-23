import { marked } from "marked";
import type { Post } from "./types";

const postFiles = import.meta.glob("../../../posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

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

export const posts: Post[] = Object.entries(postFiles)
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

export const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();
