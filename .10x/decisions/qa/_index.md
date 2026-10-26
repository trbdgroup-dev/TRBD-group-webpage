# QA — cross-cutting

- **Test pyramid:**
  - Vitest for pure logic and components (jsdom per file).
  - Playwright end-to-end at 1280px and 375px against a production build with seeded content.
  - axe on every key page.
- Tests that need a staff session reuse one login per run (global setup); they never log in per test.
- Run Lighthouse (mobile) on `/` and one vertical before every release. The target is LCP under 2.5 s, measured on the real host.

## Features

- [stage1-foundations](stage1-foundations.md)
