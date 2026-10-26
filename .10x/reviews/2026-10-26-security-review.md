# Security review: stage 1 foundations

**Date:** 2026-10-26 · **Reviewer role:** Security engineer · **Scope:** the whole stage 1 build (commit `638b958` plus the fixes listed here), run locally as a production build against local Supabase.

**Verdict:** ready for launch once the launch checklist is done. No open findings above low; two dependency advisories accepted with reasons.

## Threat model in brief

- **Public visitors** read published pages only. No forms, no visitor accounts, no tracking cookies; draft-mode cookies are for staff only.
- **Staff** sign in to Payload at `/cms`. Their content is trusted for layout, but not for links or markup injection.
- **Assets worth protecting:** staff accounts, unpublished drafts, team inbox addresses, the preview secret, server credentials.

## Findings and fixes

| #   | Finding                                                                                                                | Severity           | Status                                                                                                                                                                                                                         |
| --- | ---------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| S1  | `npm audit --omit=dev`: 19 findings including 1 critical (sharp/libvips, dompurify, undici).                            | Critical           | **Fixed**: sharp 0.35.5; overrides for `dompurify` 3.4.17 and `undici` 7.30.1. undici is 11 days old, a deliberate exception to the two-week pinning rule for a security fix.                                                  |
| S2  | `happy-dom` (high) via Payload's rich-text editor (`@lexical/headless`); no fix in the 20.x line Payload requires.      | High (advisory)    | **Accepted**: it only processes content typed by signed-in staff, never visitor input. Recheck when Payload updates.                                                                                                            |
| S3  | `esbuild` ≤0.24.2 (moderate) via a build-time helper.                                                                  | Moderate (advisory) | **Accepted**: affects only esbuild's development server, which this project never starts.                                                                                                                                      |
| S4  | Rich-text links: React blocks `javascript:` URLs, but `data:` and `vbscript:` passed through to `href`.                 | Medium             | **Fixed**: `safeHref` in `src/lib/links.ts` allows only `http(s)`, `mailto:`, `tel:`, `/` and `#`; applied to rich-text `link` and `autolink`. 8 unit tests.                                                                    |
| S5  | No security headers beyond `X-Robots-Tag`.                                                                             | Medium             | **Fixed** in `next.config.ts`: HSTS (2 years, subdomains, preload), `nosniff`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN` and CSP `frame-ancestors 'self'` (Live Preview still works), `base-uri`/`object-src`/`form-action` locked down, `Permissions-Policy`. |
| S6  | `X-Powered-By: Next.js, Payload` revealed the stack.                                                                   | Low                | **Fixed**: `poweredByHeader: false` (Payload honours it).                                                                                                                                                                       |
| S7  | Payload's GraphQL endpoint and playground were enabled but unused.                                                     | Low                | **Fixed**: `graphQL.disable`; `/api/graphql` returns 404.                                                                                                                                                                       |
| S8  | Preview secret compared with `!==` (a theoretical timing leak).                                                        | Low                | **Fixed**: `crypto.timingSafeEqual` with a length check.                                                                                                                                                                        |
| S9  | No script CSP (`script-src`).                                                                                          | Low                | **Accepted for stage 1**: Next.js inline scripts need per-request nonces, which makes every static page dynamic. The site takes no visitor input and CMS output is escaped. Revisit with the stage 2 form.                       |
| S10 | Concurrent logins for the same staff account keep only one session (Payload behaviour).                                | Info               | Not a security issue, but it made an end-to-end test flaky. The tests now log in once per run.                                                                                                                                  |

## Verified (probe script against the production build: 30/30 pass)

- Anonymous visitors can't list users, read drafts (`draft=true` is ignored), read team inbox fields, upload media, create or edit content, or create the first user.
- Repeated wrong passwords lock the account; the error doesn't reveal whether the email exists.
- `/cms` streams a redirect to `/cms/login` and contains no admin data.
- `/preview` refuses a wrong secret, a right secret without a staff session, and off-site `path` values; `/preview/exit` refuses off-site redirects.
- All the headers above are present on pages, API routes and `/cms`; there's no `X-Powered-By`.
- JSON-LD escapes `</script>` (unit-tested in D2).
- Sentry scrubbing, with a stand-in endpoint and the DSN set: an error message carrying a `secret=` query and an email address arrived as `Probe failure at /preview for [email]`. Neither the secret nor the email (plain or URL-encoded) appeared anywhere in the event.

## Secrets and configuration

- `.env` is gitignored, and CI uses throwaway values.
- `PREVIEW_SECRET` and `PAYLOAD_SECRET` lengths are validated at start-up (`src/lib/parse-env.ts`).

## For launch (in `docs/launch-checklist.md`)

- Check the headers on the live domain, including that `x-robots-tag` is absent there.
- Change the seeded admin password, and create named accounts for staff.
- Consider submitting for HSTS preload after a few weeks on HTTPS.
- Re-run `npm audit --omit=dev`, and drop the overrides once Payload catches up.
