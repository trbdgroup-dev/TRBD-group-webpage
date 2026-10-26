'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type React from 'react'

import { HERO_RESET_EVENT } from './HeroSlideshow'

// On the home page the logo returns the hero to its TRBD intro and scrolls to the
// top (ADR-003); everywhere else it is an ordinary link home.
export function LogoLink({
  className,
  label,
  children,
}: {
  className?: string
  label: string
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <Link
      href="/"
      aria-label={label}
      className={className}
      onClick={(event) => {
        if (pathname !== '/') return
        event.preventDefault()
        window.dispatchEvent(new Event(HERO_RESET_EVENT))
        window.scrollTo({ top: 0 })
        if (window.location.hash) window.history.replaceState(null, '', '/')
      }}
    >
      {children}
    </Link>
  )
}
