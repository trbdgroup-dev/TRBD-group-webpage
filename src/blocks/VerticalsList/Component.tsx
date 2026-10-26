import { Label, MoreLink, SectionHeader } from '@/components/ui'
import { VerticalGraphic } from '@/components/VerticalGraphic'
import { toImage } from '@/lib/media'
import { getVerticals } from '@/lib/payload'
import type { VerticalsListBlock as Data } from '@/payload-types'

// "What we do": compact alternating rows, one per vertical, from Verticals.
export async function VerticalsListBlock({ block }: { block: Data }) {
  const verticals = await getVerticals()

  return (
    <section id={block.anchor ?? undefined} className="section bg-cream">
      <div className="wrap">
        <SectionHeader
          label={block.label}
          heading={block.heading}
          intro={block.intro ?? undefined}
          className="mb-10"
        />
        {verticals.map((vertical, i) => {
          const flipped = i % 2 === 1
          return (
            <article
              key={vertical.id}
              className={`grid items-center gap-5 py-7 nav:gap-14 ${
                flipped ? 'nav:grid-cols-[0.75fr_1.25fr]' : 'nav:grid-cols-[1.25fr_0.75fr]'
              }`}
            >
              <div className={`rule max-w-[560px] ${flipped ? 'nav:order-2' : ''}`}>
                <Label>{vertical.name}</Label>
                <h3 className="mt-3 text-[clamp(26px,2.8vw,34px)] text-navy">{vertical.title}</h3>
                <p className="mt-3.5 text-muted">{vertical.summary}</p>
                <MoreLink href={`/${vertical.slug}`} className="mt-5">
                  Learn more<span className="sr-only"> about {vertical.name}</span>
                </MoreLink>
              </div>
              <div className="w-[260px] max-w-full justify-self-start nav:w-full nav:justify-self-center">
                <VerticalGraphic image={toImage(vertical.heroImage)} variant={i} />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
