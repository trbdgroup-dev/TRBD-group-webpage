# SDE — cross-cutting

- Package manager: npm, exact versions pinned.
- Seeding: fresh `context` object per Payload Local API call; check `errors` on bulk operations; `payload run` doesn't forward CLI flags (use env vars).
- Pin new packages to the newest release at least two weeks old.
- Checks before every commit: `npm run typecheck`, `npm run lint`, `npm test`, `npm run format:check`, and `npm run build` for structural changes.

## Features
- [stage1-foundations](stage1-foundations.md)
