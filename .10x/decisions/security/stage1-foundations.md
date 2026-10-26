# Security — stage1-foundations

Full review: `.10x/reviews/2026-10-26-security-review.md`.

- 2026-10-26: Review passed. Fixed:
  - Dependency vulnerabilities: sharp 0.35.5, plus overrides for dompurify and undici.
  - Unsafe rich-text link schemes.
  - Missing security headers.
  - The `X-Powered-By` header.
  - The unused GraphQL endpoint.
  - The preview secret check, which wasn't constant-time.
- 2026-10-26: Accepted:
  - The happy-dom advisory: it only handles staff-entered content, and there's no fix within Payload's version range.
  - The esbuild dev-server advisory: that server is never run.
  - No script CSP in stage 1.
- 2026-10-26: The access probe passed 30/30, and Sentry scrubbing was verified end to end with a stand-in endpoint.
