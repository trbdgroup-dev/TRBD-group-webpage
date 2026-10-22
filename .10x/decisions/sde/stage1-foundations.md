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
