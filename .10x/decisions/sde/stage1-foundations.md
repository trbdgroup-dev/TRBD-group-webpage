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

## C4 Home page sections (2026-10-26)
**Built**
- `blocks/RenderBlocks.tsx`: renders a page's blocks in order (Image and text, Stats, Testimonials, Rich text arrive in C5).
- Components: Section intro (white), Verticals list (cream; compact alternating rows from Verticals, "Learn more" with screen-reader text naming the vertical), Approach stages (white; 1/2/4 columns), Why points (cream; white cards with amber top edge and lucide icons from the fixed set), Contact (white; Site Settings details with empty rows hidden, `mailto:` button, `tel:` link when a phone exists), Call to action (cream strip).
- `components/VerticalGraphic.tsx`: the mockup's three compositions — photo in a navy-tinted circle (next/image, focal point honoured), amber blocks behind, navy outline and connector lines in front; geometry from a 500×400 viewBox converted to percentages.
- Home page renders the `home` document through RenderBlocks. Sections carry `id` from the block's anchor; `[id] { scroll-margin-top: 72px }` keeps anchors clear of the sticky header.

**Bug found and fixed:** the custom `nav` breakpoint was `900px` while Tailwind's built-ins are rem, so Tailwind emitted it before `sm` and `sm:` utilities won at desktop (Approach showed 2 columns, Why 2). Now `56.25rem` (still 900px), sorted after `sm`.

**Verified in the browser (temporary content using only the HTML file's wording):** 1280px — Who we are, What we do rows with real photos in the circle graphics, How we work in 4 columns, Why TRBD in 3, Contact details, footer; hero tiles still a 5-column grid; one h1; sections in the approved order. 375px — everything in one column, page scrollWidth 375. No console errors. Build: `/` static.

**Note:** Contact's "Website" row shows the host from `NEXT_PUBLIC_SITE_URL` (localhost locally, www.trbdgroup.com in production).

## C5 Remaining blocks + page route (2026-10-26)
**Built**
- `components/RichText.tsx`: Payload's Lexical JSX renderer with internal links resolved to page/vertical paths; `.rich-text` styles in globals.css (headings, lists, links, quotes, rules, 1em rhythm).
- Blocks: Image and text (image side choice, 4:3 photo, rich text), Stats (cream band, `dl`; renders nothing when empty), Testimonials (`figure`/`blockquote` cards; nothing when empty), Rich text (720px reading column). `RenderBlocks` now handles all 11 block types, with an exhaustive `never` check so a new block type without a component fails typecheck.
- `app/(frontend)/[slug]/page.tsx`: CMS pages at the top level. Pages without a leading Hero get an `h1` title header. `generateStaticParams` builds every published page (except `home`, which lives only at `/`); later pages render on first visit. Vertical slugs return 404 until C6 adds them to this route. `lib/payload.listPublishedPageSlugs()` reads without draft mode for build time.

**Bug found and fixed:** `.rich-text p { margin: 0 }` out-ranked the `> * + *` spacing rule, so paragraphs ran together; removed.

**Verified in the browser (temporary content):** `/privacy` — one h1, three h2 sections, disc bullets, 720px column, 16px paragraph rhythm; `/sample-blocks` — image-and-text, stats band and testimonial cards render in the site style (all values labelled "Sample"); 375px — no horizontal overflow on either; status codes: /privacy 200, /home 404, /manpower 404 (until C6), unknown 404; no console errors. Build: `/privacy` and `/sample-blocks` prerendered (●).

**Note:** the build now reads published pages from the database, so CI must have a migrated, seeded DB before `next build` (already the plan in F2).

**Temporary:** the privacy text here is a placeholder built from spec facts; E3 seeds the real draft notice (unpublished, for review). The `sample-blocks` page is test-only and is removed with the rest of the temporary content.

## C6 Vertical pages (2026-10-26)
**Built**
- `components/VerticalPage.tsx`: intro (label, the page's `h1` title, summary, VerticalGraphic in the vertical's position so it matches its home-page row), "Who we work with" tags, Services (full rich-text description, falling back to the one-line summary), How we deliver (rich text), Common questions (native `<details>` accordion with chevron), cream "Talk to our {name} team" strip with `mailto:` subject "Enquiry: {name}", links to the other four verticals. Empty sections are omitted (`lib/content.hasRichText` detects editors that only hold an empty paragraph).
- Backgrounds: intro white → services cream → delivery white → questions white → email strip cream (the spec's off-white strip; avoids two creams in a row).
- `[slug]` route serves verticals first (fixed slug list), then CMS pages; `generateStaticParams` builds published verticals and pages. `lib/payload.listPublishedVerticalSlugs()`.
- `lib/content.ts`: `hasRichText`, `mailtoHref` (tested).

**Verified in the browser:** /manpower (all sections filled) — one h1, sections in order, accordion opens, mailto subject `Enquiry%3A%20Manpower`, four other-vertical links; /oil-gas (no delivery/FAQs) — those sections omitted, subject `Enquiry%3A%20Oil%20%26%20Gas`; all five vertical URLs 200; 375px no overflow; no console errors. Build: all five verticals and both pages prerendered (●).
- **B6 live preview, now verified visually:** the admin's Live Preview pane loads `/preview?…&path=/manpower` (secret + staff session) and shows the page with the preview bar; changing the Title updates the preview after autosave; the public /manpower still shows the published title. Test draft discarded.

**Temporary content:** verticals now carry the HTML file's client lists and four services each; Manpower also has sample "How we deliver" text and two sample questions (labelled "Sample") to exercise those sections. Real copy comes from E1.

**Note:** the temp content script's clean step once left verticals behind without an error; bulk `payload.delete` reports failures in `errors` rather than throwing. The script now throws on any reported error. Use the same pattern in the E3 seed.

## C7 Error pages and accessibility pass (2026-10-26)
**Built**
- `app/(frontend)/not-found.tsx`: branded 404 inside the normal header/footer, with "Back to the home page" and links to every vertical (falls back gracefully if the vertical list can't load).
- `app/(frontend)/error.tsx`: segment error page (Next 16 `retry()` prop), contact email, digest reference.
- `app/global-error.tsx`: last-resort page with its own document and inline styles, used when the root layout fails (e.g. the database is down while rendering a page that was never built).
- Skip link ("Skip to content") as the first focusable element; `<main id="main" tabIndex={-1}>` receives focus.
- Hero overlay strengthened (0.88 → 0.70 at 50% → 0.25) after computing worst-case contrast for white text over a white photo pixel: the 18px summary now has ≥6.4:1 (was 4.6:1); headlines (large text, 3:1 needed) ≥4.6:1 at their furthest extent.
- Dev tooling now installed for F1: `@playwright/test` 1.64.0, `@axe-core/playwright` 4.13.0 (newest releases at least two weeks old), Chromium for Playwright.

**Verified (production build, headless Chromium + axe, WCAG 2.0/2.1/2.2 A–AA + best-practice tags):** `/`, `/manpower`, `/oil-gas`, `/privacy`, 404, and the hero in slideshow mode, at 1280px and 375px — 0 violations. Sanity check: on a clean page axe passed 40 rules; after deliberately removing alt text, lowering text contrast and deleting the h1 it reported `image-alt`, `color-contrast`, `page-has-heading-one`, so the scan is real. Keyboard: first Tab → "Skip to content", Enter → focus on #main. **Reduced motion verified in a real browser:** with `reduce` the slideshow stays on Manpower past 7.8 s; without it advances to Education & Training. Screenshots checked: hero slide (readable text, vivid photo), 404 page.
- **Database outage test:** with the DB container stopped, prebuilt pages (`/`, `/manpower`, `/privacy`) kept serving 200; a never-built page returned 500 with the branded global error page (heading, email, reference, working "Try again").

**Not verified:** the segment `error.tsx` page in a browser. Any DB failure also breaks the root layout's header, so the global page is what visitors actually see; `error.tsx` covers page-only failures.

**Notes:** axe can't judge text over images; hero contrast was checked by calculation (above). Git Bash rewrites `/paths` in arguments; use `MSYS_NO_PATHCONV=1` for scripted URL checks.

## D1–D3 SEO (2026-10-26)
**Built**
- `lib/seo/metadata.ts` `buildMetadata()`: title (home uses the fixed SEO title as `absolute`; others get "| TRBD Consulting Group" via the layout template), description (SEO field → summary/first block text, truncated at a word boundary to 155), canonical path, Open Graph (`en_IN`, site name, 1200×630 image), Twitter large-image card, `noindex, follow` when "Hide from search engines" is ticked. Image fallback chain: SEO image → document hero → Site Settings default → generated `/og?title=…`. Uses each upload's `og` crop.
- `lib/seo/page-text.ts`: plain-text and image fallbacks from a page's blocks.
- Root layout `generateMetadata`: `metadataBase` from `NEXT_PUBLIC_SITE_URL`, title template, Google/Bing verification codes from Site Settings. Home, `[slug]` (verticals + pages) and 404 (`noindex`) metadata.
- `app/robots.ts` (must sit at the app root; inside the `(frontend)` route group Next ignores it and `[slug]` catches the URL) and `lib/seo/indexing.ts`: only `VERCEL_ENV=production` may be indexed; otherwise `Disallow: /`. Production disallows `/cms`, `/api/`, `/preview`, `/og`, `/account` and lists the sitemap. `next.config` adds `X-Robots-Tag: noindex, nofollow` outside production.
- `app/(frontend)/sitemap.ts`: published, indexable pages and verticals with `lastModified`. `lib/revalidate` now refreshes `/sitemap.xml` on every publish (it's a route handler outside the layout).
- `lib/seo/jsonld.ts` + `components/JsonLd`: Organization on every page (only entered facts), WebSite on home, Service (with the services as an offer catalog) + BreadcrumbList + FAQPage (only when questions exist) on vertical pages. `serializeJsonLd` escapes `<`, `>`, `&`, U+2028/9 as unicode escapes.
- `/og` route (D3): next/og `ImageResponse`, title on navy with amber rule and TRBD mark, cached a day. A route (not `opengraph-image.tsx`) because file-based OG images override editor-chosen ones. `og` added to reserved slugs.

**Bugs found and fixed**
- The unit test caught that `'\u003c'` in source is just `<` again, so JSON-LD escaping did nothing (a `</script>` in CMS text could have broken out). The editing tools also convert `\uXXXX` in source, so escapes are now built at runtime from char codes.
- robots.ts inside the route group was ignored (404); moved to `app/robots.ts`.
- Sitemap wasn't refreshed on publish; added to every revalidation.

**Verified (production build + `next start`, 28/28):** titles, descriptions, canonicals, og:image (hero crop / vertical photo / generated PNG 1200×630), twitter card, JSON-LD types per page and Organization omitting empty phone/address, 404 noindex, robots.txt `Disallow: /` and `X-Robots-Tag` outside production, sitemap contents + lastmod; ticking "Hide from search engines" removed the page from the sitemap on the next request and added `noindex`; restoring brought it back; a Search Console code typed into Site Settings appeared as `<meta name="google-site-verification">` and disappeared when cleared. Unit tests: 68.

**Not verified end-to-end:** the production branch of robots.txt (allow + sitemap line) needs a `VERCEL_ENV=production` build; covered by unit tests, and on the launch checklist to confirm on the live domain.

**Tooling note:** with `MSYS_NO_PATHCONV=1`, use `taskkill /PID … /T /F` (single slashes); the `//PID` form silently fails and leaves a stale server on port 3000.

## E1 Draft copy + E3 Seed (2026-10-26)
**Built**
- `seed/content/verticals.ts` (E1): per vertical, a **published base** (HTML-page wording: name, title, summary, client list, four services with one-line summaries; plus the mockup-approved hero headlines) and an **unpublished draft** (a paragraph per service, "How we deliver" intro + four Understand/Plan/Deliver/Sustain steps, 3–4 common questions). Rule followed: the draft only expands what the HTML says; no numbers, client names, named certifications/standards bodies, licences, offices, countries or results. Overseas placement copy deliberately avoids implying any recruitment licence (only the firm can state that).
- `seed/content/site.ts`: Site Settings (company, legal name, tagline, email; phone/address/hours left empty), Navigation anchors, the home page blocks (HTML wording + approved "Who we are"), and a factual privacy notice describing stage 1 as built (published so the footer link works; flagged for review, ideally DPDP-aware, before launch and again at stage 2).
- `seed/seed.ts` (E3): `npm run seed` creates only what's missing (admin, 11 media by source URL, privacy + home pages, 5 verticals, settings, navigation incl. the privacy page relation) and never overwrites edits; `npm run seed:reset` deletes the seeded content (and any old temporary content) first. Verticals: create published base, then `update({ draft: true })` with the expanded copy, so the public sees only the base. Fresh `context` per call, `errors` checked on bulk deletes, revalidation disabled. `seed/lib/lexical.ts` (rich text builders), `seed/lib/admin.ts` (shared with `seed:admin`).
- Removed `seed/temp-hero-content.ts` and its content.

**Found and fixed:** `payload run` doesn't forward CLI flags to the script, so `--reset` silently did nothing; reset is now the `SEED_RESET=1` env var behind `npm run seed:reset`.

**Verified:** reset run → 22 steps, second run → nothing created (idempotent); DB: pages home+privacy, 5 verticals, 11 media, 55 storage objects, no temporary media; all 11 media URLs 200. Production build (31/31): for each vertical the public page has no "How we deliver"/questions while the staff preview shows them (3–4 questions) and the preview bar; admin lists the five in order, all "Draft – needs review" with unpublished changes, team inbox empty; home shows every approved section; header and footer links come from Navigation (footer privacy link via page relation); /privacy published; sitemap no longer has the sample page.

**For the content writer (goes into F4's content guide):** review each vertical's draft in /cms (Live Preview), edit, set Copy status to "Reviewed", publish. Fill in phone, office address, hours and each vertical's team inbox. Review the privacy notice.

## F1 End-to-end tests (2026-10-26)
**Built**
- `playwright.config.ts`: projects `desktop` (1280×800) and `mobile` (Pixel 7 at 375×812); runs against `npm run start` (reuses a running server locally); loads `.env` with Node's `process.loadEnvFile`; GitHub reporter in CI, traces kept on failure. `npm run test:e2e` (after `npm run build` and `npm run seed`).
- `tests/e2e/pages.spec.ts`: home sections in order with one h1; all five vertical pages (title, mailto subject, four other-vertical links); privacy page; branded 404 for unknown paths and `/home`; drafts stay private (no "How we deliver"/questions/preview bar publicly); staff preview shows the drafts (skips without credentials); `/preview` refuses visitors without a staff session.
- `tests/e2e/hero.spec.ts`: intro first with no auto-rotation; five hidden slides in the HTML; Explore → Manpower then auto-advance; tile → its slide and hero link; pause holds past 7 s; logo reset to intro at scroll 0; reduced motion never advances.
- `tests/e2e/layout-a11y.spec.ts`: axe (WCAG 2.0/2.1/2.2 A–AA + best-practice) with zero serious/critical issues on `/`, `/manpower`, `/oil-gas`, `/privacy`, 404 and the slideshow state, plus no horizontal scroll, at both sizes; skip link (desktop); header collapse on phones; hero tiles swipe on phones, grid on desktop.
- `tests/e2e/seo.spec.ts` (desktop only): titles, canonicals, og:image, twitter card, JSON-LD types; generated preview PNG 1200×630; sitemap entries; robots + X-Robots-Tag outside production; 404 noindex in the raw HTML.

**Fixes during the run:** `@axe-core/playwright` pulled `playwright-core` 1.64.1 next to Playwright's 1.64.0, breaking the `Page` type → `overrides: { playwright-core: 1.64.0 }` + `npm dedupe`. Two test issues (duplicate accessible link name across hero and rows; Next replaces the 404 robots tag after hydration) fixed in the tests; the site behaviour was correct.

**Results:** 59 passed, 7 intentionally skipped (SEO and skip-link run on desktop only), stable across three runs (~26 s). **Sanity check:** with a planted bug (slideshow ignoring reduced motion) exactly the two reduced-motion tests failed; reverted and rebuilt, 59/59 again.

## F2 CI (2026-10-26)
**Built:** `.github/workflows/ci.yml` on pull requests and pushes to main (concurrency cancels superseded runs; read-only token). Postgres 17 service; CI-only throwaway env (local disk storage, test secrets, test admin). Steps: `npm ci` → lint → format check → typecheck → Payload types up to date (`generate:types` + `git diff --exit-code`) → unit tests → migrate → migrations match the config (`migrate:create` must produce no file) → seed → build → Playwright Chromium → e2e; Playwright report uploaded on failure. Actions pinned to current majors (checkout/setup-node/upload-artifact @v7).

**Verified by rehearsal:** every step, in order, in a fresh `git clone` (no `.env`, nothing uncommitted) against a separate plain `postgres:17` container with the CI env and `STORAGE_DRIVER=local`: all passed (install 171 s, lint 69 s, build 49 s, e2e 34 s; ~7 min total). Both drift guards confirmed: adding a field without regenerating types or creating a migration fails each check; with no changes both pass.

**Found and fixed:** the migrations check originally ended in `|| true`, which also swallowed a crashing config (false pass). Exit codes checked: no change → 0, crash → 1; `|| true` removed.

**Not verified:** a real GitHub Actions run (no GitHub repository yet). First push will be the real test; `.10x/handoff` and the launch checklist note it.
