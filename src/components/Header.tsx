import Link from 'next/link'

import { ButtonLink } from './ui'

// Static shell (A4). Links and CTA come from the Navigation global in C1; the
// logo's hero-reset behaviour on the home page arrives with HeroSlideshow (C3).
const links = [
  { label: 'Verticals', href: '/#verticals' },
  { label: 'How we work', href: '/#approach' },
  { label: 'Why TRBD', href: '/#why' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white">
      <div className="wrap flex h-16 items-center justify-between gap-5 nav:h-[72px]">
        <Link
          href="/"
          className="flex items-center gap-3 no-underline"
          aria-label="TRBD Consulting Group home"
        >
          <span
            aria-hidden="true"
            className="grid size-[38px] shrink-0 place-items-center bg-navy text-[13px] font-semibold tracking-[0.06em] text-white"
          >
            TRBD
          </span>
          <span className="font-serif text-[15px] font-semibold leading-tight text-navy sm:text-[19px]">
            TRBD Consulting Group
          </span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-7 text-[15px] font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-ink no-underline hover:text-amber-ink nav:inline"
            >
              {link.label}
            </Link>
          ))}
          <ButtonLink href="/#contact" size="sm">
            Contact us
          </ButtonLink>
        </nav>
      </div>
    </header>
  )
}
