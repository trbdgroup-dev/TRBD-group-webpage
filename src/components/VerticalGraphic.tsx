import Image from 'next/image'

import type { ImageData } from '@/lib/media'

// Altman-style composition from the approved mockup: the vertical's photo in a
// navy-tinted circle, amber blocks behind it and thin navy connector lines in
// front. Three layouts rotate by row index. Only the photo comes from the CMS.

type Rect = [x: number, y: number, w: number, h: number]
type Layout = { circle: { cx: number; cy: number; r: number }; blocks: Rect[]; lines: string }

const W = 500
const H = 400

export const LAYOUTS: Layout[] = [
  {
    circle: { cx: 310, cy: 210, r: 145 },
    blocks: [
      [40, 70, 95, 95],
      [140, 70, 95, 95],
      [40, 170, 95, 95],
    ],
    lines: 'M87 265 V330 H250 M310 65 V25 H450',
  },
  {
    circle: { cx: 210, cy: 220, r: 155 },
    blocks: [
      [385, 60, 75, 75],
      [385, 145, 75, 75],
      [300, 320, 150, 55],
    ],
    lines: 'M422 220 V320 M50 220 H25 V380 H210',
  },
  {
    circle: { cx: 290, cy: 230, r: 140 },
    blocks: [
      [40, 50, 130, 85],
      [430, 280, 55, 55],
      [430, 215, 55, 55],
    ],
    lines: 'M105 135 V230 H150 M457 335 V380 H330',
  },
]

const pct = (value: number, total: number) => `${(value / total) * 100}%`

export function VerticalGraphic({ image, variant }: { image: ImageData | null; variant: number }) {
  const { circle, blocks, lines } = LAYOUTS[variant % LAYOUTS.length]

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[320px]">
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="absolute inset-0 size-full">
        {blocks.map(([x, y, w, h], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            className={i % 2 ? 'fill-[#f2d7a4]' : 'fill-amber'}
          />
        ))}
      </svg>
      <div
        className="absolute overflow-hidden rounded-full bg-navy"
        style={{
          left: pct(circle.cx - circle.r, W),
          top: pct(circle.cy - circle.r, H),
          width: pct(circle.r * 2, W),
          height: pct(circle.r * 2, H),
        }}
      >
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 900px) 200px, 50vw"
            className="object-cover"
            style={{ objectPosition: image.position }}
          />
        ) : null}
        <span aria-hidden="true" className="absolute inset-0 bg-navy/25" />
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
      >
        <circle
          cx={circle.cx}
          cy={circle.cy}
          r={circle.r}
          className="fill-none stroke-navy"
          strokeWidth={1.5}
        />
        <path d={lines} className="fill-none stroke-navy" strokeWidth={1.5} />
      </svg>
    </div>
  )
}
