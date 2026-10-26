// Minimal builders for Payload's Lexical rich text, used by the seed content.

type Node = Record<string, unknown>

const base = { direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 }

const text = (value: string): Node => ({
  type: 'text',
  text: value,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

export const p = (value: string): Node => ({
  ...base,
  type: 'paragraph',
  textFormat: 0,
  textStyle: '',
  children: [text(value)],
})

export const h2 = (value: string): Node => ({
  ...base,
  type: 'heading',
  tag: 'h2',
  children: [text(value)],
})

const list = (tag: 'ul' | 'ol', items: string[]): Node => ({
  ...base,
  type: 'list',
  listType: tag === 'ul' ? 'bullet' : 'number',
  tag,
  start: 1,
  children: items.map((item, i) => ({
    ...base,
    type: 'listitem',
    value: i + 1,
    children: [text(item)],
  })),
})

export const ul = (items: string[]) => list('ul', items)
export const ol = (items: string[]) => list('ol', items)

/** A complete rich text value. Typed loosely so it fits any richText field. */
export const doc = (...children: Node[]) =>
  ({ root: { ...base, type: 'root', children } }) as unknown as {
    root: {
      type: string
      children: { type: string; version: number }[]
      direction: 'ltr'
      format: ''
      indent: number
      version: number
    }
  }
