import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { VerticalPage } from '@/components/VerticalPage'
import {
  getPage,
  getVertical,
  listPublishedPageSlugs,
  listPublishedVerticalSlugs,
} from '@/lib/payload'
import { VERTICAL_SLUGS, type VerticalSlug } from '@/lib/slugs'

// Top-level addresses: the five vertical pages (/manpower, /oil-gas, …) and CMS
// pages such as /privacy. Page slugs can never collide with vertical slugs (they
// are reserved in lib/slugs). Published ones are built ahead; anything published
// later is generated on first visit and then cached.

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const [verticals, pages] = await Promise.all([
    listPublishedVerticalSlugs(),
    listPublishedPageSlugs(),
  ])
  return [...verticals, ...pages.filter((slug) => slug !== 'home')].map((slug) => ({ slug }))
}

const isVerticalSlug = (slug: string): slug is VerticalSlug =>
  (VERTICAL_SLUGS as readonly string[]).includes(slug)

export default async function Page({ params }: Props) {
  const { slug } = await params

  if (isVerticalSlug(slug)) {
    const vertical = await getVertical(slug)
    if (!vertical) notFound()
    return <VerticalPage vertical={vertical} />
  }

  // Home lives at "/" only.
  if (slug === 'home') notFound()

  const page = await getPage(slug)
  if (!page) notFound()

  const blocks = page.layout ?? []
  const opensWithHero = blocks[0]?.blockType === 'hero'

  return (
    <>
      {opensWithHero ? null : (
        <header className="bg-white pb-8 pt-16 sm:pt-24">
          <div className="wrap">
            <h1 className="rule max-w-[860px] text-[clamp(34px,4.6vw,56px)] text-navy">
              {page.title}
            </h1>
          </div>
        </header>
      )}
      <RenderBlocks blocks={blocks} />
    </>
  )
}
