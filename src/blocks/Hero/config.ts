import type { Block } from 'payload'

// Home hero (ADR-003). The vertical tiles and slides come from Verticals.
export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'label', type: 'text', defaultValue: 'TRBD Consulting Group' },
    { name: 'title', type: 'text', required: true },
    {
      name: 'ctaLabel',
      type: 'text',
      required: true,
      defaultValue: 'Explore our verticals',
      admin: { description: 'Starts the vertical slideshow.' },
    },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
  ],
}
