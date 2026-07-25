# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-25

### Added

- Initial release: export Figma comments as nested JSON via the Figma REST API
- Accepts Figma URLs (file/design/board/proto/slides) or raw file keys
- Nested thread structure with replies, resolved state, author, and node IDs
- Friendly error hints for 403 (token/scope) and 404 (missing/inaccessible file)
