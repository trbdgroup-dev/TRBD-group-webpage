# TRBD Consulting Group: Tech Stack

Status: final, agreed 21 Oct 2026. Prices are approximate list prices as of mid-2026 and should be confirmed on each vendor's pricing page before signing up.

## Overview

TRBD Consulting Group Private Limited is an India-registered consultancy working across five verticals: Manpower, Education & Training, Oil & Gas, Green Energy and Global Business. The website starts as a picture-rich, SEO-focused landing page and grows into a platform for vertical-routed enquiries, user registration, Manpower candidate profiles with CVs, Training courses and enrolments, and an insights section.

The system is a **single Next.js application** that serves both the public pages and the backend logic. It is hosted on **Vercel**, with **Supabase** providing the Postgres database, user sign-in and file storage. **Payload CMS** runs inside the same app, so the content writer can edit text and images from a web editor without touching the codebase, and staff use the same admin to work enquiries. All data is held in the **Mumbai** region, and India's **Digital Personal Data Protection (DPDP) Act 2023** is the baseline for consent, purpose limits and deletion.

Guiding principles: one codebase and one language (TypeScript), low fixed cost, very little server upkeep, portable standard technology (Postgres, open-source CMS), and good documentation.

## Summary

| Area | Choice | Why | Cost per month |
|---|---|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript | Already in place; full-stack in one codebase; strong SEO features | Free |
| Styling | Tailwind CSS 4, `lucide-react` icons | Already in place; fast to build the redesign | Free |
| Hosting | Vercel Pro, functions in Mumbai (`bom1`) | Native Next.js support, global CDN, image optimisation, a preview link for every change; commercial use allowed | $20 (1 seat) |
| Database | Supabase Postgres, Mumbai (`ap-south-1`) | Managed Postgres with daily backups and row-level security | Free, then $25 (Pro) |
| ORM and migrations | Drizzle ORM | Typed queries and versioned SQL migrations kept in the repo | Free |
| User sign-in | Supabase Auth: email magic link, Google, LinkedIn | For candidates, learners and clients; no auth code to maintain | Included |
| CMS and back office | Payload CMS 3, inside the app at `/cms` | Content writer edits pages, images and articles with live preview; staff manage enquiries per vertical | Free |
| File storage | Supabase Storage: public bucket for site media, private bucket for CVs and documents | One place for all files, with access rules and expiring links for sensitive documents | Included |
| Validation | Zod | One schema shared by forms, server code and the database layer | Free |
| Email | Resend with React Email templates | Enquiry notifications routed by vertical, welcome and verification emails | Free to 3,000/mo, then $20 |
| Spam protection | Cloudflare Turnstile | Free, privacy-friendly CAPTCHA on all public forms | Free |
| Images | `next/image` with Vercel's image CDN | Fast loading for the picture-heavy design | Included |
| Analytics | Vercel Web Analytics | Cookie-free, so no consent banner needed for analytics | Included |
| Error monitoring | Sentry | Alerts on server and browser errors | Free tier |
| Testing | Vitest (unit), Playwright (end-to-end) | Standard Next.js testing tools | Free |
| CI | GitHub Actions: lint, typecheck, tests, build on every pull request | Catches problems before they reach the live site | Free |
| SEO | Next.js Metadata API, `sitemap.ts`, `robots.ts`, JSON-LD, Open Graph images, one page per vertical | Built into the framework; SEO fields editable in the CMS | Free |
| Documentation | `README.md`, `docs/architecture.md`, decision records in `docs/adr/` | Keeps the project easy to hand over | Free |
| Compliance | DPDP Act 2023; data kept in Mumbai | India-registered company handling personal data | n/a |

**Expected running cost:** about $20 a month while the site is a landing page, and about $45 to $65 a month once registration and CV uploads go live (Supabase Pro, and Resend if email volume grows). A domain costs around $15 a year, and business email such as Google Workspace is separate.

## Architecture

```
Browser (visitors, candidates, learners, clients)
  │
  ▼
Vercel: CDN + Next.js 16 app (functions in Mumbai)
  ├─ Public pages (static, refreshed on publish) ── content from Payload, optimised images
  ├─ /cms ── Payload admin (content writer, vertical teams, super admin)
  ├─ /account ── signed-in area for candidates, learners and clients
  ├─ Server Actions / Route Handlers
  │     ├─ Zod validation + Turnstile check
  │     ├─ Drizzle ORM / Payload ──▶ Supabase Postgres, Mumbai (row-level security on)
  │     ├─ Supabase Auth ◀──▶ Google / LinkedIn sign-in
  │     ├─ Supabase Storage (site media, private CVs and documents)
  │     └─ Resend (email to the right vertical team and to users)
  └─ Middleware: session refresh, protected routes

GitHub ── pull request ──▶ GitHub Actions (lint, typecheck, test, build) ──▶ Vercel preview link
Merge to main ──▶ Vercel production deploy
```

**Content publishing:** when the content writer publishes in Payload, the affected pages are refreshed automatically within seconds. No developer or redeploy is needed.

**Who signs in where:** staff (content writer, vertical teams, super admin) sign in to Payload at `/cms`. Public users (candidates, learners, clients) sign in with Supabase Auth at `/account`.

## CMS content model

The page layout is built from fixed section blocks that the content writer can fill in, reorder or hide, but cannot break, so the design stays intact.

- **Site settings (global):** logo, contact email, phone, office address, working hours, social links, default SEO image
- **Navigation (global):** header and footer links
- **Pages:** title, slug, SEO fields (meta title, description, Open Graph image), and section blocks: Hero, Verticals grid, Approach stages, Why TRBD points, Image and text, Stats, Testimonials, Call to action, Contact
- **Verticals:** name, slug, summary, full description, hero image, services list, SEO fields, team inbox email used for enquiry routing
- **Insights:** title, slug, author, vertical tags, cover image, rich text body, publish date, SEO fields
- **Media:** image, alt text (required for accessibility and SEO), caption, focal point for cropping

Editors get drafts, version history with rollback, scheduled publishing and live preview.

## Data model

**Leads and accounts:**

- `verticals`: id, slug (`manpower`, `education-training`, `oil-gas`, `green-energy`, `global-business`), name, notification_email
- `enquiries`: id, full_name, company, email, phone, requirement, source_page, status (`new`, `contacted`, `qualified`, `won`, `lost`), assigned_to, created_at, first_response_at (tracks the two-working-day reply promise)
- `enquiry_verticals`: enquiry_id, vertical_id (an enquiry for "More than one" vertical has several rows)
- `profiles`: id (same as the sign-in user id), name, company, phone, country, created_at
- `consents`: user or enquiry, type (privacy notice version, marketing), granted_at, withdrawn_at

**Vertical modules (added as needed):**

- Manpower: `candidates` (profile, skills, trade, years of experience, certifications, passport and visa status, preferred countries), `candidate_documents` (file path, type, uploaded_at), `job_openings` (client, vertical, location, positions), `applications`
- Education & Training: `courses`, `course_batches` (dates, mode, seats), `enrolments`

## Roles and access

| Role | Signs in at | Can do |
|---|---|---|
| Super admin | `/cms` | Everything, including users, roles and settings |
| Content editor | `/cms` | Edit and publish pages, verticals, insights and media |
| Vertical team | `/cms` | See and work only their own vertical's enquiries, candidates or courses |
| Candidate / learner / client | `/account` | Manage their own profile, documents, applications and enrolments |

Access rules are enforced in the database (row-level security) as well as in the app. CVs and identity documents sit in a private bucket and are shared only through short-lived links.

## Security and data protection

- All personal data stored in Mumbai; backups in the same region.
- Consent captured with the privacy notice version at every form and sign-up; users can withdraw consent, export their data and request deletion.
- Collect only what each form needs; set retention periods for enquiries and candidate documents.
- Secrets kept in Vercel and GitHub environment settings, never in the code.
- Turnstile and rate limiting on every public form.
- If many candidates or clients are in the EU, UK or Gulf, check whether GDPR or local rules also apply to their data.

## Roadmap

1. **Foundations (alongside the redesign):** set up Vercel Pro and Supabase in Mumbai, install Payload with the content model above and move the landing page content into it, add CI, linting, typechecks and the test setup, SEO metadata, sitemap, robots, JSON-LD and one page per vertical.
2. **Enquiries:** replace Web3Forms with our own form that checks input, blocks spam, saves each enquiry with its verticals and emails the right team. Teams work their enquiries in Payload.
3. **Registration:** Supabase Auth sign-in, profiles, the `/account` area, consent capture and a privacy policy page.
4. **Manpower module:** candidate registration with CV and document upload, job openings and applications.
5. **Training module:** courses, batches and enrolments, with payments later if needed.
6. **Insights:** articles section published from Payload.