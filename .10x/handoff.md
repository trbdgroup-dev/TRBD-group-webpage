# Handoff

**Current:** SDE, Phase 4. Done: A1–A4, B1–B6, C1–C7, D1–D3, E1–E3 (see `decisions/sde/stage1-foundations.md`).

**Next:** F1 Playwright specs (port the C7 scan: axe on key pages at 1280 and 375, skip link, reduced motion), F2 CI, F3 Sentry + Analytics, F4 docs.

Local data: `npm run seed` (or `npm run seed:reset` to start over). Seeding rules: pass a fresh `context` object to every Local API call; check `errors` on bulk deletes and updates.
