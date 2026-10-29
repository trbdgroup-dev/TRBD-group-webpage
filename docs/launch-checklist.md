# Launch checklist

Everything needed to take the site from this repository to `https://www.trbdgroup.com`, in order. Accounts should be in the firm's name, not a personal one. Prices are from `tech-stack.md`; confirm them on each vendor's pricing page.

Items marked **(verify)** are steps that could not be tested before the accounts existed. Check them carefully on the first deploy.

## 1. Accounts

- [ ] **GitHub:** the repository exists (`vinuaravindh/TRBD-group-webpage`). Consider moving it to an organisation owned by the firm.
- [ ] **Supabase:** create a project in **Mumbai (ap-south-1)**. Free tier is enough for stage 1; Pro ($25/month) once registration and CV uploads go live.
- [ ] **Vercel:** Pro plan ($20/month, 1 seat), connected to the GitHub repository.
- [ ] **Sentry:** create a Next.js project and set an alert for new issues (free tier).

## 2. Supabase

- [ ] **Storage:** create a **public** bucket named `media` (max file size 20 MB; images only).
- [ ] **Storage → S3 connection:** enable it and create an access key. Note the endpoint, region, key ID and secret.
- [ ] **Database → Connect:** copy two connection strings:
  - the **transaction pooler** (port 6543), used by the live site;
  - the **session pooler** or **direct connection**, used to run migrations and the seed.
- [ ] **Check the connection first:** `node scripts/check-db.mjs` with `DATABASE_URI` set to the session pooler string plus `?sslmode=verify-full&sslrootcert=<path to prod-ca-2021.crt>`. It should report SSL: yes.
- [ ] **Run migrations and seed from a trusted machine** (verify):

  ```bash
  DATABASE_URI="<session or direct connection>" STORAGE_DRIVER=s3 S3_...=... npm run migrate
  DATABASE_URI="<session or direct connection>" STORAGE_DRIVER=s3 S3_...=... SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD="<long random>" npm run seed
  ```

  Use the real super admin's email and a long random password, then **change the password in `/cms` after first sign-in**. Future schema changes: run `npm run migrate` the same way before (or as part of) the deploy that needs them.

## 3. Vercel project

- [ ] **Framework:** Next.js. **Node.js:** 22.x. **Function region:** Mumbai (`bom1`).
- [ ] **Environment variables** (Production; set Preview too, ideally pointing at a separate Supabase project so previews never touch live content):

| Variable                                              | Value                                                                                                                                               |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URI`                                        | Supabase **transaction pooler** string (port 6543), with **no** `sslmode` (verify)                                                                  |
| `DATABASE_CA_CERT`                                    | Contents of Supabase's CA certificate (`prod-ca-2021.crt`, from Database settings → SSL Configuration), pasted as text                              |
| `PAYLOAD_SECRET`                                      | New random value, at least 32 characters (never reuse the local one)                                                                                |
| `PREVIEW_SECRET`                                      | New random value, at least 16 characters                                                                                                            |
| `NEXT_PUBLIC_SITE_URL`                                | `https://www.trbdgroup.com` (until the domain is connected: the `….vercel.app` address, or `/cms` sign-in fails; change it and redeploy afterwards) |
| `STORAGE_DRIVER`                                      | `s3`                                                                                                                                                |
| `S3_ENDPOINT`                                         | `https://<project-ref>.supabase.co/storage/v1/s3`                                                                                                   |
| `S3_REGION`                                           | `ap-south-1`                                                                                                                                        |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY`           | From Supabase Storage → S3 connection                                                                                                               |
| `S3_BUCKET`                                           | `media`                                                                                                                                             |
| `S3_PUBLIC_URL`                                       | `https://<project-ref>.supabase.co/storage/v1/object/public/media`                                                                                  |
| `NEXT_PUBLIC_SENTRY_DSN`                              | From the Sentry project                                                                                                                             |
| `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` | For readable error stack traces (source maps)                                                                                                       |

Do **not** set `SEED_ADMIN_*` in Vercel.

- [ ] **Analytics:** enable Web Analytics in the Vercel project. It loads only on the production deploy and sets no cookies.
- [ ] **Deploy** and check the build log for errors.

## 4. Domain

- [ ] Add `www.trbdgroup.com` and `trbdgroup.com` to the Vercel project; make **www** the primary domain and redirect the bare domain to it (308).
- [ ] Update DNS at the domain registrar as Vercel instructs; wait for HTTPS certificates.

## 5. Check the live site

- [ ] `/`, all five verticals, `/privacy` and a made-up address (branded 404) load over HTTPS.
- [ ] `https://www.trbdgroup.com/robots.txt` **allows** crawling and lists the sitemap (verify: this only happens on the production deploy).
- [ ] `/sitemap.xml` lists the home page, the five verticals and the privacy notice with `https://www.trbdgroup.com` addresses.
- [ ] Images load from Supabase Storage (right-click an image → open in new tab → a `supabase.co` address).
- [ ] Sign in at `/cms`; edit and publish a small change; it appears on the live page within seconds; undo it.
- [ ] Live Preview works for a vertical.
- [ ] Share the home page and a vertical in WhatsApp or LinkedIn's post inspector: title, description and image look right.
- [ ] Sentry receives a test error (for example from Sentry's "verify installation" step) with no personal data in it.
- [ ] Run Lighthouse (mobile) on `/` and `/manpower`: performance, accessibility, best practices and SEO all green; LCP under 2.5 s. (Locally, simulated mobile measured LCP 2.9–3.1 s with performance 94; confirm on Vercel's CDN, and if it's still over 2.5 s, make the intro photo smaller in the CMS.)
- [ ] Security headers present on the live site: `curl -sI https://www.trbdgroup.com/` shows `strict-transport-security`, `content-security-policy`, `x-frame-options`, `x-content-type-options`, `referrer-policy` and `permissions-policy`, no `x-powered-by`, and **no** `x-robots-tag` (that one only appears on non-production deploys). Optionally check at securityheaders.com.
- [ ] Once the site has run on HTTPS for a few weeks without problems, consider submitting the domain at hstspreload.org (the header already allows it; removal is slow, so only when sure every subdomain serves HTTPS).

## 6. Search and listings

- [ ] **Google Search Console:** add the `https://www.trbdgroup.com` property using the HTML tag method: paste the code into CMS → Site settings → SEO → Google Search Console code, publish, then verify. Submit `/sitemap.xml`.
- [ ] **Bing Webmaster Tools:** same, with the Bing code (or import from Search Console).
- [ ] **Google Business Profile:** create it once the office address is final. It's the biggest single step for local search.

## 7. Content (see the [content guide](content-guide.md))

- [ ] Vertical copy reviewed and published (all five show "Reviewed").
- [ ] Privacy notice reviewed (DPDP Act).
- [ ] Phone, office address and working hours filled in; each vertical's team inbox filled in.
- [ ] Staff accounts created for the content writer (content editor role); the seeded admin password changed.

## 8. Housekeeping

- [ ] **GitHub:** protect `main` (require pull requests and a passing **CI** check before merging). The first push of the CI workflow is its first real run (verify that it passes).
- [ ] Upgrade local Node.js to the latest 22.x.
- [ ] Run `npm audit --omit=dev` and review anything new. Accepted at the stage 1 review (2026-10-26): `happy-dom` (pulled in by Payload's rich-text editor; no fixed version in the 20.x line; it only processes content typed by staff) and `esbuild` (affects only its development server, which this project never runs). Remove the `dompurify` and `undici` overrides in `package.json` once Payload's own dependencies reach those versions.
- [ ] Record where the secrets live (Vercel, Supabase, Sentry) and who has access.
- [ ] Book a 30-day review: Search Console coverage, Sentry issues, analytics, content updates.
