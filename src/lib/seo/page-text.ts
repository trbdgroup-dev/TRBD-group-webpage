import type { Media, Page } from '@/payload-types'

// Fallbacks taken from a page's own blocks when its SEO fields are empty.

type Block = NonNullable<Page['layout']>[number]
type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }

/** Plain text of a Lexical value, paragraphs separated by spaces. */
export function lexicalToPlainText(value: { root?: LexicalNode } | null | undefined): string {
  const parts: string[] = []
  const visit = (node: LexicalNode | undefined) => {
    if (!node) return
    if (typeof node.text === 'string') parts.push(node.text)
    node.children?.forEach(visit)
    if (node.children) parts.push(' ')
  }
  visit(value?.root)
  return parts.join('').replace(/\s+/g, ' ').trim()
}

function blockText(block: Block): string {
  switch (block.blockType) {
    case 'sectionIntro':
      return block.text ?? ''
    case 'verticalsList':
    case 'approachStages':
    case 'whyPoints':
      return block.intro ?? ''
    case 'imageText':
      return lexicalToPlainText(block.body)
    case 'richText':
      return lexicalToPlainText(block.body)
    case 'contact':
    case 'callToAction':
      return block.text ?? ''
    default:
      return ''
  }
}

/** First non-empty text in the page's blocks, for the meta description. */
export function pageDescription(page: Pick<Page, 'layout'>): string | null {
  for (const block of page.layout ?? []) {
    const text = blockText(block).trim()
    if (text) return text
  }
  return null
}

/** First image in the page's blocks (hero background, then image-and-text). */
export function pageImage(page: Pick<Page, 'layout'>): Media | number | null {
  for (const block of page.layout ?? []) {
    if (block.blockType === 'hero' && block.backgroundImage) return block.backgroundImage
    if (block.blockType === 'imageText' && block.image) return block.image
  }
  return null
}
