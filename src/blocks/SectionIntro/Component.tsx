import { SectionHeader } from '@/components/ui'
import type { SectionIntroBlock as Data } from '@/payload-types'

// "Who we are": a section header on its own, on white.
export function SectionIntroBlock({ block }: { block: Data }) {
  return (
    <section id={block.anchor ?? undefined} className="section bg-white">
      <div className="wrap">
        <SectionHeader
          label={block.label}
          heading={block.heading}
          intro={block.text ?? undefined}
        />
      </div>
    </section>
  )
}
