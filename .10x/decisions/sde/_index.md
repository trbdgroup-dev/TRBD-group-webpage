# SDE — cross-cutting

- Package manager: npm, exact versions pinned.
- Seeding: fresh `context` object per Payload Local API call; check `errors` on bulk operations; `payload run` doesn't forward CLI flags (use env vars).
- Pin new packages to the newest release at least two weeks old.
- npm 11 locally and in CI (CI installs npm 11.6.2 because Node 22 ships npm 10). After changing dependencies, check the lockfile on Linux: `docker run --rm -v <copy>:/app -w /app node:22 npm ci --dry-run` (npm on Windows can leave out other platforms' optional packages).
- Checks before every commit: `npm run typecheck`, `npm run lint`, `npm test`, `npm run format:check`, and `npm run build` for structural changes.

## Features
- [stage1-foundations](stage1-foundations.md)
