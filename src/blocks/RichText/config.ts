import type { Block } from 'payload'

// Long-form text, e.g. the privacy notice.
export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: 'Rich text', plural: 'Rich text' },
  fields: [{ name: 'body', type: 'richText', required: true }],
}
