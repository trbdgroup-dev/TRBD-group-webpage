import { forwardRouterTransition, loadSentryWhenIdle } from './lib/sentry/client'

// Browser error reporting (F3), loaded lazily after the page is interactive.
// Off unless NEXT_PUBLIC_SENTRY_DSN is set.
loadSentryWhenIdle()

export const onRouterTransitionStart = forwardRouterTransition
