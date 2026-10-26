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

## A4 Design tokens, fonts and shell (2026-10-23)
**Built**
- Tailwind 4.3.3 via `@tailwindcss/postcss`. Tokens in `src/app/(frontend)/globals.css` `@theme`: navy, ink, muted, line, white, cream, amber, amber-ink; `nav` breakpoint at 900px. Base styles (serif headings, amber focus ring, reduced-motion) and utilities `wrap`, `rule`, `section`.
- Fonts via `next/font/google` (self-hosted): Source Serif 4 (opsz axis) and Public Sans, exposed as `--font-source-serif` / `--font-public-sans` (distinct names so the theme's `--font-serif`/`--font-sans` don't reference themselves).
- `src/components/ui.tsx`: `Label`, `ButtonLink` (sm/md/lg), `MoreLink` (circled arrow), `SectionHeader` (single full-width rule; label + title left, intro right, as approved).
- Static `Header` (sticky, white; links hidden below 900px, Contact button always) and `Footer` (navy, vertical and company links). C1 swaps their hard-coded links for the Navigation global and Verticals.
- Frontend layout wires fonts, header, `<main id="main">`, footer. Placeholder home page exercises the primitives.
- `.claude/launch.json` (`trbd-dev`) so the desktop app's browser pane can run the dev server.

**Verified:** in the browser at 1280px (nav links visible, no horizontal overflow, computed fonts Source Serif 4 / Public Sans) and 375px (only logo + Contact, scrollWidth = 375); no console errors; build ✓.

**Deviations:** none. **Tech debt:** header/footer links hard-coded until C1.

## B1–B5 CMS content model (2026-10-23, verified 2026-10-26)
**Built**
- B1 Users: `name`, `role` (`super-admin` | `content-editor`, saved to JWT, only super admins may set it). Access: admin panel for any staff; super admins manage all users, editors read/update only themselves. Hook makes the first-ever user a super admin. `lib/access` (isStaff, isSuperAdmin, isSuperAdminOrSelf, publishedOrStaff, staffOnlyField, superAdminField) + unit tests. `seed:admin` now also upgrades an existing admin to super admin.
- B2 Media: required alt, caption, credit, sourceUrl; focal point; sizes thumbnail 400, card 960, hero 2000, og 1200×630; public read, staff write.
- B3 Globals: Site Settings (company, contact, social links, default OG image, Google/Bing verification) and Navigation (header links ≤6, header button, footer "Company" links). Shared `fields/link.ts` (page | vertical | home section | external, validated URL) and `fields/seo.ts`.
- B4 Verticals: all spec fields; fixed slug select (unique); drafts + autosave + scheduled publish, 50 versions; create/delete super admin only; `notificationEmail` staff-only at field level; `copyStatus`. `lib/slugs` (reserved slugs, validatePageSlug, slugify, pagePath) + unit tests.
- B5 Pages: title, slug (validated, unique), layout of 11 blocks (Hero, Section intro, Verticals list, Approach stages, Why points, Image and text, Stats, Testimonials, Call to action, Contact, Rich text), SEO; drafts like Verticals. Blocks share `anchorField`/`sectionHeaderFields`.
- Migration `20261023_095900_content_model` (47 tables incl. version tables).

**Verified (live, Local API with overrideAccess: false, 16/16 pass):** public sees only published verticals, never the team inbox, no draft pages, no users, can read site settings; staff see inbox and drafts; editor sees only own account, cannot create users or edit others, cannot promote self (role stays content-editor), can edit but not delete verticals; page slugs `manpower` and `cms` rejected with the reserved message; duplicate vertical slug rejected. Admin UI checked in the browser: dashboard groups Content/Admin/Settings, vertical and page edit screens render, block picker lists all 11 blocks, no console errors. Test data removed.

**Deviations**
- Navigation footer simplified to one "Company" link list: the approved footer's other column (Verticals) is generated from the Verticals collection, and the tagline lives in Site Settings.
- B6 (revalidation + preview) moved after C1 as planned in the EM dependency table.

**Tech debt / notes**
- Autosave means opening "Create new" saves an empty draft immediately (standard Payload behaviour with autosave). Harmless (drafts are never public), but editors may see empty drafts if they abandon a new item. Document in the content guide; revisit if it annoys editors.

## C1 Data layer + B6 revalidation and preview (2026-10-26)
**Built**
- `lib/payload.ts`: cached Payload client; draft-aware getters (`getSiteSettings`, `getNavigation`, `getVerticals`, `getVertical`, `getPage`) wrapped in React `cache()`. Public reads enforce access (`overrideAccess: false`); draft mode (only ever enabled for signed-in staff) reads drafts with access skipped.
- `lib/links.ts`: CMS link → href (`page`, `vertical`, home-section anchor, external with optional new tab).
- Header and Footer read Navigation, Site Settings and Verticals; the approved links are fallbacks while the CMS is empty. Footer verticals list is generated from Verticals.
- `lib/revalidate.ts` (B6): `revalidatePath` on publish/unpublish/delete. Pages → their path (and old path on slug change); Verticals, Media, Site Settings, Navigation → whole site (`/`, layout). Draft saves never revalidate. Errors outside a Next request (seed/CLI) are logged and skipped; `context.disableRevalidate` opts out.
- `/preview` (B6): requires `PREVIEW_SECRET` **and** a staff session (Payload auth from cookie), same-site path only (`lib/preview.safePreviewPath`); enables draft mode and redirects. `/preview/exit` disables it. `PreviewBar` (draft mode only) shows a notice + exit link and uses `RefreshRouteOnSave` for live preview. Admin `livePreview` for Pages and Verticals (mobile/tablet/desktop).
- `PREVIEW_SECRET` added to env schema (required, ≥16 chars); `preview` reserved as a page slug.
- `linkField({ required: false })`; Navigation header button is optional (migration `20261026_083348_optional_header_button`).

**Why revalidatePath, not tags:** Next 16 replaces `unstable_cache` with `'use cache'`, which needs Cache Components (a different rendering model for every route, including Payload's admin). Our pages are statically generated and read the DB at render, so path revalidation covers it without that risk. `revalidatePath` regenerates on the next visit with no stale window, matching "changes appear within seconds".

**Verified (production build + `next start`, 16/16):** default header before CMS content; publishing Navigation shows the new link on the very next request to the static `/`; header button label from CMS; draft vertical hidden from public footer; preview refuses wrong secret (401), no session (403), cross-site cookie request (403), off-site path (401); staff + secret → 307 home with draft cookie; preview shows the draft vertical and preview bar; public still doesn't; header button can be cleared; cleanup restores defaults. `/` stays static (○) in the build. Unit tests: 31.

**Found and fixed during verification:** the header button couldn't be cleared (link fields were always required) → optional link fields.

**Not yet verified:** the live preview pane inside the admin, visually. It's wired, but only becomes meaningful once page blocks render (C3–C6); check it then.

**Note:** Payload accepts the session cookie only with a same-site `Origin` or `Sec-Fetch-Site` header (CSRF protection). Browsers always send these on navigation, so editors are unaffected; scripted tests must send them.

## C2 heroReducer + C3 HeroSlideshow (2026-10-26)
**Built**
- `lib/hero/reducer.ts`: pure `heroReducer` (EXPLORE, SELECT, NEXT, TOGGLE_PAUSE, RESET) and `shouldAutoAdvance` (slides + unpaused + not hovered/focused + no reduced motion); 7 s `ROTATION_MS`. 9 unit tests.
- `components/HeroSlideshow.tsx` (client island): intro (label, the page's only `h1`, amber Explore button) and five server-rendered slides (`h2` headline, summary, "Learn more about …"), inactive ones `hidden`; slide/carousel ARIA roles; `aria-live` polite except while auto-rotating; progress segments; pause/play (lucide icons) shown only in the slideshow; tiles as buttons with `aria-current`; swipe row with scroll-snap below 900px, 5-column grid above. Intro background `priority`; vertical backgrounds render only after interest (hover/focus on the tile row or Explore button, or a click), so only the intro photo and 384px tile thumbnails load initially.
- `blocks/Hero/Component.tsx` maps the Hero block + Verticals (CMS order) to slides. `lib/media.ts` `toImage()` turns uploads into next/image props with the focal point as `object-position` (tested).
- `components/LogoLink.tsx`: on `/` the header logo dispatches `trbd:hero-reset`, scrolls to top and clears any `#hash`; elsewhere it's a normal link home.
- Home page renders the Hero from the `home` Pages document (other blocks in C4); friendly message if unpublished.
- `lucide-react` pinned at 1.55.0 (newest release at least two weeks old; the package publishes almost daily).

**Verified in the browser (dev server, temporary content):** 1280px — intro with real photo, five photo tiles, one h1, slides in HTML but hidden, no pause button; Explore → Manpower + pause button; auto-advance after 7 s → Education & Training; pause holds the slide past 7 s and shows "Play"; tile 4 → Green Energy; logo → intro, scrollY 0; only the intro (1920w) and tile thumbnails (384w) requested before interaction. 375px — swipe row with snap, page scrollWidth = 375. No console errors or hydration warnings. Build: `/` still static.

**Not verified in a browser:** reduced-motion (covered by unit tests; F1's Playwright run will emulate it).

**Bug found and fixed (matters for E3):** reusing one `context` object across Payload Local API calls made every upload after the first skip storage silently (DB record created, no file in the bucket). Payload writes to `context`; always pass a fresh object per call. The temporary content script now does.

**Temporary:** `seed/temp-hero-content.ts` loads 6 photos, 5 published verticals (HTML wording only) and a home page with the hero, for viewing C3–C7. Delete it in E3 (`… temp-hero-content.ts clean` removes its content).
