# Handoff

**Current:** SDE, Phase 4. Done: A1, A2, E2 (see `decisions/sde/stage1-foundations.md`).

**Next:** A3 storage spike: Payload S3 adapter → local Supabase Storage bucket `media` (S3 endpoint http://127.0.0.1:54321/storage/v1/s3, region `local`, keys from `npx supabase status -o env`), `next/image` remote pattern; fall back to disk locally if it fails. Then A4.

Local stack: `npx supabase start` (Docker must be running), `npm run migrate`, `npm run seed:admin`, `npm run dev`. Admin at http://localhost:3000/cms with the credentials in `.env`.
