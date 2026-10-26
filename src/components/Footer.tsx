import Link from 'next/link'

import { linkProps, type CmsLink } from '@/lib/links'
import { getNavigation, getSiteSettings, getVerticals } from '@/lib/payload'

// Verticals come from the Verticals collection; company links from Navigation,
// with the approved defaults until it has content.
const DEFAULT_COMPANY_LINKS = [
  { href: '/#approach', label: 'How we work' },
  { href: '/#why', label: 'Why TRBD' },
  { href: '/#contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy notice' },
]

type FooterLink = { href: string; label: string; target?: string; rel?: string }

function LinkGroup({ title, links }: { title: string; links: FooterLink[] }) {
  if (links.length === 0) return null
  return (
    <div>
      <h2 className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-amber">
        {title}
      </h2>
      <ul className="grid gap-1.5">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              target={link.target}
              rel={link.rel}
              className="no-underline hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function Footer() {
  const [navigation, settings, verticals] = await Promise.all([
    getNavigation(),
    getSiteSettings(),
    getVerticals(),
  ])

  const verticalLinks = verticals.map((v) => ({ href: `/${v.slug}`, label: v.name }))
  const cmsCompany = (navigation.footerLinks ?? [])
    .map((item) => {
      const props = linkProps(item.link as CmsLink)
      return props ? { ...props, label: item.link.label ?? '' } : null
    })
    .filter((link) => link !== null)
  const companyLinks = cmsCompany.length > 0 ? cmsCompany : DEFAULT_COMPANY_LINKS

  return (
    <footer className="bg-navy text-sm text-[#c9d3db]">
      <div className="wrap pb-8 pt-14">
        <div className="grid gap-10 nav:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-serif text-xl font-semibold text-white">{settings.companyName}</p>
            {settings.tagline ? <p className="mt-3 max-w-[28em]">{settings.tagline}</p> : null}
          </div>
          <LinkGroup title="Verticals" links={verticalLinks} />
          <LinkGroup title="Company" links={companyLinks} />
        </div>
        <p className="mt-10 border-t border-white/15 pt-5 text-[13px] text-[#93a3b0]">
          © {new Date().getFullYear()} {settings.legalName}
        </p>
      </div>
    </footer>
  )
}
