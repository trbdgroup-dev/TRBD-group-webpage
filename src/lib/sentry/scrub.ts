import type { Breadcrumb, ErrorEvent } from '@sentry/nextjs'

// Applied to every Sentry event before it leaves the server or the browser
// (spec §9, DPDP). Sentry stores data outside India, so nothing personal or
// secret goes there: no request bodies, cookies, auth headers, user identity,
// IP addresses, email addresses or query strings (/preview?secret=… carries one).

// Plain or URL-encoded ("%40") addresses.
const EMAIL = /[A-Z0-9._%+-]+(?:@|%40)[A-Z0-9.-]+\.[A-Z]{2,}/gi

export const redactEmails = (text: string) => text.replace(EMAIL, '[email]')

/** Drops the query string and fragment: "/preview?secret=x" → "/preview". */
export function stripQuery(url: string): string {
  const cut = url.search(/[?#]/)
  return cut === -1 ? url : url.slice(0, cut)
}

// A path or URL followed by a query/fragment, anywhere in a string:
// "GET /preview?secret=x" → "GET /preview". Group 1 keeps the part before "?"/"#".
const URL_WITH_QUERY = /((?:https?:\/\/[^\s/?#]+)?\/[^\s?#]*)[?#]\S*/g

/** Strips query strings from every URL in a piece of text and redacts emails. */
export const scrubText = (text: string) => redactEmails(text.replace(URL_WITH_QUERY, '$1'))

/** Applies scrubText to every string, at any depth. */
function scrubValue(value: unknown): unknown {
  if (typeof value === 'string') return scrubText(value)
  if (Array.isArray(value)) return value.map(scrubValue)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, scrubValue(v)]))
  }
  return value
}

export function scrubEvent(event: ErrorEvent): ErrorEvent {
  // Integrations add their own copies of the URL (e.g. contexts.nextjs.request_path).
  if (event.contexts) event.contexts = scrubValue(event.contexts) as ErrorEvent['contexts']
  if (event.tags) event.tags = scrubValue(event.tags) as ErrorEvent['tags']
  if (event.extra) event.extra = scrubValue(event.extra) as ErrorEvent['extra']
  if (event.transaction) event.transaction = scrubValue(event.transaction) as string
  if (event.request) {
    const { url, method } = event.request
    event.request = { method, ...(url ? { url: stripQuery(url) } : {}) }
  }
  delete event.user
  if (event.message) event.message = scrubText(event.message)
  for (const exception of event.exception?.values ?? []) {
    if (exception.value) exception.value = scrubText(exception.value)
  }
  if (event.breadcrumbs) event.breadcrumbs = event.breadcrumbs.map(scrubBreadcrumb)
  return event
}

export function scrubBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb {
  const data = breadcrumb.data ? { ...breadcrumb.data } : undefined
  if (data) {
    for (const key of ['url', 'from', 'to']) {
      if (typeof data[key] === 'string') data[key] = stripQuery(data[key] as string)
    }
  }
  return {
    ...breadcrumb,
    ...(breadcrumb.message ? { message: scrubText(breadcrumb.message) } : {}),
    ...(data ? { data } : {}),
  }
}
