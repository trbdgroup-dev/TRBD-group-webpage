# Handoff

**Current:** SDE, Phase 4. Done: A1–A4, B1–B6, C1, E2 (see `decisions/sde/stage1-foundations.md`).

**Next:** C2 `heroReducer` + tests, C3 `HeroSlideshow`, C4 main blocks + `RenderBlocks`, C5 other blocks + privacy page, C6 `/[vertical]`, C7 404/polish. Data getters live in `lib/payload.ts`; links resolve via `lib/links.ts`. When pages render, visually check the admin's live preview pane (B6 item not yet verified visually).

Local stack: Docker Desktop → `npx supabase start` → `npm run migrate` → `npm run seed:admin` → browser pane `trbd-dev`. CMS is empty until E3; header/footer fall back to defaults.
