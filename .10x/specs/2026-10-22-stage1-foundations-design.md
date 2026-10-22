# Stage 1 — Foundations and Landing Redesign: Design Spec

**Date:** 2026-10-22
**Status:** Approved in brainstorming (sections 1–5); awaiting final spec review
**Feature slug:** `stage1-foundations`
**Baseline:** `tech-stack.md` (agreed 21 Oct 2026). This spec follows it except where noted under "Changes from the stack plan".
**Visual reference:** `mockups/home-v1.html` (throwaway mockup, approved 22 Oct 2026)

---

## 1. Goal and scope

Launch a light, professional, picture-led marketing site for TRBD Consulting Group Private Limited, with all content editable in Payload CMS, built on the agreed stack, ready to grow into stages 2–6.

### In scope
- Next.js 16 + Payload 3 app, running locally against Supabase (Docker).
- Payload content model: Site Settings, Navigation, Pages (section blocks), Verticals, Media, Users.
- Pages: home `/`, five vertical pages, privacy notice `/privacy`.
- Draft expanded copy for the five vertical pages, seeded as unpublished drafts.
- Free stock photos (Unsplash/Pexels) as placeholders, swappable in the CMS.
- SEO: metadata, sitemap, robots, JSON-LD, Open Graph images.
- Tests (Vitest, Playwright), lint, typecheck, GitHub Actions workflow, Sentry, Vercel Analytics wiring.
- Documentation: README, architecture, ADRs, content guide, launch checklist.

### Out of scope (later stages)
- Enquiry form, Turnstile, Resend, enquiry routing and staff enquiry workflow → stage 2.
- Supabase Auth, `/account`, `proxy.ts`, consent records, Drizzle tables → stage 3.
- Manpower module and private CV bucket → stage 4. Training module → stage 5. Insights → stage 6.
- Creating GitHub, Vercel and Supabase cloud accounts and deploying → before go-live, by the firm (listed in the launch checklist).
- Redirects: none needed (no live site at trbdgroup.com).

### Success criteria
- Fresh clone → documented commands → running site with seeded content.
- Home and vertical pages match the approved mockup's structure and look.
- Content writer can edit every visible text and image in `/cms`, preview drafts and publish; published changes appear without a redeploy.
- No horizontal scroll at 375px; axe scan shows no serious or critical issues; LCP under 2.5s on mobile for the home page (checked on the Vercel preview before launch).
- All CI steps pass locally.

---

## 2. Decisions taken during brainstorming

| # | Decision |
|---|---|
| D1 | Greenfield build in this folder. The HTML file supplies content; its visual style is **not** reused. |
| D2 | Stage 1 ships with an "Email us" mailto link (contact@trbdgroup.com) instead of a form. |
| D3 | All photos are free stock for now; each has alt text, focal point and a credit/source field. |
| D4 | No cloud accounts yet. Local git + local Supabase; accounts created in the firm's name before go-live. npm is the package manager. |
| D5 | Claude drafts expanded vertical copy from the HTML content only. No invented clients, numbers, certifications or claims. Seeded as drafts with copy status "Draft – needs review". |
| D6 | Approach A: full CMS content model now (Insights deferred). |
| D7 | Light-only site, no dark mode; bright surfaces dominate, dark only in hero and footer. No vertical numbering (V.01 etc.) anywhere. |
| D8 | Canonical host `https://www.trbdgroup.com`; apex redirects to www. |

### Changes from the stack plan (necessary only)
1. **Table ownership.** Payload owns every table staff edit (content now; verticals' routing email now; enquiries in stage 2). Drizzle is introduced in stage 3 for user-side tables in a separate Postgres schema `app`. Payload uses schema `payload`. → ADR-001.
2. **Access enforcement split.** Payload connects with a privileged role that bypasses RLS, so staff permissions (including per-vertical access in stage 2) are enforced by Payload access control. RLS protects Supabase Auth and Storage paths from stage 3 onward. → ADR-002.
3. **Next.js 16 naming.** The stack's "Middleware" is `proxy.ts` in Next.js 16 (introduced in stage 3).
4. **Wording.** The stack's "already in place" (Next.js, Tailwind) and "replace Web3Forms" no longer apply.

---

## 3. Architecture

- **One app.** Next.js 16 (App Router, React 19, TypeScript) with Payload 3 embedded, using Payload's standard route groups: `app/(frontend)` for the public site, `app/(payload)` for admin and API. Admin route set to `/cms` (`routes.admin`).
- **Versions.** Before scaffolding, confirm the latest Payload 3 release that officially supports Next.js 16 and pin both exactly.
- **Database.** `@payloadcms/db-postgres` → Supabase Postgres, `schemaName: 'payload'`. Locally: Supabase CLI on Docker. Production: Supabase pooler (transaction mode) for runtime; direct connection for migrations. Payload migrations are generated and committed.
- **Media.** `@payloadcms/storage-s3` → Supabase Storage public bucket `media` (S3-compatible endpoint). Image sizes: `thumbnail`, `card`, `hero`, `og` (1200×630). `next/image` serves responsive AVIF/WebP via Vercel.
- **Rendering.** Public pages statically generated (`generateStaticParams`). Payload `afterChange`/`afterDelete` hooks on Pages, Verticals, Site Settings and Navigation call `revalidatePath`/`revalidateTag` for affected routes. Draft preview through Next.js `draftMode` and Payload live preview.
- **Staff auth.** Payload Users with roles `super-admin` and `content-editor`, signing in at `/cms`. The `vertical-team` role is added in stage 2.
- **Environment.** `.env.example` lists: `DATABASE_URI`, `DATABASE_URI_DIRECT`, `PAYLOAD_SECRET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`, `NEXT_PUBLIC_SITE_URL`, `PREVIEW_SECRET`, `SENTRY_DSN` (optional), `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` (local seeding only). Secrets never committed.

### Folder layout
```
src/
  app/(frontend)/          page.tsx (home), [vertical]/, privacy/, sitemap.ts, robots.ts, opengraph-image.tsx
  app/(payload)/cms/       Payload admin (generated)
  collections/             Pages, Verticals, Media, Users
  globals/                 SiteSettings, Navigation
  blocks/                  one folder per block: config.ts + Component.tsx
  components/              Header, Footer, HeroSlideshow, VerticalGraphic, shared UI
  lib/                     payload client, seo (metadata + JSON-LD builders), revalidate hooks, slug rules, access rules
  payload.config.ts
seed/                      content.ts (HTML copy + draft vertical copy), images/, seed.ts (npm run seed)
supabase/                  local Supabase config
docs/                      architecture.md, adr/, content-guide.md, launch-checklist.md
tests/unit/                Vitest
tests/e2e/                 Playwright
.github/workflows/ci.yml
```

---

## 4. Content model

### Globals
- **Site Settings:** company name, legal name, logo (optional; falls back to the navy "TRBD" mark), contact email, phone, office address, working hours, social links (array: platform, URL), default Open Graph image, Google Search Console and Bing verification codes. Empty contact fields are hidden on the site (no "[Add phone number]" placeholders).
- **Navigation:** header links (array: label + link to a page, a vertical, an on-page anchor or an external URL), header CTA (label + link), footer link groups, footer note.

### Collections
- **Media:** upload with focal point; `alt` (required), `caption`, `credit`, `sourceUrl`; sizes as in §3.
- **Verticals (5):** `name` (tile/label, e.g. "Manpower"), `title` ("Manpower & Workforce Solutions"), `slug` (fixed set: `manpower`, `education-training`, `oil-gas`, `green-energy`, `global-business`), `order` (internal sort, never displayed), `heroHeadline` (slideshow headline), `summary`, `heroImage`, `whoWeWorkWith` (array of text), `services` (array: name, short description, full description), `howWeDeliver` (rich text), `faqs` (array: question, answer), `notificationEmail` (staff-only; field-level read access requires an authenticated staff user; never sent to the browser), `copyStatus` (`draft-needs-review` | `reviewed`), `seo` group. Drafts, versions, scheduled publish, live preview.
- **Pages:** `title`, `slug`, `layout` (blocks), `seo` group. Drafts, versions, scheduled publish, live preview. Home is the page with slug `home`, served at `/`.
- **Users:** `name`, `email`, `role` (`super-admin` | `content-editor`). Only super admins manage users.

### Shared `seo` group
`metaTitle`, `metaDescription`, `ogImage`, `noIndex`. Fallbacks: metaTitle → title; metaDescription → summary (verticals) or first block text (pages); ogImage → heroImage → Site Settings default → generated image.

### Slug rules
Slugs are unique across Pages and Verticals combined. Reserved: `cms`, `api`, `account`, `insights`, `admin`, `_next`, `privacy` (owned by the privacy page), and the five vertical slugs for Pages. Validation rejects them with a clear message.

### Blocks
| Block | Fields | Notes |
|---|---|---|
| Hero | label, title, CTA label, background image | Vertical tiles and slides come from the Verticals collection automatically. |
| Section intro | label, heading, text | The "Who we are" section. |
| Verticals list | label, heading, intro text | Rows generated from Verticals (name, title, summary, hero image, link). |
| Approach stages | label, heading, intro, stages (3–6: title, text) | |
| Why points | label, heading, intro, points (title, text, icon from a fixed lucide set) | |
| Image and text | image, label, heading, rich text, image side | Available; not seeded on home. |
| Stats | items (value, label) | Available; not seeded (no real figures yet). |
| Testimonials | items (quote, name, role, company) | Available; not seeded (no real quotes yet). |
| Call to action | heading, text, button label, link | |
| Contact | label, heading, text | Shows Site Settings details and "Email us" (mailto). Replaced by the form in stage 2. |
| Rich text | body | Privacy notice. |

---

## 5. Visual design (per approved mockup)

### Tokens (Tailwind 4 `@theme`)
- Colours: navy `#12263A`, ink `#1B2A38`, muted `#56656F`, line `#E4DFD5`, white `#FFFFFF`, cream `#F8F5EF`, amber `#D99A2B` (fills, rules, buttons), amber-ink `#8F5D0E` (small amber text on light backgrounds, for contrast).
- Fonts via `next/font/google` (self-hosted at build): Source Serif 4 (headings), Public Sans (body). No mono font.
- Light only: no `prefers-color-scheme` styles. Square corners, thin rules, small uppercase amber labels above headings.

### Header
White, sticky. Logo (mark + "TRBD Consulting Group") left; links (Verticals, How we work, Why TRBD) and amber "Contact us" button right. Below 900px only the logo and the button show.

### Home page, in order
1. **Hero** (full-bleed photo with navy left-to-right gradient overlay).
   - **Intro state (on load):** label "TRBD Consulting Group", h1 "People, skills, energy and markets under one roof", prominent amber "Explore our verticals →" button. No subtitle. No rotation, no progress bar active, pause button hidden.
   - **Vertical tiles:** a row of five image tiles (name over photo) at the bottom of the hero; on phones a horizontal swipe row with scroll snap.
   - **Slideshow state:** starts only when the user clicks "Explore our verticals" (opens Manpower) or a tile (opens that vertical). Each slide shows the vertical's photo, label (name), headline, summary and "Learn more about {name} →" linking to its page. Rotates every 7 s through the five verticals; amber progress segment marks the active one; pause/play button visible; rotation pauses on hover and focus; no auto-rotation with `prefers-reduced-motion`.
   - **Reset:** clicking the header logo returns the hero to the intro state, stops rotation and scrolls to top.
   - **SEO/semantics:** the intro title is the page's only `h1`. Vertical slide headlines are `h2`. All slide content is server-rendered; inactive slides are hidden from view and assistive tech. The hero is the only client-side island.
2. **Who we are** (white): one full-width navy rule; label + serif title "One partner, one point of accountability." on the left; firm description on the right.
3. **What we do** (cream): same header pattern ("Five verticals, connected by one team." + the "verticals work together" paragraph); then five compact alternating rows: thin rule, amber label, serif title, summary, "Learn more →" circle-arrow link; graphic (max 320px) on the other side.
   - **Vertical graphic:** the vertical's photo clipped to a circle with a navy tint, plus amber blocks and thin navy connector lines drawn in SVG; three layout variants rotate. Only the photo comes from the CMS.
4. **How we work** (white): header pattern; four stage columns each with a top rule.
5. **Why TRBD** (cream): header pattern; six white cards with a lucide line icon and amber top edge.
6. **Contact** (white): label, "Tell us what you need", text, amber "Email us" button (mailto), details list (company, email, website; phone/address/hours when filled).
7. **Footer** (navy): firm name and tagline, vertical links, company links (How we work, Why TRBD, Contact, Privacy notice), legal line.

### Vertical page, in order
Light top section (label, title, summary left; vertical graphic right) → Who we work with (tags) → Services (name + full description each) → How we deliver → Common questions (`<details>` accordion) → cream CTA strip with "Email us" (mailto subject "Enquiry: {name}") → links to the other four verticals.

### Privacy page
Simple rich-text page on white, edited in the CMS. Seeded with a short draft notice stating that stage 1 collects no personal data through forms, uses cookie-free analytics, and how to contact the firm. Marked for review.

### Accessibility and performance
WCAG 2.2 AA; amber-ink for small text on light backgrounds; visible amber focus outlines; reduced-motion respected; required alt text; hero image `priority`, responsive sizes; LCP < 2.5 s on mobile.

---

## 6. SEO
- **URLs:** `/`, `/manpower`, `/education-training`, `/oil-gas`, `/green-energy`, `/global-business`, `/privacy`. Canonical URLs on every page via `metadataBase` = `NEXT_PUBLIC_SITE_URL`.
- **Metadata:** `generateMetadata` from the `seo` group with fallbacks (§4). Title template `%s | TRBD Consulting Group`; home default title "TRBD Consulting Group: Manpower, Training, Oil & Gas, Green Energy and Global Business Consulting".
- **sitemap.ts:** published Pages and Verticals, `lastModified` = `updatedAt`, excludes `noIndex`.
- **robots.ts:** allow all; disallow `/cms`, `/api`, `/account`. When `VERCEL_ENV !== 'production'`: disallow all and send `X-Robots-Tag: noindex`.
- **JSON-LD:** `Organization` on every page (name, legalName, url, logo, email; address and `sameAs` only when filled). `WebSite` on home. On vertical pages: `Service` (provider = Organization, name, description), `BreadcrumbList`, `FAQPage`. No ratings, counts or service areas.
- **Open Graph / Twitter:** `summary_large_image`; image per fallback chain; `opengraph-image.tsx` generates a branded fallback with the page title.
- **Verification:** Search Console and Bing codes from Site Settings rendered as meta tags.
- **Follow-up (launch checklist):** submit sitemap; set up Google Business Profile once the office address is known.

---

## 7. Seed content
- `npm run seed` is idempotent: creates the first super admin from env-provided seed credentials (documented in README, local only), Site Settings, Navigation, five Verticals, home and privacy pages, and Media from `seed/images/`.
- **Text sources:** HTML file copy for the home sections; Claude-drafted expanded vertical copy (overview, one paragraph per service, how we deliver, 3–5 FAQs) and hero headlines (e.g. "The right workforce, at home and overseas").
- **Draft status:** vertical expanded copy (overview, service full descriptions, how we deliver, FAQs) is seeded as an unpublished draft version with `copyStatus: draft-needs-review`. The published version carries only HTML-sourced content plus the hero headlines (shown and approved in the mockup), so the live site never shows unreviewed long-form copy. On the published vertical page, a service without a full description shows its short description, and empty "How we deliver" and FAQ sections are omitted. The content guide lists the hero headlines as also due for the writer's review.
- **Photos:** 11 images (1 TRBD hero, 5 vertical, up to 5 spare for section use). Before downloading, Claude lists each image (subject, source page, photographer, licence) and asks for approval. Credits stored in Media.

---

## 8. Testing and quality
- **Lint/format/types:** ESLint (Next config), Prettier, `tsc --noEmit`.
- **Vitest (unit):** SEO metadata and fallback builder; slug validation; JSON-LD builders (empty fields omitted); hero state logic as a pure reducer (intro, explore, tile select, advance, pause, reduced motion, reset); access rules (public sees published only; `notificationEmail` unreadable without staff auth; content editors cannot manage users).
- **Playwright (e2e), desktop and 375px mobile projects, against a production build with seeded data:** all pages render; draft-only copy not public; hero behaviour (no autoplay on load, Explore → Manpower, tile → that vertical, logo → intro); no horizontal scroll at 375px; mailto subject per vertical; sitemap and robots content; `@axe-core/playwright` scan with zero serious/critical violations.
- **Test infrastructure:** plain Postgres (CI service container / local Docker) instead of full Supabase; local-disk storage adapter in tests.

## 9. CI, monitoring, docs
- **GitHub Actions `ci.yml` on pull requests and pushes to main:** `npm ci` → lint → typecheck → unit → build → `payload migrate` on fresh DB → seed → e2e. Runs once the GitHub repo exists.
- **Sentry:** `@sentry/nextjs`, enabled only when `SENTRY_DSN` is set; `beforeSend` strips request bodies, cookies, emails and IPs.
- **Vercel Web Analytics:** `<Analytics />` rendered only in production.
- **Docs:** `README.md` (setup from scratch, commands), `docs/architecture.md`, `docs/adr/` (ADR-001 table ownership, ADR-002 access enforcement split, ADR-003 hero behaviour), `docs/content-guide.md`, `docs/launch-checklist.md`. `.10x/adrs/` links to `docs/adr/` rather than duplicating.

## 10. Risks
| Risk | Mitigation |
|---|---|
| Payload 3 / Next.js 16 compatibility gaps | Verify and pin versions before scaffolding; ADR if a fallback (e.g. Next 15) is required. |
| Supabase S3 adapter quirks locally | Spike it first; fall back to Payload local disk storage locally if needed, S3 in production. |
| Stock photos look generic | Firm replaces them via CMS; content guide explains how. |
| Draft copy published unreviewed | Draft-only seeding + `copyStatus` field + content guide review step. |
| Hero slideshow accessibility | No autoplay until user acts; pause control; reduced-motion; e2e and axe checks. |
