#!/usr/bin/env bun
/**
 * Export Figma comments as nested JSON.
 *
 *   bun figma-comments.ts <file-url-or-key> [outfile.json]
 *
 * Reads FIGMA_PAT from .env (Bun loads it automatically).
 */

const token = process.env.FIGMA_PAT;
if (!token) {
  console.error("✗ FIGMA_PAT not found. Add it to .env in this directory.");
  process.exit(1);
}

const target = Bun.argv[2];
if (!target) {
  console.error("Usage: bun figma-comments.ts <file-url-or-key> [outfile.json]");
  process.exit(1);
}

const keyMatch = target.match(/\/(?:file|design|board|proto|slides|deck)\/([A-Za-z0-9]{10,})/);
const fileKey = keyMatch ? keyMatch[1] : target;

type RawComment = {
  id: string;
  parent_id: string;
  user: { id: string; handle: string; email?: string };
  created_at: string;
  resolved_at: string | null;
  message: string;
  client_meta?: { node_id?: string } | null;
};

type Comment = {
  id: string;
  author: string;
  created_at: string;
  resolved: boolean;
  node_id: string | null;
  message: string;
  replies: Comment[];
};

const res = await fetch(`https://api.figma.com/v1/files/${fileKey}/comments`, {
  headers: { "X-Figma-Token": token },
});

if (!res.ok) {
  const hint =
    res.status === 403
      ? " — token expired, or missing the Comments (read) scope"
      : res.status === 404
        ? " — no such file, or your account can't see it"
        : "";
  console.error(`✗ ${res.status} ${res.statusText}${hint}`);
  process.exit(1);
}

const { comments = [] } = (await res.json()) as { comments: RawComment[] };

const byId = new Map<string, Comment>();
const flat = comments.map((c) => {
  const node: Comment = {
    id: String(c.id),
    author: c.user?.handle || c.user?.email || "Unknown",
    created_at: c.created_at,
    resolved: Boolean(c.resolved_at),
    node_id: c.client_meta?.node_id ?? null,
    message: c.message ?? "",
    replies: [],
  };
  byId.set(node.id, node);
  return { node, parentId: c.parent_id ? String(c.parent_id) : null };
});

const threads: Comment[] = [];
for (const { node, parentId } of flat) {
  const parent = parentId ? byId.get(parentId) : undefined;
  if (parent) parent.replies.push(node);
  else threads.push(node);
}

const sortDeep = (nodes: Comment[]) => {
  nodes.sort((a, b) => a.created_at.localeCompare(b.created_at));
  for (const n of nodes) sortDeep(n.replies);
};
sortDeep(threads);
threads.reverse(); // newest thread first, matching the Figma sidebar

const outFile = Bun.argv[3] ?? `${fileKey}-comments.json`;
await Bun.write(
  outFile,
  JSON.stringify(
    {
      file_key: fileKey,
      exported_at: new Date().toISOString(),
      thread_count: threads.length,
      comment_count: comments.length,
      threads,
    },
    null,
    2,
  ),
);

console.log(`✓ ${threads.length} threads, ${comments.length} comments → ${outFile}`);
