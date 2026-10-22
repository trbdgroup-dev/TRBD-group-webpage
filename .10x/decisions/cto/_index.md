# CTO — cross-cutting

Baseline: `tech-stack.md` (agreed 21 Oct 2026). Stack accepted as-is. Review notes, 22 Oct 2026:

## Needs a decision (affects design)
1. **Payload vs Drizzle table ownership.** Payload's Postgres adapter already uses Drizzle and generates its own migrations. Staff "work enquiries in Payload", so `verticals` and `enquiries` should be Payload collections, not hand-written Drizzle tables, or the admin can't show them without custom views. Proposal: Payload owns everything staff edit (content, verticals, enquiries, later candidates/courses admin views); Drizzle owns only user-side tables (profiles, consents, candidate documents) in a separate Postgres schema (e.g. `app`) so the two migration sets never collide.
2. **Row-level security scope.** Payload connects with a privileged DB role that bypasses RLS, so "vertical team sees only their vertical" is enforced by Payload access control, not RLS. RLS protects the Supabase Auth paths (/account, Storage). Document this split rather than claiming DB-level enforcement everywhere.

## Verify before scaffolding
3. Payload 3 release that officially supports Next.js 16 — pin both versions together.
4. Next.js 16 renamed `middleware.ts` to `proxy.ts`; the architecture's "Middleware" box maps to that.
5. Serverless DB connections: use Supabase's pooler (transaction mode) for Vercel functions; direct connection only for migrations.

## Minor
6. Sentry and Resend store data outside India; scrub PII from Sentry events and keep email bodies minimal. DPDP permits transfer except to notified countries, so not a blocker.
7. Payload media → Supabase Storage via Payload's S3 storage adapter (Supabase exposes an S3-compatible endpoint).

## Decided
- 2026-10-22: Greenfield build in `C:\Users\vinua\Documents\TRBD`. The landing page HTML is the design system (tokens, fonts, layout) and content source. No Web3Forms migration needed.
- 2026-10-22: Stage 1 approach A approved (full CMS content model now). Rejected: B (code-first pages, Payload later: rework and contradicts stack), C (Pages-only, no Verticals collection: no routing email for stage 2, duplicated content).
