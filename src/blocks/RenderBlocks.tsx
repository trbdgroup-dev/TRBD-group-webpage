import type { Page } from '@/payload-types'

import { ApproachStagesBlock } from './ApproachStages/Component'
import { CallToActionBlock } from './CallToAction/Component'
import { ContactBlock } from './Contact/Component'
import { HeroBlock } from './Hero/Component'
import { ImageTextBlock } from './ImageText/Component'
import { RichTextBlock } from './RichText/Component'
import { SectionIntroBlock } from './SectionIntro/Component'
import { StatsBlock } from './Stats/Component'
import { TestimonialsBlock } from './Testimonials/Component'
import { VerticalsListBlock } from './VerticalsList/Component'
import { WhyPointsBlock } from './WhyPoints/Component'

type Block = NonNullable<Page['layout']>[number]

// Renders a page's section blocks in order.
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
    case 'imageText':
      return <ImageTextBlock block={block} />
    case 'stats':
      return <StatsBlock block={block} />
    case 'testimonials':
      return <TestimonialsBlock block={block} />
    case 'richText':
      return <RichTextBlock block={block} />
    default: {
      // Every block type must be handled; TypeScript flags a missing case here.
      const unhandled: never = block
      return unhandled
    }
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
