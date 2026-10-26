import { Label } from '@/components/ui'
import type { StatsBlock as Data } from '@/payload-types'

// Key figures on cream. Not used at launch: only for numbers the firm can stand behind.
export function StatsBlock({ block }: { block: Data }) {
  const items = block.items ?? []
  if (items.length === 0) return null

  return (
    <section className="bg-cream py-14 sm:py-16">
      <div className="wrap">
        {block.label ? <Label className="mb-6">{block.label}</Label> : null}
        <dl className="m-0 grid gap-8 sm:grid-cols-2 nav:grid-cols-4">
          {items.map((item) => (
            <div key={item.id ?? item.label} className="rule">
              <dt className="sr-only">{item.label}</dt>
              <dd className="m-0">
                <span className="block font-serif text-[clamp(36px,4vw,52px)] leading-none text-navy">
                  {item.value}
                </span>
                <span aria-hidden="true" className="mt-3 block text-[15px] text-muted">
                  {item.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
