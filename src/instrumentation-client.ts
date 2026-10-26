import * as Sentry from '@sentry/nextjs'

import { sentryOptions } from './lib/sentry/options'

// Browser error reporting (F3). Off unless NEXT_PUBLIC_SENTRY_DSN is set.
Sentry.init(sentryOptions())

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
