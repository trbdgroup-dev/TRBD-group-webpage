import { describe, expect, it } from 'vitest'

import { toImage } from '@/lib/media'
import type { Media } from '@/payload-types'

const media = (over: Partial<Media> = {}): Media =>
  ({
    id: 1,
    alt: 'Solar panels',
    url: 'http://127.0.0.1:54321/storage/v1/object/public/media/solar.jpg',
    width: 2400,
    height: 1600,
    focalX: 30,
    focalY: 70,
    updatedAt: '',
    createdAt: '',
    ...over,
  }) as Media

describe('toImage', () => {
  it('maps a populated upload, using the focal point for positioning', () => {
    expect(toImage(media())).toEqual({
      src: 'http://127.0.0.1:54321/storage/v1/object/public/media/solar.jpg',
      alt: 'Solar panels',
      width: 2400,
      height: 1600,
      position: '30% 70%',
    })
  })

  it('centres images without a focal point', () => {
    expect(toImage(media({ focalX: null, focalY: null }))?.position).toBe('50% 50%')
  })

  it('returns null for unpopulated or missing uploads', () => {
    expect(toImage(7)).toBeNull()
    expect(toImage(null)).toBeNull()
    expect(toImage(media({ url: null }))).toBeNull()
  })
})
