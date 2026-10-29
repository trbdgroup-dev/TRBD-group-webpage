# Architecture

How the TRBD website is put together, as built in stage 1 (foundations and landing redesign). The original plan is [`tech-stack.md`](../tech-stack.md); the reasons behind the main choices are in the [decision records](adr/).

## Overview

```
Browser (visitors, staff)
  │
  ▼
Vercel CDN + one Next.js 16 app (functions in Mumbai, bom1)
  ├─ Public pages (pre-built, refreshed on publish)
  │     /  ·  /manpower … /global-business  ·  /privacy  ·  404
  ├─ /cms ─ Payload admin for staff (super admin, content editor)
  ├─ /preview, /preview/exit ─ draft preview for signed-in staff
  ├─ /sitemap.xml, /robots.txt, /og (generated link-preview images)
  └─ Payload Local API (in-process)
        ├─▶ Supabase Postgres, Mumbai, schema "payload"
        └─▶ Supabase Storage, public bucket "media" (S3 protocol)
Sentry (errors, scrubbed) · Vercel Web Analytics (cookie-free, production only)
```

There is one codebase and one deployable app. Payload runs inside Next.js, so the public site reads content through Payload's Local API (no network hop) and staff edit at `/cms`.

## Content model

| Type                       | What it holds                                                                          | Notes                                                                                                                                                       |
| -------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pages**                  | Home (`home`, served at `/`), privacy notice, future pages                             | Built from 11 section blocks; drafts, versions, scheduled publishing, live preview                                                                          |
| **Verticals**              | The five verticals                                                                     | Fixed addresses; feed the hero tiles, the "What we do" rows, their own pages and the footer; staff-only team inbox for stage 2 enquiry routing; copy status |
| **Media**                  | Images                                                                                 | Required alt text, credit and source, focal point, sizes for thumbnails, cards, hero and 1200×630 link previews                                             |
| **Users**                  | Staff accounts                                                                         | Roles: super admin, content editor                                                                                                                          |
| **Site Settings** (global) | Company and contact details, social links, default preview image, search console codes | Empty contact fields are hidden on the site                                                                                                                 |
| **Navigation** (global)    | Header links and button, footer "Company" links                                        | The footer's vertical list comes from Verticals                                                                                                             |

Section blocks: Hero, Section intro, Verticals list, Approach stages, Why points, Image and text, Stats, Testimonials, Call to action, Contact, Rich text. Each lives in `src/blocks/<Name>/` as `config.ts` (fields) and `Component.tsx` (rendering); `RenderBlocks` maps one to the other and fails typechecking if a block type has no component.

## Data and access

- **Database:** Payload owns the `payload` schema and changes it only through committed migrations (`push: false`). The `app` schema is reserved for stage 3's Drizzle tables (public users' profiles, CVs, consents) with row-level security. See [ADR-001](adr/001-table-ownership-payload-and-drizzle.md).
- **Access:** staff permissions are enforced by Payload's access functions in `src/lib/access` (unit-tested), because Payload's database role bypasses RLS. The public reads only published documents; the team inbox field is never readable without a staff session; only super admins manage users. See [ADR-002](adr/002-access-enforcement-split.md).
- **Files:** uploads go to the public `media` bucket and are served straight from Supabase Storage; `next/image` resizes them to AVIF/WebP. CI and tests use local disk storage (`STORAGE_DRIVER=local`) with an identical schema.

## Rendering, publishing and preview

- **Pre-built pages.** Home, vertical pages and CMS pages are generated at build time; a page published later is generated on its first visit and then cached.
- **Refresh on publish** (`src/lib/revalidate.ts`). Publishing, unpublishing or deleting content calls `revalidatePath`: a page refreshes its own address; verticals, media and the globals refresh the whole site (they appear in shared places); `/sitemap.xml` refreshes every time. Saving a draft never touches the live site. The next visit after a publish gets the new version (no stale copy).
- **Draft preview.** `/preview` requires both the preview secret (in the admin's preview links) and a signed-in staff session, and only redirects within the site. It turns on Next.js draft mode, so pages read drafts; a preview bar offers "Exit preview", and the admin's Live Preview refreshes the page on every autosave.
- **Why not tag-based caching:** Next.js 16 replaces `unstable_cache` with `'use cache'`, which needs Cache Components, a different rendering model for every route including Payload's admin. Path revalidation gives the same result here without that risk.

## The home hero

The hero opens on a TRBD introduction whose "Explore our verticals" button fills over 6 seconds; then the vertical slideshow starts by itself (once per visit), or at once when a visitor clicks the button or a tile. Tiles are faded except the current slide's; the next tile fills in over the 7-second rotation and the slide changes when it's full. Hover, focus or the pause button hold it; reduced motion turns off the fills, the automatic start and the rotation; the logo returns to the intro, which then waits for a click. All slides are in the HTML for search engines; only the intro photo loads up front. State lives in a pure reducer (`src/lib/hero/reducer.ts`). See [ADR-003](adr/003-hero-intro-then-on-demand-slideshow.md).

## SEO

- `src/lib/seo/metadata.ts` builds each page's title, description, canonical URL, Open Graph and Twitter tags from its SEO fields, falling back to its title, summary or first text, and its photo, the site default, or a generated image (`/og`).
- Structured data (`src/lib/seo/jsonld.ts`): Organization on every page with only the details the firm has entered, WebSite on home, Service, breadcrumbs and FAQs on vertical pages. Output is escaped so CMS text can't break out of the script tag.
- Only the production deploy (`VERCEL_ENV=production`) may be indexed: elsewhere `robots.txt` disallows everything and every response carries `X-Robots-Tag: noindex`.

## Errors and monitoring

- Branded 404, a page-level error page and a last-resort global error page. With the database down, pre-built pages keep serving.
- Sentry (`src/instrumentation*.ts`) reports server, edge and browser errors when `NEXT_PUBLIC_SENTRY_DSN` is set. Every event is scrubbed first (`src/lib/sentry/scrub.ts`): no request bodies, cookies, user identity or IPs; query strings removed from every URL; email addresses redacted, including URL-encoded ones.
- Vercel Web Analytics loads only on the production deploy and sets no cookies.
- Browser-side Sentry loads lazily (`src/lib/sentry/client.ts`), once the page has loaded and the browser is idle, so it doesn't slow the first render. Browser errors in the first moments of a visit, before it loads, aren't reported; error pages load it on demand. Server-side reporting is unaffected.

## Security

- **Response headers** (`next.config.ts`): HSTS (two years, subdomains, preload), `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN` plus CSP `frame-ancestors 'self'` (only the site itself, for Live Preview, may frame pages), `base-uri`, `object-src` and `form-action` locked down, and a `Permissions-Policy` that turns off camera, microphone, location, payment and USB. No `X-Powered-By`. A full script CSP isn't set yet: Next.js inline scripts would need per-request nonces, which disables static pages.
- **CMS:** GraphQL is off (the site uses the Local API and REST only). Accounts lock after repeated wrong passwords; no public sign-up, uploads or writes; team inboxes and drafts aren't readable anonymously.
- **Links from the CMS** pass `safeHref` (`src/lib/links.ts`): only `http(s)`, `mailto:`, `tel:`, site-relative and `#` addresses are output; anything else (`javascript:`, `data:`, `vbscript:`) becomes `#`.
- **Preview secret** is compared in constant time.
- **Dependencies:** `npm audit` is reviewed before release; accepted findings are listed in the launch checklist.

## Accessibility

WCAG 2.2 AA is the target, checked by axe in the end-to-end suite on every key page at 1280px and 375px. Skip-to-content link; visible focus outlines; reduced motion respected; required alt text; hero text contrast checked by calculation (at least 6.4:1 for body text over the brightest photo).

## Where stage 2 and later plug in

- **Enquiries (stage 2):** a Payload collection in schema `payload`; Verticals already hold each team's inbox; the Contact block's "Email us" button becomes the form.
- **Public accounts (stage 3):** Supabase Auth, `proxy.ts` for protected routes, Drizzle tables in schema `app` with RLS, the `/account` address is already reserved.
- **Manpower, Training, Insights (stages 4–6):** new collections and routes; `insights` is a reserved address.

## Decisions that differ from the original plan

- Staff-edited data lives in Payload, not separate Drizzle tables ([ADR-001](adr/001-table-ownership-payload-and-drizzle.md)).
- Database-level row security applies to public-user data, not to staff ([ADR-002](adr/002-access-enforcement-split.md)).
- Next.js 16's "Middleware" is `proxy.ts`; none is needed until stage 3.
- Vercel Web Analytics is added with Vercel's script tag, because the `@vercel/analytics` package's optional peer dependencies conflict with the test tooling.
