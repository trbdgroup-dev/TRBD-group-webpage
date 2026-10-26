import { sentryOptions } from './options'

// Browser-side Sentry, loaded lazily (Phase 5 performance fix): its ~42 KB
// (gzip) would otherwise sit in the main bundle and delay the first render on
// slow phones. Nothing loads unless NEXT_PUBLIC_SENTRY_DSN is set. Trade-off:
// browser errors in the first moments of a visit, before Sentry loads, aren't
// reported. Server-side reporting (instrumentation.ts) is unaffected.

type SentryModule = typeof import('@sentry/nextjs')

let loading: Promise<SentryModule> | null = null
let loaded: SentryModule | null = null

export function loadSentry(): Promise<SentryModule> | null {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return null
  loading ??= import('@sentry/nextjs').then((Sentry) => {
    Sentry.init(sentryOptions())
    loaded = Sentry
    return Sentry
  })
  return loading
}

/** Start loading once the page has finished loading and the browser is idle. */
export function loadSentryWhenIdle() {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SENTRY_DSN) return
  const start = () =>
    'requestIdleCallback' in window
      ? window.requestIdleCallback(() => loadSentry(), { timeout: 4000 })
      : setTimeout(() => loadSentry(), 2000)
  if (document.readyState === 'complete') start()
  else window.addEventListener('load', start, { once: true })
}

/** Report an error from an error page, loading Sentry first if needed. */
export function reportError(error: unknown) {
  void loadSentry()?.then((Sentry) => Sentry.captureException(error))
}

/** Forwards Next.js router transitions once Sentry has loaded. */
export function forwardRouterTransition(
  ...args: Parameters<SentryModule['captureRouterTransitionStart']>
) {
  loaded?.captureRouterTransitionStart(...args)
}
