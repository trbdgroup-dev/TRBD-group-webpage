# Security — cross-cutting

- Security headers live in `next.config.ts` and apply to every route: HSTS with preload, and framing allowed only by the site itself (for Live Preview).
- Links from the CMS go through `safeHref`. Never render a CMS URL into `href` without it.
- Compare secrets in constant time. Keep secrets out of what reaches monitoring: the Sentry scrubber strips query strings and email addresses.
- Review `npm audit --omit=dev` before each release. Record accepted advisories, with reasons, in the launch checklist. Security fixes may skip the two-week pinning rule.
- The script CSP is deferred until the site takes visitor input (the stage 2 form), because it needs nonces, which make pages dynamic.

## Features

- [stage1-foundations](stage1-foundations.md)
