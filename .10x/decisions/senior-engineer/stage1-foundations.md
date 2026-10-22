# Senior Engineer — stage1-foundations

**Date:** 2026-10-22 · Implementation approach per task (see EM task list for order).

## A1 Scaffold
- `create-payload-app` refuses non-empty folders: scaffold `npx create-payload-app@3.91.0 -t blank --db postgres` into a temp folder, move files to the repo root, keep our existing docs. Rename `app/(payload)/admin` → `app/(payload)/cms`; set `routes: { admin: '/cms' }`.
- Pin exact versions; add scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `seed`, `payload`, `generate:types`, `migrate`, `migrate:create`.
- `src/lib/env.ts`: Zod schema; server-only import guard.

## A2 Database
- `npx supabase init` (commit `supabase/config.toml`), `npx supabase start`. Local DB: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`.
- `postgresAdapter({ schemaName: 'payload', push: false, pool: { connectionString } , migrationDir: 'src/migrations' })`. Migrations from day one so local, CI and prod match.

## A3 Storage spike
- Supabase local S3: endpoint `http://127.0.0.1:54321/storage/v1/s3`, `forcePathStyle: true`, keys from `supabase status`. Bucket declared in `config.toml` (`[storage.buckets.media] public = true`).
- Public URL pattern `/storage/v1/object/public/media/<key>`; set Payload `generateFileURL` (or `disablePayloadAccessControl: true`) so `next/image` loads straight from Storage; add `images.remotePatterns`.

## A4 Design tokens
- `@theme` in `globals.css` with the spec colours; `next/font/google` `Source_Serif_4` (opsz axis) and `Public_Sans`, exposed as CSS variables.
- Port mockup layout primitives: `.wrap` → container utility, label, rule, more-link, button as small components (`Label`, `Rule`, `MoreLink`, `Button`).

## B1–B5 Content model
- Access helpers are plain functions of `{ req }` returning boolean or a `Where` (`publishedOrStaff` → `{ _status: { equals: 'published' } }` for anonymous).
- `notificationEmail`: `access: { read: staffOnlyField }`, plus `admin.description` explaining routing.
- Slugs: Verticals slug is a `select` of the five fixed values (unique). Pages slug `text` with `validate` calling `lib/slugs.validateSlug` (reserved list + query Verticals for collision).
- `seo` group as a reusable field factory `seoFields()`.
- Blocks: `blocks/<Name>/config.ts` exports `Block`; `blocks/index.ts` exports the array and a `RenderBlocks` component mapping `blockType` → Component.

## B6 Revalidation and preview
- One module `lib/revalidate.ts`: tag names `page:<slug>`, `vertical:<slug>`, `verticals`, `globals`. Pages fetch through functions tagged with these.
- Next 16 caching: confirm the 16.4 API (`'use cache'` + `cacheTag` vs `unstable_cache`; `revalidateTag(tag, profile)` signature) before writing; wrap in our module so call sites don't change.
- Hooks wrap revalidation in try/catch, log, never throw. Skip revalidation during seeding (`context.disableRevalidate`).
- `/api/preview?secret=…&path=…`: checks `PREVIEW_SECRET`, enables draft mode, redirects to path (path must start with `/`, no open redirect).

## C Frontend
- `lib/payload.ts`: `getPayload({ config })` cached; getters accept `{ draft }` from `draftMode()`; `overrideAccess: false` for public reads, and `depth` set explicitly.
- `heroReducer(state, action)`: state `{ mode: 'intro' | 'slides', index, paused }`; actions `EXPLORE`, `SELECT(i)`, `NEXT`, `TOGGLE_PAUSE`, `RESET`. Timer lives in the component: `useEffect` interval when `mode === 'slides' && !paused && !hovering && !reducedMotion`.
- Logo reset: Header dispatches a `trbd:hero-reset` window event only on the home route (`usePathname() === '/'`); on other routes it is a normal link to `/`.
- `VerticalGraphic`: render the photo as a CSS circle (`rounded-full overflow-hidden` + `next/image fill` + navy tint overlay) layered over an absolutely positioned SVG for the amber blocks and connector lines. Keeps `next/image` optimisation, which an SVG `clipPath` around an `<image>` would lose.
- Vertical page fallbacks: service full description → short description; omit empty sections.
- Mailto: `mailto:${email}?subject=${encodeURIComponent('Enquiry: ' + name)}`.

## D SEO
- `buildMetadata({ doc, settings, path })` pure; returns Next `Metadata`. JSON-LD builders return plain objects; `<JsonLd data>` component serialises with `JSON.stringify(...).replace(/</g, '\\u003c')`.
- `robots.ts` reads `process.env.VERCEL_ENV`; `next.config` `headers()` adds `X-Robots-Tag: noindex` when not production.

## E Seed
- Base publish then draft: `payload.create({ collection: 'verticals', data: base, draft: false })`, then `payload.update({ id, data: { ...expanded, copyStatus: 'draft-needs-review' }, draft: true })`. Idempotent by slug lookup.
- Media: upload from `seed/images/*` with `filePath`; alt and credit from a manifest JSON.

## F Quality
- Playwright `webServer`: `npm run build && npm run start` on a seeded DB. Projects `desktop-chromium` (1280×800) and `mobile-chromium` (375×812).
- CI uses `postgres:17` service; Supabase storage replaced by local disk adapter via env flag `STORAGE_DRIVER=local`.

## Tricky parts to watch
1. Next 16 cache API vs Payload examples (B6).
2. Hero hydration: server markup must match the reducer's initial state exactly (intro).
3. Draft versions in seed must not leak into published reads (e2e guard).
4. `next/image` with Supabase Storage URLs in local dev (remote pattern host `127.0.0.1:54321`).
