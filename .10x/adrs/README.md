# ADRs

Per the project's documentation plan (`tech-stack.md`, spec §9), Architecture Decision Records live in **`docs/adr/`** so they ship with the codebase. This folder only indexes them.

| ADR | Title | Status |
|---|---|---|
| [001](../../docs/adr/001-table-ownership-payload-and-drizzle.md) | Payload owns staff-edited tables; Drizzle owns user-side tables in a separate schema | Accepted |
| [002](../../docs/adr/002-access-enforcement-split.md) | Staff access by Payload; public-user access by Postgres RLS | Accepted |
| [003](../../docs/adr/003-hero-intro-then-on-demand-slideshow.md) | Hero opens on a static intro; slideshow only on user action | Accepted |
