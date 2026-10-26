import { scrubBreadcrumb, scrubEvent } from './scrub'

// Shared Sentry settings for the server, edge and browser (F3). Sentry is off
// unless NEXT_PUBLIC_SENTRY_DSN is set, so local development and CI send nothing.
// Errors only: no performance tracing, no session replay, no default PII.
export function sentryOptions() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
  return {
    dsn,
    enabled: Boolean(dsn),
    environment:
      process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    beforeSend: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
  }
}
