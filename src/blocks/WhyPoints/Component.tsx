import {
  Briefcase,
  ChartColumn,
  Clock,
  FileText,
  Globe,
  Handshake,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from 'lucide-react'

import { SectionHeader } from '@/components/ui'
import type { WhyPointsBlock as Data } from '@/payload-types'

// Matches WHY_ICONS in config.ts; editors pick from this fixed set.
const ICONS: Record<NonNullable<Data['points']>[number]['icon'], LucideIcon> = {
  'user-round': UserRound,
  'shield-check': ShieldCheck,
  briefcase: Briefcase,
  'chart-column': ChartColumn,
  globe: Globe,
  'file-text': FileText,
  handshake: Handshake,
  clock: Clock,
}

// "Why TRBD": white cards with an amber top edge on cream.
export function WhyPointsBlock({ block }: { block: Data }) {
  const points = block.points ?? []
  return (
    <section id={block.anchor ?? undefined} className="section bg-cream">
      <div className="wrap">
        <SectionHeader
          label={block.label}
          heading={block.heading}
          intro={block.intro ?? undefined}
        />
        <ul className="mt-12 grid list-none gap-6 p-0 sm:grid-cols-2 nav:grid-cols-3">
          {points.map((point) => {
            const Icon = ICONS[point.icon] ?? UserRound
            return (
              <li
                key={point.id ?? point.title}
                className="border-t-2 border-amber bg-white p-[30px]"
              >
                <Icon aria-hidden="true" className="size-7 text-navy" strokeWidth={1.6} />
                <h3 className="mt-4 text-[21px] text-navy">{point.title}</h3>
                <p className="mt-2 text-[15px] text-muted">{point.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
