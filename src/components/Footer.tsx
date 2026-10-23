import Link from 'next/link'

// Static shell (A4). Content comes from the Navigation global and Verticals in C1.
const verticals = [
  { label: 'Manpower', href: '/manpower' },
  { label: 'Education & Training', href: '/education-training' },
  { label: 'Oil & Gas', href: '/oil-gas' },
  { label: 'Green Energy', href: '/green-energy' },
  { label: 'Global Business', href: '/global-business' },
]

const company = [
  { label: 'How we work', href: '/#approach' },
  { label: 'Why TRBD', href: '/#why' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Privacy notice', href: '/privacy' },
]

function LinkGroup({ title, links }: { title: string; links: typeof company }) {
  return (
    <div>
      <h2 className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-amber">
        {title}
      </h2>
      <ul className="grid gap-1.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="no-underline hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-navy text-sm text-[#c9d3db]">
      <div className="wrap pb-8 pt-14">
        <div className="grid gap-10 nav:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-serif text-xl font-semibold text-white">TRBD Consulting Group</p>
            <p className="mt-3 max-w-[28em]">People, skills, energy and markets under one roof.</p>
          </div>
          <LinkGroup title="Verticals" links={verticals} />
          <LinkGroup title="Company" links={company} />
        </div>
        <p className="mt-10 border-t border-white/15 pt-5 text-[13px] text-[#93a3b0]">
          © {new Date().getFullYear()} TRBD Consulting Group Private Limited
        </p>
      </div>
    </footer>
  )
}
