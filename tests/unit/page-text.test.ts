import { describe, expect, it } from 'vitest'

import { lexicalToPlainText, pageDescription, pageImage } from '@/lib/seo/page-text'
import type { Page } from '@/payload-types'

const rich = (...paras: string[]) =>
  ({
    root: {
      children: paras.map((t) => ({ type: 'paragraph', children: [{ type: 'text', text: t }] })),
    },
  }) as never

describe('lexicalToPlainText', () => {
  it('joins paragraphs with spaces', () => {
    expect(lexicalToPlainText(rich('First line.', 'Second line.'))).toBe('First line. Second line.')
    expect(lexicalToPlainText(null)).toBe('')
  })
})

describe('pageDescription', () => {
  it('skips blocks without text and returns the first text found', () => {
    const page = {
      layout: [
        { blockType: 'hero', title: 'T', ctaLabel: 'Go', backgroundImage: 3 },
        { blockType: 'sectionIntro', label: 'L', heading: 'H', text: '' },
        { blockType: 'richText', body: rich('Privacy text.') },
      ],
    } as unknown as Page
    expect(pageDescription(page)).toBe('Privacy text.')
  })

  it('returns null for empty pages', () => {
    expect(pageDescription({ layout: [] })).toBeNull()
  })
})

describe('pageImage', () => {
  it('uses the hero background, else the first image-and-text photo', () => {
    expect(
      pageImage({ layout: [{ blockType: 'hero', backgroundImage: 3 }] } as unknown as Page),
    ).toBe(3)
    expect(pageImage({ layout: [{ blockType: 'imageText', image: 9 }] } as unknown as Page)).toBe(9)
    expect(pageImage({ layout: [] })).toBeNull()
  })
})
