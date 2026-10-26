import { Label } from '@/components/ui'
import type { TestimonialsBlock as Data } from '@/payload-types'

// Client quotes. Not used at launch: only for quotes the client has approved.
export function TestimonialsBlock({ block }: { block: Data }) {
  const items = block.items ?? []
  if (items.length === 0) return null

  return (
    <section className="section bg-white">
      <div className="wrap">
        {block.label ? <Label>{block.label}</Label> : null}
        {block.heading ? (
          <h2 className="mt-3 text-[clamp(30px,3.8vw,46px)] text-navy">{block.heading}</h2>
        ) : null}
        <div className="mt-10 grid gap-6 nav:grid-cols-2">
          {items.map((item) => {
            const attribution = [item.role, item.company].filter(Boolean).join(', ')
            return (
              <figure
                key={item.id ?? item.name}
                className="m-0 border-l-2 border-amber bg-cream p-7"
              >
                <blockquote className="m-0 font-serif text-xl leading-snug text-navy">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-semibold text-ink">{item.name}</span>
                  {attribution ? <span className="text-muted">, {attribution}</span> : null}
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
