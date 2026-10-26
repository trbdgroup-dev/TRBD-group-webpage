# Handoff

**From:** QA + Security (Phase 5, complete) **To:** user / DevOps (launch)

Stage 1 is built and verified. Reports: `reviews/2026-10-26-qa-report.md` and `reviews/2026-10-26-security-review.md`.

**State:** unit 85/85; end-to-end 59 (+7 intentional skips); axe clean; Lighthouse mobile 94/100/100 (SEO held down only by the deliberate noindex on non-production builds); security probe 30/30. Security headers, safe CMS links, GraphQL off, lazy Sentry and live preview, audit fixes are all in.

**Next:**
1. Check the GitHub Actions run (couldn't be checked from here).
2. Work through `docs/launch-checklist.md`: create the accounts, connect Supabase, Vercel and Sentry, deploy, then the live checks (headers, LCP under 2.5 s on Vercel, robots, Sentry test event).
3. Stage 2 (the enquiry form) can start in parallel; add a script CSP with nonces at that point.

**Accepted risks:** happy-dom and esbuild advisories, no script CSP yet, browser errors before Sentry loads aren't reported, simulated LCP of 2.9–3.1 s pending real measurement.
