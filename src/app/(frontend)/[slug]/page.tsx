import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { listPublishedPageSlugs, getPage } from '@/lib/payload'
import { VERTICAL_SLUGS, type VerticalSlug } from '@/lib/slugs'

// Top-level pages: the privacy notice and any future CMS page. Vertical pages
// share this address space and are added in C6. Published pages are built
// ahead; pages published later are generated on first visit and then cached.

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await listPublishedPageSlugs()
  return slugs.filter((slug) => slug !== 'home').map((slug) => ({ slug }))
}

const isVerticalSlug = (slug: string): slug is VerticalSlug =>
  (VERTICAL_SLUGS as readonly string[]).includes(slug)

export default async function Page({ params }: Props) {
  const { slug } = await params

  // Home lives at "/" only; verticals are handled in C6.
  if (slug === 'home' || isVerticalSlug(slug)) notFound()

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
