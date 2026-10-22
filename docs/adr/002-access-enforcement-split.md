# ADR-002: Staff access is enforced by Payload; public-user access by Postgres RLS

**Status:** Accepted
**Date:** 2026-10-22
**Feature:** stage1-foundations (affects stages 2–5)
**Author:** 10x-Team (Architect + Staff Engineer)

## Context
`tech-stack.md` says access rules are enforced "in the database (row-level security) as well as in the app". Payload connects to Postgres with a privileged role that bypasses RLS, so RLS cannot restrict what a staff member sees in the admin (for example, one vertical team's enquiries). Claiming database enforcement there would be false comfort.

## Decision
- **Staff (Payload, schema `payload`):** enforced by Payload access-control functions at collection and field level.
  - Stage 1: the public reads published documents only; `Verticals.notificationEmail` is readable only by signed-in staff; only super admins manage users.
  - Stage 2 adds `vertical-team` scoping by each user's assigned verticals.
- **Public users (Supabase Auth, schema `app` and Storage, from stage 3):** enforced by RLS policies keyed on `auth.uid()`, plus app-level checks. Private bucket files are served only through short-lived signed URLs.
- Access functions live in `src/lib/access/` and are unit-tested; each later stage adds tests for its own rules.
- Public routes never use the Payload database connection to read `app` tables; they use the Supabase client with the user's session.

## Alternatives Considered
| Alternative | Pros | Cons | Why Not |
|---|---|---|---|
| Run Payload with a non-bypass role and write RLS for staff | Database-level guarantee for staff too | Payload has no per-request Postgres role; needs `SET ROLE`/claims per query; fragile, unsupported | Complexity far beyond the risk |
| App-level checks only, everywhere | Simplest | No defence in depth for CVs and identity documents | Fails the stack's security goal for sensitive data |

## Consequences
### Positive
- Each rule sits where it can actually be enforced, and tests prove it.

### Negative
- Staff-side bugs in access functions are not caught by the database. Mitigation: unit tests and review.

### Risks
- A future public route reads `app` tables through the privileged Payload connection, bypassing RLS. Mitigation: the rule above, a lint-level import restriction in stage 3, and review.

## Dependencies
- ADR-001 (schemas). Stage 2 and 3 designs must add their access tests.
