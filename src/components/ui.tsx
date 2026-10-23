import Link from 'next/link'
import React from 'react'

// Small presentational primitives shared across blocks (A4). Server components.

type WithClass = { className?: string }

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ')

/** Small uppercase label above a heading, e.g. "WHAT WE DO". */
export function Label({
  children,
  className,
  tone = 'ink',
}: WithClass & { children: React.ReactNode; tone?: 'ink' | 'light' }) {
  return (
    <p
      className={cx(
        'text-xs font-semibold uppercase tracking-[0.14em]',
        tone === 'ink' ? 'text-amber-ink' : 'text-amber',
        className,
      )}
    >
      {children}
    </p>
  )
}

/** Amber solid button rendered as a link. */
export function ButtonLink({
  href,
  children,
  className,
  size = 'md',
}: WithClass & { href: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-[22px] py-3 text-[15px]',
    lg: 'px-7 py-4 text-[17px] shadow-[0_8px_24px_rgba(0,0,0,0.4)]',
  }
  return (
    <Link
      href={href}
      className={cx(
        'inline-flex items-center gap-3 whitespace-nowrap bg-amber font-semibold text-navy no-underline hover:brightness-105',
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  )
}

/** "Learn more →" link with a circled arrow. */
export function MoreLink({
  href,
  children,
  className,
  tone = 'ink',
}: WithClass & { href: string; children: React.ReactNode; tone?: 'ink' | 'light' }) {
  return (
    <Link
      href={href}
      className={cx(
        'group inline-flex items-center gap-2.5 text-sm font-semibold no-underline',
        tone === 'ink' ? 'text-amber-ink' : 'text-white',
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-full border-[1.5px] border-current transition-transform group-hover:translate-x-[3px]"
      >
        →
      </span>
    </Link>
  )
}

/** Section header: one full-width rule, label + heading left, intro text right. */
export function SectionHeader({
  label,
  heading,
  intro,
  className,
}: WithClass & { label: string; heading: string; intro?: string }) {
  return (
    <div
      className={cx('rule grid items-end gap-5 nav:grid-cols-[1fr_1.2fr] nav:gap-10', className)}
    >
      <div>
        <Label>{label}</Label>
        <h2 className="mt-3 text-[clamp(30px,3.8vw,46px)] text-navy">{heading}</h2>
      </div>
      {intro ? <p className="text-muted">{intro}</p> : null}
    </div>
  )
}
