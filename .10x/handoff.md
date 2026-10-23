# Handoff

**Current:** SDE, Phase 4. Done: A1–A4, E2 (see `decisions/sde/stage1-foundations.md`).

**Next:** B1 Users roles + `lib/access` with unit tests (new migration), then B2 Media fields/sizes, B3 globals, B4 Verticals + slugs, B5 Pages + blocks.

Local stack: Docker running → `npx supabase start` → `npm run migrate` → `npm run seed:admin` → `npm run dev` (or browser pane `trbd-dev`). `.env` has `STORAGE_DRIVER=s3` pointing at local Supabase Storage.
