# Figma Comments Export

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Runtime: Bun](https://img.shields.io/badge/Runtime-Bun-black)](https://bun.sh)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Export Figma comments to JSON** — a tiny CLI that pulls every comment thread from a Figma file using the Figma REST API and a personal access token (PAT).

> **Why?** The official [Figma MCP server](https://www.figma.com/developers) doesn't support reading comments. If you want your AI agent (Claude Code, Cursor, etc.) or your scripts to see designer feedback, this tool exports the full comment tree — threads, replies, resolved state, and the node each comment is pinned to — as clean nested JSON.

## Features

- **Nested threads** — replies are grouped under their parent comment, sorted chronologically, newest thread first (matches the Figma sidebar)
- **Resolved state** — know which feedback is done
- **Node IDs** — each comment includes the `node_id` it's attached to, so you can map feedback back to specific frames/layers
- **Accepts URLs or file keys** — paste any Figma file/design/board/proto/slides URL
- **Zero dependencies** — a single TypeScript file, runs with [Bun](https://bun.sh)

## Quick start

```bash
git clone https://github.com/BitByBit-B3/figma-comments-export.git
cd figma-comments-export

# Add your Figma personal access token
echo 'FIGMA_PAT=figd_your_token_here' > .env

# Export comments
bun figma-comments.ts "https://www.figma.com/design/AbC123xyz/My-File"
# ✓ 12 threads, 34 comments → AbC123xyz-comments.json
```

You can also pass a raw file key and an optional output path:

```bash
bun figma-comments.ts AbC123xyz feedback.json
```

## Getting a Figma PAT

1. Figma → **Settings → Security → Personal access tokens**
2. Generate a token with the **Comments (read)** scope (or File content read)
3. Put it in `.env` as `FIGMA_PAT=...` — Bun loads `.env` automatically

## Output format

```json
{
  "file_key": "AbC123xyz",
  "exported_at": "2026-07-25T12:00:00.000Z",
  "thread_count": 2,
  "comment_count": 5,
  "threads": [
    {
      "id": "123",
      "author": "jane.doe",
      "created_at": "2026-07-20T09:30:00Z",
      "resolved": false,
      "node_id": "12:345",
      "message": "Can we bump the contrast here?",
      "replies": [
        {
          "id": "124",
          "author": "john",
          "created_at": "2026-07-20T10:00:00Z",
          "resolved": false,
          "node_id": null,
          "message": "On it",
          "replies": []
        }
      ]
    }
  ]
}
```

## Use with AI agents (MCP workaround)

Since the Figma MCP server can't read comments, run this exporter first and feed the JSON to your agent:

```bash
bun figma-comments.ts <figma-url> comments.json
# then: "Read comments.json and address the unresolved design feedback"
```

## Errors

| Status | Meaning |
|--------|---------|
| 403 | Token expired, or missing the Comments (read) scope |
| 404 | File doesn't exist, or your account can't access it |

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines, and please follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) © BitByBit-B3
