# Engineering Manager — stage1-foundations

**Date:** 2026-10-22 · Estimates are focused engineering time (d = day). Every task ends with its checks green and a commit.

## Task list (in order)

### A. Scaffold and infrastructure — risky items first
| ID | Task | Est | Depends on |
|---|---|---|---|
| A1 | Scaffold Next 16.4.2 + Payload 3.91.0 (blank template), admin at `/cms`, pinned versions, TS strict, ESLint + Prettier, Vitest config, `src/lib/env.ts` | 0.5d | — |
| A2 | Local Supabase (CLI on Docker); Payload on schema `payload` with migrations (no dev push); first migration; first admin can sign in | 0.5d | A1 |
| A3 | **Spike:** S3 storage adapter → Supabase Storage `media` bucket locally; upload + public URL + `next/image` remote pattern. Record outcome (or disk fallback) in SDE notes | 0.5d | A2 |
| A4 | Tailwind 4 tokens, Source Serif 4 + Public Sans via `next/font`, base layout, static Header/Footer shells matching mockup | 0.5d | A1 |

### B. Content model
| ID | Task | Est | Depends on |
|---|---|---|---|
| B1 | Users with roles; `lib/access` (isStaff, isSuperAdmin, publishedOrStaff, staffOnlyField) + unit tests | 0.5d | A2 |
| B2 | Media collection: alt required, caption, credit, sourceUrl, focal point, 4 sizes | 0.25d | A3, B1 |
| B3 | Site Settings and Navigation globals | 0.5d | B1, B2 |
| B4 | Verticals collection (all fields, staff-only `notificationEmail`, `copyStatus`, seo group, drafts/versions/schedule) + `lib/slugs` + unit tests | 0.5d | B1, B2 |
| B5 | Pages collection + 11 block configs | 0.5d | B4 |
| B6 | Revalidation hooks, `/api/preview` route, live preview config | 0.5d | B5, C1 |

### C. Frontend
| ID | Task | Est | Depends on |
|---|---|---|---|
| C1 | `lib/payload` draft-aware data access; Header/Footer from globals | 0.5d | B3, A4 |
| C2 | `heroReducer` + unit tests | 0.25d | — |
| C3 | `HeroSlideshow` client island + server-rendered slides | 0.5d | C1, C2, B4 |
| C4 | Blocks: Section intro, Verticals list + `VerticalGraphic`, Approach, Why, Contact, CTA | 0.5d | C1 |
| C5 | Blocks: Image and text, Stats, Testimonials, Rich text; privacy page | 0.5d | C1 |
| C6 | `/[vertical]` page: all sections, fallbacks for empty fields, mailto subject, other verticals | 0.5d | C4 |
| C7 | Branded 404/error pages; responsive and accessibility pass against the mockup | 0.5d | C3–C6 |

### D. SEO
| ID | Task | Est | Depends on |
|---|---|---|---|
| D1 | `lib/seo` metadata builder with fallbacks + `generateMetadata` on routes + tests | 0.5d | C6 |
| D2 | `sitemap.ts`, env-aware `robots.ts` + `X-Robots-Tag`, JSON-LD builders + tests, verification meta tags | 0.5d | D1 |
| D3 | Generated Open Graph fallback image | 0.25d | D1 |

### E. Seed content
| ID | Task | Est | Depends on |
|---|---|---|---|
| E1 | Write draft vertical copy and hero headlines in `seed/content.ts` (HTML-sourced facts only) | 0.5d | — |
| E2 | Stock photo shortlist → **user approval** → download to `seed/images/` with credits | 0.25d + wait | — |
| E3 | Idempotent `seed.ts`: admin, globals, verticals (published base + draft version), home and privacy pages, media | 0.5d | B5, E1, E2 |

### F. Quality and delivery
| ID | Task | Est | Depends on |
|---|---|---|---|
| F1 | Playwright (desktop + 375px) e2e: pages, drafts hidden, hero flows, no sideways scroll, mailto, sitemap/robots, axe | 0.5d | C7, D2, E3 |
| F2 | GitHub Actions `ci.yml` (Postgres service, migrate, seed, all checks) + payload-types drift check | 0.25d | F1 |
| F3 | Sentry (scrubbed, DSN-optional) + Vercel Analytics (production only) | 0.25d | A1 |
| F4 | Docs: README, `docs/architecture.md`, `docs/content-guide.md`, `docs/launch-checklist.md` | 0.5d | all |

**Total:** about 12 engineering days.

## Sequencing notes
- E1 and E2 have no code dependencies. E2's shortlist goes to the user **early** (right after A1) so approval doesn't block E3.
- A3 is the main technical unknown; if it fails, local dev uses disk storage and S3 is verified against cloud Supabase before go-live (launch checklist item).
- B6 needs C1's data layer to know which tags pages use; build them together if convenient.

## Risks and unknowns
| Risk | Likelihood | Plan |
|---|---|---|
| Docker Desktop not running / Supabase CLI issues on Windows | Medium | README troubleshooting; plain Postgres container fallback for dev |
| Next 16 caching APIs (`use cache`, `cacheTag`, `revalidateTag` signature) differ from Payload examples | Medium | Check Next 16.4 docs at B6; keep tagging in one module |
| Photo approval delay | Low | Placeholder gradient images in seed until approved |
| Draft-version seeding behaviour in Payload | Low | Covered by e2e "drafts hidden" test |

## Definition of done (stage 1)
All tasks complete; lint, typecheck, unit, build, e2e green locally; spec success criteria met except those needing cloud accounts (LCP on Vercel preview, Search Console), which move to the launch checklist.
