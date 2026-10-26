import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { VerticalPage } from '@/components/VerticalPage'
import {
  getPage,
  getSiteSettings,
  getVertical,
  listPublishedPageSlugs,
  listPublishedVerticalSlugs,
} from '@/lib/payload'
import { buildMetadata } from '@/lib/seo/metadata'
import { pageDescription, pageImage } from '@/lib/seo/page-text'
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const settings = await getSiteSettings()

  if (isVerticalSlug(slug)) {
    const vertical = await getVertical(slug)
    if (!vertical) return {}
    return buildMetadata({
      path: `/${slug}`,
      title: vertical.title,
      seo: vertical.seo,
      fallbackDescription: vertical.summary,
      fallbackImage: vertical.heroImage,
      defaultImage: settings.defaultOgImage,
    })
  }

  if (slug === 'home') return {}
  const page = await getPage(slug)
  if (!page) return {}
  return buildMetadata({
    path: `/${slug}`,
    title: page.title,
    seo: page.seo,
    fallbackDescription: pageDescription(page),
    fallbackImage: pageImage(page),
    defaultImage: settings.defaultOgImage,
  })
}

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
