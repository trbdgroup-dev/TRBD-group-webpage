# SDE — stage1-foundations

What was built, deviations from plan, and tech debt, task by task.

## A1 Scaffold (2026-10-22)
**Built**
- Scaffolded with `create-payload-app@3.91.0 -t blank --db postgres --no-deps` in the scratchpad, then moved `src/` and configs into the repo root. Dropped template extras: Dockerfile, docker-compose (MongoDB), `.yarnrc`, `.npmrc` (`legacy-peer-deps` not needed; install had no peer conflicts), template README, sample route, template tests and Playwright config (Playwright returns in F1).
- Admin moved to `/cms`: `routes.admin`, folder `app/(payload)/cms/`, explicit `admin.importMap.importMapFile`, layout import updated. Import map and `payload-types.ts` regenerated.
- `payload.config.ts`: `schemaName: 'payload'`, `push: false`, `migrationDir: src/migrations` (ADR-001), `serverURL` from env.
- Env: `src/lib/parse-env.ts` (pure Zod parser, unit-tested) and `src/lib/env.ts` (eager `env` export). Split so tests can import the parser without real env.
- All dependency versions pinned exactly (next 16.4.2, payload/@payloadcms 3.91.0, react 19.2.6, zod 4.6.7, eslint 9.39.5, vitest 4.0.18, typescript 5.7.3).
- ESLint: native flat configs from `eslint-config-next` 16 (template's FlatCompat crashed with a circular-structure error); `no-console` (warn/error allowed) and `no-explicit-any` as errors.
- Prettier with `.prettierignore` (generated files, `.10x/`, mockups, the user's original `tech-stack.md`/PDF/HTML).
- Vitest: node environment, `tests/unit/**/*.test.{ts,tsx}`; components opt into jsdom per file.
- Placeholder home page and minimal frontend layout (replaced in A4/C*).

**Checks:** typecheck ✓ · lint ✓ · unit 4/4 ✓ · format ✓ · `next build` ✓ (Turbopack; `/` static, `/cms` dynamic).

**Deviations**
- `engines.node` set to `>=22.18.0` (template asked for `^22.23.4`, but Next 16.4.2 and sharp need only >=20.9; local machine has 22.18.0). Recommend upgrading to the latest Node 22 LTS before go-live.
- `@eslint/eslintrc` removed (no longer needed).

**Tech debt:** none.

## A2 Local Supabase + first migration (2026-10-23)
**Built**
- Supabase CLI 2.121.0 (devDependency); `supabase/config.toml` (project `trbd`, Postgres 17; realtime and analytics disabled locally). `npx supabase start` brings up DB on 54322, API/Storage on 54321, Studio on 54323.
- First Payload migration `src/migrations/20261023_092515_initial.ts` (users, sessions, media, kv, locked docs, preferences, migrations) applied to schema `payload`. `public` schema untouched.
- `seed/create-admin.ts` + `npm run seed:admin`: idempotent first super admin from `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` (local `.env` only; generated throwaway password; `.env.example` documents the variables).

**Verified:** `/` 200; `/cms` and `/cms/login` 200; `POST /api/users/login` with the seeded admin → 200 + token; wrong password → 401.

**Deviations**
- Payload's generated migration does not create its schema. Added `CREATE SCHEMA IF NOT EXISTS "payload"` at the top of the initial migration's `up`. Future migrations don't need it.
- Docker Desktop's engine was broken until the user restarted it (now Docker 29.9.2).

**Tech debt:** the `role` field on Users arrives in B1, which needs a new migration.

## E2 Stock photos (2026-10-23, done early)
- User approved the 11-photo shortlist (`seed/photo-shortlist.md`). Downloaded at 2400px wide (6.7 MB total) to `seed/images/`, each via Unsplash's download endpoint so it counts for the photographer. `seed/images/manifest.json` holds file, use, alt text, credit and source URL for the E3 seed.

## A3 Storage spike (2026-10-23) — succeeded, no fallback needed
**Built**
- `@payloadcms/storage-s3@3.91.0` on the Media collection → Supabase Storage public bucket `media` (declared in `supabase/config.toml`, created with `npx supabase seed buckets`). S3 protocol endpoint `<api>/storage/v1/s3`, `forcePathStyle`.
- `disablePayloadAccessControl` + `generateFileURL` → files served straight from `<api>/storage/v1/object/public/media/<file>` (no Payload proxy hop).
- `STORAGE_DRIVER` env (`s3` | `local`, default `local`); S3 vars required only for `s3` (unit-tested). `local` = Payload disk storage for CI/tests. `alwaysInsertFields: true` keeps the schema identical in both modes (verified: `migrate:create` in local mode reports no changes).
- Migration `20261023_093816_media_storage_fields` (`prefix`, `_objectkey` on media).
- `next.config.ts`: remote pattern derived from `S3_PUBLIC_URL`; `formats: avif, webp`; `dangerouslyAllowLocalIP` only when the media host is 127.0.0.1/localhost (Next 16 blocks local IPs by default).

**Verified:** upload via Local API → object in bucket; public URL 200 `image/jpeg` 417,796 bytes; delete removes the object; `/_next/image` 200 AVIF 34 KB / WebP 55 KB from the 418 KB original; disallowed host 400. Spike uploads and script removed; bucket empty.

**Notes for go-live:** production `S3_*` values come from the cloud Supabase project (Storage → S3 connection); `S3_PUBLIC_URL` = `https://<ref>.supabase.co/storage/v1/object/public/media`. Add to launch checklist.
