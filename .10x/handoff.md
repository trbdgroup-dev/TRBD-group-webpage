# Handoff

**From:** SDE (Phase 4, complete) → **To:** QA + Security (Phase 5)

Stage 1 is built: all tasks A1–F4 done (see `decisions/sde/stage1-foundations.md`). Local stack: Docker Desktop → `npx supabase start` → `npm run migrate` → `npm run seed` → `npm run build` → `npm run test:e2e`.

**For QA:** unit 77, e2e 59 (+7 intentional skips) at 1280/375; axe clean on key pages; reduced motion and keyboard verified. Review coverage gaps: segment `error.tsx` page never rendered in a browser; production robots.txt branch only unit-tested; no load/performance measurement on real infrastructure (Lighthouse is on the launch checklist).

**For Security:** review `/preview` (secret + staff session + same-site redirect), access rules (`src/lib/access`, verified live 16/16 in B), JSON-LD escaping, Sentry scrubbing (verified with a stand-in endpoint), CSRF behaviour of Payload cookie auth, secrets handling (`.env` gitignored, CI uses throwaway values), dependency audit, security headers (none beyond X-Robots-Tag yet: consider CSP, HSTS, frame-ancestors).

Docs: `README.md`, `docs/architecture.md`, `docs/content-guide.md`, `docs/launch-checklist.md`, ADRs in `docs/adr/`.
