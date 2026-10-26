import { ApproachStagesBlock } from './ApproachStages/config'
import { CallToActionBlock } from './CallToAction/config'
import { ContactBlock } from './Contact/config'
import { HeroBlock } from './Hero/config'
import { ImageTextBlock } from './ImageText/config'
import { RichTextBlock } from './RichText/config'
import { SectionIntroBlock } from './SectionIntro/config'
import { StatsBlock } from './Stats/config'
import { TestimonialsBlock } from './Testimonials/config'
import { VerticalsListBlock } from './VerticalsList/config'
import { WhyPointsBlock } from './WhyPoints/config'

// Block configs for the Pages layout. Components are mapped in RenderBlocks (C4).
export const pageBlocks = [
  HeroBlock,
  SectionIntroBlock,
  VerticalsListBlock,
  ApproachStagesBlock,
  WhyPointsBlock,
  ImageTextBlock,
  StatsBlock,
  TestimonialsBlock,
  CallToActionBlock,
  ContactBlock,
  RichTextBlock,
]
