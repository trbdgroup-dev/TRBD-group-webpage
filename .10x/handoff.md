# Handoff

**Current:** SDE, Phase 4. Done: A1–A4, B1–B6, C1–C7, E2 (see `decisions/sde/stage1-foundations.md`).

**Next:** D1 metadata builder + generateMetadata, D2 sitemap/robots/JSON-LD, D3 OG image; then E1 draft copy, E3 seed (replaces temp content), F1 Playwright specs (port the C7 scan: axe on key pages at 1280 and 375, skip link, reduced motion), F2 CI, F3 Sentry + Analytics, F4 docs.

Local data: temporary content from `seed/temp-hero-content.ts` (home, privacy, sample-blocks pages; delete in E3). Seeding rules: pass a fresh `context` object to every Local API call; check `errors` on bulk deletes and updates.
