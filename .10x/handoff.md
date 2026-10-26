# Handoff

**Current:** SDE, Phase 4. Done: A1–A4, B1–B6, C1–C7, D1–D3, E1–E3, F1 (see `decisions/sde/stage1-foundations.md`).

**Next:** F2 CI (build needs a migrated, seeded DB; run `npm run build`, start, `npm run test:e2e`), F3 Sentry + Analytics, F4 docs.

Local data: `npm run seed` (or `npm run seed:reset` to start over). Seeding rules: pass a fresh `context` object to every Local API call; check `errors` on bulk deletes and updates.
