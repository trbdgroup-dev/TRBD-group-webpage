# TRBD Consulting Group website

The website for TRBD Consulting Group Private Limited: a light, picture-led marketing site for the firm's five verticals (Manpower, Education & Training, Oil & Gas, Green Energy, Global Business), with every word and image editable in a CMS.

It is one Next.js application with Payload CMS built in, backed by Supabase (Postgres and file storage) in Mumbai, and hosted on Vercel.

|             |                                                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public site | `/`, `/manpower`, `/education-training`, `/oil-gas`, `/green-energy`, `/global-business`, `/privacy`                                                         |
| CMS (staff) | `/cms`                                                                                                                                                       |
| Docs        | [Architecture](docs/architecture.md) · [Content guide](docs/content-guide.md) · [Launch checklist](docs/launch-checklist.md) · [Decision records](docs/adr/) |

## Stack

Next.js 16 (App Router, React 19, TypeScript) · Payload CMS 3 · Supabase Postgres 17 and Storage · Tailwind CSS 4 · Vitest · Playwright with axe · Sentry · Vercel. Exact versions are pinned in `package.json`. The agreed plan is in [`tech-stack.md`](tech-stack.md); deviations are recorded in the [decision records](docs/adr/) and [architecture notes](docs/architecture.md).

## Prerequisites

- **Node.js 22** (22.18 or later; the latest 22.x is recommended).
- **Docker Desktop**, running. Local Supabase runs in Docker.
- npm (comes with Node).

## First-time setup

```bash
npm install
cp .env.example .env
npx supabase start          # first run downloads the images (a few minutes)
npx supabase seed buckets   # creates the public "media" storage bucket
npx supabase status -o env  # shows the local S3 keys used below
```

Fill in `.env` (see the comments in `.env.example`):

- `PAYLOAD_SECRET`: at least 32 random characters, e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- `PREVIEW_SECRET`: at least 16 random characters.
- `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY`: the `S3_PROTOCOL_ACCESS_KEY_ID` / `S3_PROTOCOL_ACCESS_KEY_SECRET` values from `npx supabase status -o env`. (Or set `STORAGE_DRIVER=local` to keep uploads on disk instead.)
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`: a throwaway local admin login.

Then create the tables, load the starting content and start the site:

```bash
npm run migrate
npm run seed
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/cms for the CMS (sign in with the `SEED_ADMIN_*` values). Supabase Studio is at http://127.0.0.1:54323.

## Everyday commands

| Command                                                 | What it does                                                                                             |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run dev`                                           | Development server with hot reload                                                                       |
| `npm run build` / `npm run start`                       | Production build / serve it on :3000                                                                     |
| `npm run lint` · `npm run typecheck` · `npm run format` | Code checks and formatting                                                                               |
| `npm test`                                              | Unit tests (Vitest, `tests/unit`)                                                                        |
| `npm run test:e2e`                                      | End-to-end tests (Playwright, `tests/e2e`) against a running production build; run `npm run build` first |
| `npm run migrate`                                       | Apply database migrations                                                                                |
| `npm run migrate:create -- <name>`                      | Create a migration after changing a collection, global or block                                          |
| `npm run generate:types`                                | Regenerate `src/payload-types.ts` after changing the CMS config                                          |
| `npm run seed`                                          | Load the starting content; only creates what is missing                                                  |
| `npm run seed:reset`                                    | Delete the seeded content and load it again                                                              |
| `npm run seed:admin`                                    | Create or repair only the first admin account                                                            |

### Changing the CMS structure

1. Edit the collection, global or block in `src/collections`, `src/globals` or `src/blocks`.
2. `npm run generate:types`
3. `npm run migrate:create -- describe-the-change`, check the generated SQL, then `npm run migrate`.
4. Commit the config, `src/payload-types.ts` and the new file in `src/migrations` together. CI fails if the types or migrations are missing.

## Project structure

```
src/
  app/(frontend)/     public site: layout, home, [slug] (verticals and CMS pages), 404, error, sitemap, /og, /preview
  app/(payload)/      Payload admin and API (generated by Payload)
  app/robots.ts       robots.txt (must sit at the app root)
  blocks/             CMS section blocks: config.ts (fields) + Component.tsx (rendering)
  collections/        Pages, Verticals, Media, Users
  globals/            Site Settings, Navigation
  fields/             shared link and SEO fields
  components/         header, footer, hero slideshow, vertical page, shared UI
  lib/                data access, access rules, slugs, SEO, revalidation, preview, Sentry scrubbing
  migrations/         committed Payload migrations
seed/                 starting content, photos (with credits) and the seed script
tests/unit/           Vitest
tests/e2e/            Playwright
docs/                 architecture, content guide, launch checklist, decision records
supabase/             local Supabase config
.10x/                 project planning and decision log
```

## Testing

- **Unit tests** cover pure logic: access rules, slugs, SEO metadata and structured data, revalidation, preview links, hero state, Sentry scrubbing.
- **End-to-end tests** run against a production build at 1280px and 375px: pages, draft privacy, the hero, accessibility (axe, WCAG 2.2 AA), layout and SEO output.

```bash
npm run build && npm run test:e2e
```

## CI

`.github/workflows/ci.yml` runs on every pull request and every push to `main`: install, lint, format, typecheck, Payload types and migrations up to date, unit tests, migrate and seed a throwaway Postgres, build, and the Playwright suite. CI uses disk storage (`STORAGE_DRIVER=local`) instead of Supabase.

## Deployment

See the [launch checklist](docs/launch-checklist.md): accounts, environment variables, the first deploy, DNS and post-launch checks.

## Licences and credits

Stock photos are from Unsplash under the Unsplash License; each photo's credit and source are stored in the CMS and in `seed/images/manifest.json`.
