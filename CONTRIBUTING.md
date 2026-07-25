# Contributing

Thanks for your interest in improving figma-comments-export!

## Getting started

1. Fork and clone the repo
2. Install [Bun](https://bun.sh) (v1.0+)
3. Copy `.env.example` to `.env` and add your Figma PAT
4. Run the script against any Figma file you have access to:

   ```bash
   bun figma-comments.ts <figma-url>
   ```

## Guidelines

- Keep it dependency-free — the whole point is a single-file tool that runs with just Bun.
- Match the existing code style (TypeScript, explicit types for API shapes).
- For new features (Markdown export, filters, MCP wrapper), open an issue first so we can discuss the approach.

## Submitting changes

1. Create a feature branch (`git checkout -b feat/my-feature`)
2. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, …)
3. Open a pull request with a clear description of what and why

## Reporting bugs

Open an issue with:
- The command you ran (redact your file key if private)
- The full error output
- Your Bun version (`bun --version`)
