import type { Block } from 'payload'

// Available for real client quotes later; not used at launch.
export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    { name: 'label', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      admin: { description: 'Only publish quotes the client has approved.' },
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'role', type: 'text' },
            { name: 'company', type: 'text' },
          ],
        },
      ],
    },
  ],
}
