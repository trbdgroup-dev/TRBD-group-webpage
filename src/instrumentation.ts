import * as Sentry from '@sentry/nextjs'

import { sentryOptions } from './lib/sentry/options'

// Server and edge error reporting (F3). Off unless NEXT_PUBLIC_SENTRY_DSN is set.
export function register() {
  Sentry.init(sentryOptions())
}

// Errors thrown while rendering server components, route handlers and actions.
export const onRequestError = Sentry.captureRequestError
