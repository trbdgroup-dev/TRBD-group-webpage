import { ChevronDown } from 'lucide-react'

import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/RichText'
import { ButtonLink, Label, MoreLink } from '@/components/ui'
import { VerticalGraphic } from '@/components/VerticalGraphic'
import { hasRichText, mailtoHref } from '@/lib/content'
import { env } from '@/lib/env'
import { toImage } from '@/lib/media'
import { getSiteSettings, getVerticals } from '@/lib/payload'
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo/jsonld'
import type { Vertical } from '@/payload-types'

// One vertical's page (spec §5): intro with graphic, who we work with, services,
// how we deliver, common questions, an email strip and links to the other
// verticals. Sections with no content are left out.
export async function VerticalPage({ vertical }: { vertical: Vertical }) {
  const [settings, verticals] = await Promise.all([getSiteSettings(), getVerticals()])
  const position = Math.max(
    0,
    verticals.findIndex((v) => v.slug === vertical.slug),
  )
  const others = verticals.filter((v) => v.slug !== vertical.slug)
  const clients = vertical.whoWeWorkWith ?? []
  const services = vertical.services ?? []
  const faqs = vertical.faqs ?? []
  const showDelivery = hasRichText(vertical.howWeDeliver)
  const site = env.NEXT_PUBLIC_SITE_URL
  const faqData = faqJsonLd(faqs)
  const structuredData = [
    serviceJsonLd(vertical, site),
    breadcrumbJsonLd(
      [
        { name: 'Home', path: '/' },
        { name: vertical.name, path: `/${vertical.slug}` },
      ],
      site,
    ),
    ...(faqData ? [faqData] : []),
  ]

  return (
    <>
      <JsonLd data={structuredData} />
      <section className="bg-white pb-12 pt-14 sm:pb-16 sm:pt-20">
        <div className="wrap grid items-center gap-10 nav:grid-cols-[1.25fr_0.75fr] nav:gap-14">
          <div className="rule">
            <Label>{vertical.name}</Label>
            <h1 className="mt-3 text-[clamp(34px,4.6vw,56px)] text-navy">{vertical.title}</h1>
            <p className="mt-5 max-w-[38em] text-lg text-muted">{vertical.summary}</p>
          </div>
          <div className="w-[260px] max-w-full nav:w-full">
            <VerticalGraphic image={toImage(vertical.heroImage)} variant={position} priority />
          </div>
        </div>
      </section>

      {clients.length > 0 ? (
        <section className="bg-white pb-12">
          <div className="wrap">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Who we work with
            </h2>
            <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
              {clients.map((client) => (
                <li
                  key={client.id ?? client.label}
                  className="border border-line bg-cream px-3 py-1.5 text-sm"
                >
                  {client.label}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {services.length > 0 ? (
        <section className="section bg-cream">
          <div className="wrap">
            <Label>Services</Label>
            <h2 className="mt-3 text-[clamp(30px,3.8vw,46px)] text-navy">What we offer</h2>
            <ul className="mt-10 grid list-none gap-x-14 gap-y-10 p-0 nav:grid-cols-2">
              {services.map((service) => (
                <li key={service.id ?? service.name} className="rule">
                  <h3 className="text-2xl text-navy">{service.name}</h3>
                  {hasRichText(service.description) ? (
                    <RichText data={service.description} className="mt-3 text-muted" />
                  ) : (
                    <p className="mt-3 text-muted">{service.summary}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {showDelivery ? (
        <section className="section bg-white">
          <div className="wrap grid gap-8 nav:grid-cols-[1fr_1.2fr] nav:gap-10">
            <div className="rule">
              <Label>How we deliver</Label>
              <h2 className="mt-3 text-[clamp(30px,3.8vw,46px)] text-navy">
                From brief to results
              </h2>
            </div>
            <RichText data={vertical.howWeDeliver} className="nav:pt-[22px]" />
          </div>
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section className="section bg-white">
          <div className="wrap max-w-[900px]">
            <Label>Common questions</Label>
            <h2 className="mt-3 text-[clamp(30px,3.8vw,46px)] text-navy">Questions clients ask</h2>
            <div className="mt-8">
              {faqs.map((faq) => (
                <details
                  key={faq.id ?? faq.question}
                  className="group border-t border-line last:border-b"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-serif text-xl text-navy [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronDown
                      aria-hidden="true"
                      className="size-5 shrink-0 text-amber-ink transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="whitespace-pre-line pb-6 text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-cream py-14">
        <div className="wrap flex flex-col items-start gap-6 nav:flex-row nav:items-center nav:justify-between">
          <div className="max-w-[640px]">
            <h2 className="text-[clamp(26px,3vw,36px)] text-navy">
              Talk to our {vertical.name} team
            </h2>
            <p className="mt-3 text-muted">
              Email us a few details about your requirement and we will get back to you within two
              working days.
            </p>
          </div>
          <ButtonLink href={mailtoHref(settings.contactEmail, `Enquiry: ${vertical.name}`)}>
            Email us
          </ButtonLink>
        </div>
      </section>

      {others.length > 0 ? (
        <nav aria-label="Other verticals" className="bg-white py-14">
          <div className="wrap">
            <Label>Other verticals</Label>
            <ul className="mt-6 grid list-none gap-x-8 gap-y-4 p-0 sm:grid-cols-2 nav:grid-cols-4">
              {others.map((other) => (
                <li key={other.id} className="rule pt-4">
                  <MoreLink href={`/${other.slug}`}>{other.name}</MoreLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      ) : null}
    </>
  )
}
