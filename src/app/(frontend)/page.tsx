import type { Metadata } from 'next'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { JsonLd } from '@/components/JsonLd'
import { env } from '@/lib/env'
import { getPage, getSiteSettings } from '@/lib/payload'
import { websiteJsonLd } from '@/lib/seo/jsonld'
import { buildMetadata } from '@/lib/seo/metadata'
import { pageDescription, pageImage } from '@/lib/seo/page-text'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage('home'), getSiteSettings()])
  return buildMetadata({
    path: '/',
    isHome: true,
    title: page?.title ?? 'Home',
    seo: page?.seo,
    fallbackDescription: page ? pageDescription(page) : null,
    fallbackImage: page ? pageImage(page) : null,
    defaultImage: settings.defaultOgImage,
  })
}

// Home page: the Pages document with slug "home", rendered block by block.
export default async function HomePage() {
  const [page, settings] = await Promise.all([getPage('home'), getSiteSettings()])
  const structuredData = <JsonLd data={websiteJsonLd(settings, env.NEXT_PUBLIC_SITE_URL)} />

  if (!page?.layout?.length) {
    return (
      <section className="section">
        {structuredData}
        <div className="wrap">
          <h1 className="text-[clamp(30px,3.8vw,46px)] text-navy">TRBD Consulting Group</h1>
          <p className="mt-4 text-muted">The home page has not been published yet.</p>
        </div>
      </section>
    )
  }

  return (
    <>
      {structuredData}
      <RenderBlocks blocks={page.layout} />
    </>
  )
}
