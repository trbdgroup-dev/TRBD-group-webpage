import { ButtonLink, Label } from '@/components/ui'
import { env } from '@/lib/env'
import { getSiteSettings } from '@/lib/payload'
import type { ContactBlock as Data } from '@/payload-types'

// Contact: company details from Site Settings and an "Email us" button.
// Stage 2 replaces the button with the enquiry form. Empty details are hidden.
export async function ContactBlock({ block }: { block: Data }) {
  const settings = await getSiteSettings()
  const website = new URL(env.NEXT_PUBLIC_SITE_URL).host

  const details = [
    { label: 'Company', value: settings.legalName },
    { label: 'Email', value: settings.contactEmail, href: `mailto:${settings.contactEmail}` },
    {
      label: 'Phone',
      value: settings.phone,
      href: settings.phone ? `tel:${settings.phone.replace(/[^\d+]/g, '')}` : undefined,
    },
    { label: 'Office', value: settings.officeAddress },
    { label: 'Hours', value: settings.workingHours },
    { label: 'Website', value: website },
  ].filter((detail): detail is { label: string; value: string; href?: string } =>
    Boolean(detail.value),
  )

  return (
    <section id={block.anchor ?? undefined} className="section bg-white">
      <div className="wrap grid items-start gap-10 nav:grid-cols-[1.1fr_1fr] nav:gap-16">
        <div>
          {block.label ? <Label>{block.label}</Label> : null}
          <h2 className="mt-3 text-[clamp(30px,3.8vw,46px)] text-navy">{block.heading}</h2>
          {block.text ? <p className="mt-4 max-w-[32em] text-muted">{block.text}</p> : null}
          <ButtonLink href={`mailto:${settings.contactEmail}`} className="mt-7">
            {block.buttonLabel}
          </ButtonLink>
        </div>
        <dl className="m-0">
          {details.map((detail) => (
            <div key={detail.label} className="border-t border-line py-4 last:border-b">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-ink">
                {detail.label}
              </dt>
              <dd className="m-0 whitespace-pre-line">
                {detail.href ? <a href={detail.href}>{detail.value}</a> : detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
