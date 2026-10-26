# QA — stage1-foundations

Full report: `.10x/reviews/2026-10-26-qa-report.md`.

- 2026-10-26: Verification passed.
  - Unit tests: 85/85.
  - End-to-end: 59 passed, plus 7 skipped by design.
  - axe: clean.
  - Lighthouse mobile after fixes: performance 94, accessibility 100, best practices 100.
- 2026-10-26: Performance fixes made during the review:
  - LCP image fetched with high priority; tile images with low priority.
  - Source Serif without the opsz axis.
  - Browser Sentry and the live-preview library loaded lazily.
- 2026-10-26: Accepted:
  - Simulated LCP of 2.9–3.1 s (target 2.5 s), pending measurement on Vercel.
  - End-to-end tests in Chromium only.
  - The segment error page isn't tested in a browser.
- 2026-10-26: The CI run on GitHub couldn't be verified from here (private repository). The user will check the Actions tab.
