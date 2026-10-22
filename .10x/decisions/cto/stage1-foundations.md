# CTO — stage1-foundations

**Date:** 2026-10-22 · **Spec:** `.10x/specs/2026-10-22-stage1-foundations-design.md`

## Verdict
Build. A consultancy with five verticals and no web presence needs a credible, search-visible site before anything else; every later stage (enquiries, registration, modules) plugs into this foundation.

## Build vs buy
- Site builder (Webflow, Wix, WordPress): rejected. Stages 2–5 need custom data (enquiry routing, candidate CVs, enrolments, DPDP consent) on one codebase and one database; a site builder would be thrown away at stage 2–3.
- Payload (open source, in-app) over a hosted CMS (Sanity, Contentful): no per-seat fees, content lives in our own Postgres in Mumbai, same admin later works enquiries.

## Tech direction (pinned 2026-10-22)
| Package | Version | Note |
|---|---|---|
| next | 16.4.2 | Payload's peer range for 16.x is `>=16.3.3 <17` |
| payload, @payloadcms/* | 3.91.0 | next, db-postgres, storage-s3, richtext-lexical, live-preview-react |
| tailwindcss | 4.3.x | |
| Node | 22 LTS (local 22.18.0) | Payload needs >=20.18.1 |
| Drizzle | not installed in stage 1 | arrives in stage 3 (ADR-001) |

Exact versions are pinned in `package.json` (no `^`) and bumped deliberately.

## Cost in stage 1
Zero while local. At go-live: Vercel Pro $20/mo; Supabase free tier is enough for stage 1 (no personal data stored); domain ~$15/yr.

## Risks owned
- Payload/Next major-version drift → pinned versions, upgrade via PR with CI.
- Supabase S3 adapter locally → spike in task 1.3; disk fallback locally only.
