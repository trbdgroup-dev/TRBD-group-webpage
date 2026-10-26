'use client'

import Link from 'next/link'
import { useEffect } from 'react'

// Shown when a page fails to render (for example, the database is unreachable).
// The header and footer stay; visitors can retry or go home. Server errors only
// carry a digest here (no details), which matches the server logs and Sentry.
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="section bg-white">
      <div className="wrap max-w-[860px]">
        <div className="rule">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-ink">
            Something went wrong
          </p>
          <h1 className="mt-3 text-[clamp(34px,4.6vw,56px)] text-navy">
            This page could not be loaded
          </h1>
          <p className="mt-5 max-w-[34em] text-lg text-muted">
            Please try again in a moment. If the problem continues, email us at{' '}
            <a href="mailto:contact@trbdgroup.com" className="text-amber-ink underline">
              contact@trbdgroup.com
            </a>
            .
          </p>
          {error.digest ? (
            <p className="mt-3 text-sm text-muted">Reference: {error.digest}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => retry()}
              className="cursor-pointer bg-amber px-[22px] py-3 text-[15px] font-semibold text-navy hover:brightness-105"
            >
              Try again
            </button>
            <Link href="/" className="text-sm font-semibold text-amber-ink">
              Back to the home page
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
