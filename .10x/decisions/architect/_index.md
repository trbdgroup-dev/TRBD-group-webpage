# Architect — cross-cutting

- One Next.js 16 app with Payload 3 embedded (`app/(frontend)`, `app/(payload)`), admin at `/cms`.
- Postgres schemas: `payload` (Payload-owned, all staff-edited data) and, from stage 3, `app` (Drizzle, public-user data with RLS). See ADR-001, ADR-002.
- Frontend reads through the Payload Local API in `lib/payload.ts`; never through REST from server components.
- Public pages are statically generated and revalidated by tag from Payload hooks.

## Features
- [stage1-foundations](stage1-foundations.md)
