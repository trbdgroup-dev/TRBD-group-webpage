import { SectionHeader } from '@/components/ui'
import type { ApproachStagesBlock as Data } from '@/payload-types'

// "How we work": stages in columns, each under a navy rule.
export function ApproachStagesBlock({ block }: { block: Data }) {
  const stages = block.stages ?? []
  return (
    <section id={block.anchor ?? undefined} className="section bg-white">
      <div className="wrap">
        <SectionHeader
          label={block.label}
          heading={block.heading}
          intro={block.intro ?? undefined}
        />
        <ol className="mt-12 grid list-none gap-8 p-0 sm:grid-cols-2 nav:grid-cols-4">
          {stages.map((stage) => (
            <li key={stage.id ?? stage.title} className="rule">
              <h3 className="text-2xl text-navy">{stage.title}</h3>
              <p className="mt-2.5 text-[15px] text-muted">{stage.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
