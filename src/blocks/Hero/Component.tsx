import { HeroSlideshow, type HeroSlide } from '@/components/HeroSlideshow'
import { toImage } from '@/lib/media'
import { getVerticals } from '@/lib/payload'
import type { HeroBlock as HeroBlockData } from '@/payload-types'

// Server side of the home hero: the intro comes from the block, the slides from
// Verticals (in their CMS order), so tiles and slides never need entering twice.
export async function HeroBlock({ block }: { block: HeroBlockData }) {
  const verticals = await getVerticals()

  const slides: HeroSlide[] = verticals.map((vertical) => ({
    name: vertical.name,
    headline: vertical.heroHeadline,
    summary: vertical.summary,
    href: `/${vertical.slug}`,
    image: toImage(vertical.heroImage),
  }))

  return (
    <HeroSlideshow
      label={block.label ?? ''}
      title={block.title}
      ctaLabel={block.ctaLabel}
      image={toImage(block.backgroundImage)}
      slides={slides}
    />
  )
}
