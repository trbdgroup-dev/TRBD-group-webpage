import Link from 'next/link'

import { linkProps, type CmsLink } from '@/lib/links'
import { getNavigation, getSiteSettings } from '@/lib/payload'

import { LogoLink } from './LogoLink'
import { ButtonLink } from './ui'

// Header links come from the Navigation global. Until it has content, the
// approved defaults are shown so the site never renders an empty header.
const DEFAULT_LINKS = [
  { href: '/#verticals', label: 'Verticals' },
  { href: '/#approach', label: 'How we work' },
  { href: '/#why', label: 'Why TRBD' },
]
const DEFAULT_CTA = { href: '/#contact', label: 'Contact us' }

export async function Header() {
  const [navigation, settings] = await Promise.all([getNavigation(), getSiteSettings()])

  const cmsLinks = (navigation.headerLinks ?? [])
    .map((item) => {
      const props = linkProps(item.link as CmsLink)
      return props ? { ...props, label: item.link.label ?? '' } : null
    })
    .filter((link) => link !== null)
  const links = cmsLinks.length > 0 ? cmsLinks : DEFAULT_LINKS

  const ctaProps = linkProps(navigation.headerCta?.link as CmsLink)
  const cta = ctaProps
    ? { href: ctaProps.href, label: navigation.headerCta?.link?.label || DEFAULT_CTA.label }
    : DEFAULT_CTA

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white">
      <div className="wrap flex h-16 items-center justify-between gap-5 nav:h-[72px]">
        <LogoLink
          className="flex items-center gap-3 no-underline"
          label={`${settings.companyName} home`}
        >
          {/* The mark's letters come from CSS so they aren't page text: the link's
              visible text then matches its accessible name (WCAG 2.5.3). */}
          <span
            aria-hidden="true"
            className="grid size-[38px] shrink-0 place-items-center bg-navy text-[13px] font-semibold tracking-[0.06em] text-white before:content-['TRBD']"
          />
          <span className="font-serif text-[15px] font-semibold leading-tight text-navy sm:text-[19px]">
            {settings.companyName}
          </span>
        </LogoLink>
        <nav aria-label="Main" className="flex items-center gap-7 text-[15px] font-medium">
          {links.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="hidden text-ink no-underline hover:text-amber-ink nav:inline"
            >
              {link.label}
            </Link>
          ))}
          <ButtonLink href={cta.href} size="sm">
            {cta.label}
          </ButtonLink>
        </nav>
      </div>
    </header>
  )
}
