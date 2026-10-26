import type { Block } from 'payload'

import { sectionHeaderFields } from '../shared'

// Icons are a fixed lucide set so editors can't break the design.
export const WHY_ICONS = [
  { label: 'Person', value: 'user-round' },
  { label: 'Shield', value: 'shield-check' },
  { label: 'Briefcase', value: 'briefcase' },
  { label: 'Chart', value: 'chart-column' },
  { label: 'Globe', value: 'globe' },
  { label: 'Document', value: 'file-text' },
  { label: 'Handshake', value: 'handshake' },
  { label: 'Clock', value: 'clock' },
] as const

export const WhyPointsBlock: Block = {
  slug: 'whyPoints',
  interfaceName: 'WhyPointsBlock',
  labels: { singular: 'Why points', plural: 'Why points' },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'points',
      type: 'array',
      minRows: 1,
      maxRows: 9,
      labels: { singular: 'Point', plural: 'Points' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'icon',
              type: 'select',
              required: true,
              defaultValue: 'user-round',
              options: WHY_ICONS.map((icon) => ({ ...icon })),
            },
          ],
        },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
  ],
}
