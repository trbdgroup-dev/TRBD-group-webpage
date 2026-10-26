import type { Page } from '@/payload-types'

import { ApproachStagesBlock } from './ApproachStages/Component'
import { CallToActionBlock } from './CallToAction/Component'
import { ContactBlock } from './Contact/Component'
import { HeroBlock } from './Hero/Component'
import { SectionIntroBlock } from './SectionIntro/Component'
import { VerticalsListBlock } from './VerticalsList/Component'
import { WhyPointsBlock } from './WhyPoints/Component'

type Block = NonNullable<Page['layout']>[number]

// Renders a page's section blocks in order. Image and text, Stats, Testimonials
// and Rich text arrive in C5.
function RenderBlock({ block }: { block: Block }) {
  switch (block.blockType) {
    case 'hero':
      return <HeroBlock block={block} />
    case 'sectionIntro':
      return <SectionIntroBlock block={block} />
    case 'verticalsList':
      return <VerticalsListBlock block={block} />
    case 'approachStages':
      return <ApproachStagesBlock block={block} />
    case 'whyPoints':
      return <WhyPointsBlock block={block} />
    case 'callToAction':
      return <CallToActionBlock block={block} />
    case 'contact':
      return <ContactBlock block={block} />
    default:
      return null
  }
}

export function RenderBlocks({ blocks }: { blocks: Page['layout'] }) {
  return (
    <>
      {(blocks ?? []).map((block, i) => (
        <RenderBlock key={block.id ?? i} block={block} />
      ))}
    </>
  )
}
