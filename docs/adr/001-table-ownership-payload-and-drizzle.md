# ADR-001: Payload owns staff-edited tables; Drizzle owns user-side tables in a separate schema

**Status:** Accepted
**Date:** 2026-10-22
**Feature:** stage1-foundations (affects stages 2–5)
**Author:** 10x-Team (Architect + Staff Engineer)

## Context

`tech-stack.md` lists both Payload CMS 3 and Drizzle ORM against the same Supabase Postgres database. Payload's Postgres adapter is itself built on Drizzle and generates and runs its own migrations for every collection. The stack's data model lists `verticals` and `enquiries` as plain tables, but staff are meant to work enquiries inside the Payload admin. Two migration systems writing to the same schema will eventually collide, and tables Payload does not own cannot be listed or edited in its admin without custom views.

## Decision

- Everything staff create or edit in the admin is a **Payload collection or global**: site content and media now; Verticals (including the enquiry routing email) now; enquiries in stage 2; admin views of candidates, job openings, courses and enrolments in stages 4–5.
- Payload's tables live in the Postgres schema **`payload`** (`schemaName: 'payload'`). Payload migrations are generated with `payload migrate:create` and committed.
- **Drizzle** arrives in stage 3 for tables written by the public through Supabase Auth (profiles, consents, candidate documents, applications), in the schema **`app`**, with its own committed drizzle-kit migrations. These tables carry row-level security.
- Where staff need to see `app` data (for example a candidate's documents), Payload reads it through a custom view backed by Drizzle queries, decided case by case in a later ADR.

## Alternatives Considered

| Alternative                                       | Pros                                 | Cons                                                                             | Why Not                                                                 |
| ------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Drizzle owns everything; Payload only for content | One migration tool for business data | Staff can't work enquiries in Payload without custom admin views for every table | Contradicts "teams work their enquiries in Payload"; adds admin UI work |
| Payload owns everything, no Drizzle               | One migration tool total             | Payload's access layer, not Postgres RLS, would guard public users' CVs          | Stack requires RLS for user documents; weaker defence in depth          |
| Both tools in the same schema                     | Simple setup                         | Migration collisions; one tool may drop the other's tables                       | Too risky                                                               |

## Consequences

### Positive

- Staff get a complete admin on everything they manage, with no custom UI.
- Public-user data is protected by RLS in Postgres, independent of app code.
- The two migration sets never touch each other's schema.

### Negative

- Two migration tools to run in CI and deploys from stage 3.
- Cross-schema reads from Payload need custom views.

### Risks

- A new staff-managed table lands in `app` by habit. Mitigation: rule in the staff-engineer standards and PR checklist.

## Dependencies

- Constrains stage 2 (enquiries as a Payload collection) and stage 3 (Drizzle in schema `app`).
- ADR-002 covers how access is enforced in each schema.
