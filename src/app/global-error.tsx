'use client'

// Last-resort fallback when the root layout itself fails (e.g. the header cannot
// load its CMS data). It replaces the whole document, so it carries its own
// minimal styles instead of the site's stylesheet.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          color: '#1b2a38',
          background: '#ffffff',
        }}
      >
        <title>Something went wrong | TRBD Consulting Group</title>
        <main style={{ maxWidth: 640, margin: '0 auto', padding: '96px 24px' }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#8f5d0e',
              fontWeight: 600,
            }}
          >
            TRBD Consulting Group
          </p>
          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontWeight: 500,
              fontSize: 40,
              color: '#12263a',
              margin: '12px 0 0',
            }}
          >
            The site could not be loaded
          </h1>
          <p style={{ marginTop: 20, lineHeight: 1.65, color: '#56656f' }}>
            Please try again in a moment, or email{' '}
            <a href="mailto:contact@trbdgroup.com" style={{ color: '#8f5d0e' }}>
              contact@trbdgroup.com
            </a>
            .
          </p>
          {error.digest ? (
            <p style={{ fontSize: 14, color: '#56656f' }}>Reference: {error.digest}</p>
          ) : null}
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 24,
              padding: '12px 22px',
              border: 0,
              background: '#d99a2b',
              color: '#12263a',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
