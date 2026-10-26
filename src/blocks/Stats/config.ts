import type { Block } from 'payload'

// Available for real figures later; not used at launch (no verified numbers yet).
export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: { singular: 'Stats', plural: 'Stats' },
  fields: [
    { name: 'label', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      admin: { description: 'Only use figures the firm can stand behind.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true, admin: { description: 'e.g. “500+”' } },
            { name: 'label', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
