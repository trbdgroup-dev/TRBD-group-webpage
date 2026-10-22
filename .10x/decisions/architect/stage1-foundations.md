# Architect — stage1-foundations

**Date:** 2026-10-22 · **Spec:** `.10x/specs/2026-10-22-stage1-foundations-design.md` · **ADRs:** 001, 002, 003 (`docs/adr/`)

## Components and boundaries
| Unit | Does | Depends on |
|---|---|---|
| `payload.config.ts` | Wires collections, globals, db adapter (schema `payload`), S3 storage, admin at `/cms`, live preview | collections/, globals/, env |
| `collections/*`, `globals/*` | Content schema + access + revalidate hooks | `lib/access`, `lib/revalidate`, `lib/slugs` |
| `blocks/<Name>/config.ts` + `Component.tsx` | One block's fields and its React rendering | design tokens, `components/` |
| `lib/payload.ts` | Cached server-side Payload Local API client; `getPage`, `getVertical`, `getVerticals`, `getSiteSettings`, `getNavigation` (draft-aware) | payload config, `draftMode()` |
| `lib/seo/` | `buildMetadata(doc, settings)` and JSON-LD builders (pure functions) | none |
| `lib/access/` | `isStaff`, `isSuperAdmin`, `publishedOrStaff`, `staffOnlyField` (pure) | none |
| `lib/slugs.ts` | Reserved slugs + cross-collection uniqueness validation | Payload `req` |
| `lib/revalidate.ts` | Maps a changed doc to paths/tags and revalidates | `next/cache` |
| `components/HeroSlideshow` | Client island; renders server-provided slides; state via `heroReducer` | `lib/hero/reducer.ts` |
| `components/VerticalGraphic` | SVG composition around a `next/image` photo; 3 layout variants by index | none |
| `app/(frontend)/*` | Routes: `/`, `/[vertical]`, `/privacy`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `/api/preview` (enter/exit draft mode) | `lib/payload`, `lib/seo` |
| `seed/` | Idempotent seeding via Local API | payload config |

## Data flow
- **Read (public):** route → `lib/payload` (Local API, `draft: false`, `overrideAccess: false`) → Postgres → React Server Components → static HTML at build; ISR via tags.
- **Publish:** editor saves in `/cms` → collection `afterChange` → `revalidateTag('page:home' | 'vertical:<slug>' | 'globals')` and `revalidatePath` for sitemap → next request regenerates.
- **Preview:** `/api/preview?secret&path` → `draftMode().enable()` → routes fetch with `draft: true` → live preview iframe in admin.
- **Media:** upload → S3 adapter → Supabase Storage `media` bucket → `next/image` with remote pattern for the Storage host.

## Failure modes
| Failure | Effect | Handling |
|---|---|---|
| DB unreachable at request time | ISR regeneration fails | Last good static page keeps serving (Next keeps stale on error); Sentry alert |
| DB unreachable at build | Build fails | CI catches; Vercel keeps previous deployment |
| Storage unreachable | Images 404 | Alt text shown; Sentry; no page crash (images not required for render) |
| Missing vertical doc / unknown slug | — | `notFound()` → branded 404 page |
| Revalidate hook throws | Content saved but page stale | Hook catches and logs to Sentry; never blocks the save |
| Editor deletes required globals content | Empty fields | Components render nothing for empty optional fields; required fields enforced in schema |

## Trade-offs accepted
- Static generation + tag revalidation over fully dynamic rendering: speed and resilience over instant consistency (seconds).
- Local API (in-process) over REST/GraphQL for the frontend: no network hop, typed; ties frontend to Payload (accepted, one app).
- Plain Postgres in tests rather than Supabase: faster CI; S3/Storage behaviour covered by a manual pre-launch check.
