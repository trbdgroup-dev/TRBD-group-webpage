# Staff Engineer — cross-cutting

- TypeScript strict; pinned framework versions; Conventional Commits.
- Server Components by default; client islands only where interaction requires.
- Pure logic (SEO, access, slugs, state reducers) lives in `src/lib/` with unit tests.
- Env read only through Zod-validated `src/lib/env.ts`.
- ADR-001/002 rules decide where new data lives and how access is enforced.

## Features
- [stage1-foundations](stage1-foundations.md)
