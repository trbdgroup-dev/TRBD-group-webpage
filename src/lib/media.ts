import type { Media } from '@/payload-types'

// Turns a CMS upload into what next/image needs. Relations may be unpopulated
// (a bare id), in which case there is no image to show.

export type ImageData = {
  src: string
  alt: string
  width?: number
  height?: number
  /** CSS object-position from the editor's focal point, e.g. "30% 60%". */
  position: string
}

export function toImage(media: Media | number | string | null | undefined): ImageData | null {
  if (!media || typeof media !== 'object' || !media.url) return null
  const x = media.focalX ?? 50
  const y = media.focalY ?? 50
  return {
    src: media.url,
    alt: media.alt ?? '',
    width: media.width ?? undefined,
    height: media.height ?? undefined,
    position: `${x}% ${y}%`,
  }
}
