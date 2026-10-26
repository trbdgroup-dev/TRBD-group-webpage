import Image from 'next/image'

import { RichText } from '@/components/RichText'
import { Label } from '@/components/ui'
import { toImage } from '@/lib/media'
import type { ImageTextBlock as Data } from '@/payload-types'

// A photo beside a heading and rich text; editors choose the image side.
export function ImageTextBlock({ block }: { block: Data }) {
  const image = toImage(block.image)
  const imageLeft = block.imageSide === 'left'

  return (
    <section id={block.anchor ?? undefined} className="section bg-white">
      <div className="wrap grid items-center gap-8 nav:grid-cols-2 nav:gap-16">
        <div className={imageLeft ? 'nav:order-2' : ''}>
          {block.label ? <Label>{block.label}</Label> : null}
          <h2 className="mt-3 text-[clamp(28px,3.4vw,40px)] text-navy">{block.heading}</h2>
          <RichText data={block.body} className="mt-5 text-muted" />
        </div>
        {image ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 900px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: image.position }}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
