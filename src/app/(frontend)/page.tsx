import { RenderBlocks } from '@/blocks/RenderBlocks'
import { getPage } from '@/lib/payload'

// Home page: the Pages document with slug "home", rendered block by block.
export default async function HomePage() {
  const page = await getPage('home')

  if (!page?.layout?.length) {
    return (
      <section className="section">
        <div className="wrap">
          <h1 className="text-[clamp(30px,3.8vw,46px)] text-navy">TRBD Consulting Group</h1>
          <p className="mt-4 text-muted">The home page has not been published yet.</p>
        </div>
      </section>
    )
  }

  return <RenderBlocks blocks={page.layout} />
}
