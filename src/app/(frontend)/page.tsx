import { HeroBlock } from '@/blocks/Hero/Component'
import { getPage } from '@/lib/payload'

// Home page: the Pages document with slug "home". Only the Hero renders so far;
// the remaining sections arrive with RenderBlocks (C4).
export default async function HomePage() {
  const page = await getPage('home')
  const hero = page?.layout?.find((block) => block.blockType === 'hero')

  if (!hero) {
    return (
      <section className="section">
        <div className="wrap">
          <h1 className="text-[clamp(30px,3.8vw,46px)] text-navy">TRBD Consulting Group</h1>
          <p className="mt-4 text-muted">The home page has not been published yet.</p>
        </div>
      </section>
    )
  }

  return <HeroBlock block={hero} />
}
