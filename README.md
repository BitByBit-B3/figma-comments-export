![BitByBit-B3](https://socialify.git.ci/BitByBit-B3/figma-comments-export/image?description=1&descriptionEditable=Export%20Figma%20comments%20to%20JSON%20via%20the%20REST%20API&font=Source%20Code%20Pro&name=1&owner=1&theme=Auto)

<div align="center">

![](https://img.shields.io/github/license/BitByBit-B3/figma-comments-export.svg?style=for-the-badge&color=blue)
![](https://img.shields.io/github/forks/BitByBit-B3/figma-comments-export.svg?style=for-the-badge)
![](https://img.shields.io/github/stars/BitByBit-B3/figma-comments-export.svg?style=for-the-badge)
![](https://img.shields.io/github/watchers/BitByBit-B3/figma-comments-export.svg?style=for-the-badge)
![](https://img.shields.io/github/issues/BitByBit-B3/figma-comments-export.svg?style=for-the-badge)
![](https://img.shields.io/github/languages/code-size/BitByBit-B3/figma-comments-export?style=for-the-badge)

## Frameworks/Technologies

![](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)

</div>

---

## About

The official Figma MCP server does not support reading comments. This tool fills that gap: it exports every comment thread from a Figma file — replies, resolved state, authors, and the node each comment is pinned to — as clean nested JSON, using only a Figma personal access token (PAT). Feed the output to your AI agent (Claude Code, Cursor, etc.) or any script that needs designer feedback.

- **Nested threads** — replies grouped under their parent comment, sorted chronologically, newest thread first (matches the Figma sidebar)
- **Resolved state** — know which feedback is done
- **Node IDs** — map each comment back to the frame/layer it's attached to
- **Accepts URLs or file keys** — paste any Figma file/design/board/proto/slides URL
- **Zero dependencies** — a single TypeScript file, runs with [Bun](https://bun.sh)

---

## Installation

```bash
git clone https://github.com/BitByBit-B3/figma-comments-export.git
cd figma-comments-export
```

Add your Figma personal access token to `.env` (Bun loads it automatically):

```bash
echo 'FIGMA_PAT=figd_your_token_here' > .env
```

To get a PAT: Figma → **Settings → Security → Personal access tokens** → generate a token with the **Comments (read)** scope.

---

## Usage/Examples

```bash
bun figma-comments.ts "https://www.figma.com/design/AbC123xyz/My-File"
# ✓ 12 threads, 34 comments → AbC123xyz-comments.json
```

A raw file key and an optional output path also work:

```bash
bun figma-comments.ts AbC123xyz feedback.json
```

### Arguments

`file` - `string` (required): A Figma file URL (`file`/`design`/`board`/`proto`/`slides`) or a raw file key.

`outfile` - `string`: Output path. Defaults to `<file-key>-comments.json`.

### Output

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

### Errors

| Status | Meaning |
|--------|---------|
| 403 | Token expired, or missing the Comments (read) scope |
| 404 | File doesn't exist, or your account can't access it |

---

## Use with AI agents (MCP workaround)

Since the Figma MCP server can't read comments, run this exporter first and hand the JSON to your agent:

```bash
bun figma-comments.ts <figma-url> comments.json
# then: "Read comments.json and address the unresolved design feedback"
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Summary of the MIT License

The **MIT License** is a permissive open-source license that allows users significant freedom with minimal conditions.

### Key Permissions:

1. **Freedom to Use**: You can use the software for any purpose, including commercial use.
2. **Freedom to Modify**: You are free to modify the software as needed.
3. **Freedom to Distribute**: You can distribute copies of the software, whether in its original or modified form.
4. **Freedom to Sell**: You can sublicense, distribute, and even sell the software.

### Key Conditions:

- **Attribution**: You must include the original copyright notice and the MIT license text in any copies or substantial portions of the software.

### No Warranty:

- The software is provided "as is," with no warranties or guarantees. The author is not liable for any damages arising from the use of the software.

---

## Contributing

Contributions from the community are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

---

## Code of Conduct

Please note that this project is governed by a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## Legal Disclaimer

This project is not affiliated with, endorsed by, or associated with Figma, Inc. or any of its products and services. All product and company names are trademarks or registered trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.

This tool uses the official, documented [Figma REST API](https://www.figma.com/developers/api#comments) with the user's own personal access token, and only accesses files that the token holder already has permission to view.
