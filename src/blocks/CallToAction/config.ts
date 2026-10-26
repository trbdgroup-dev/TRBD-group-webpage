import type { Block } from 'payload'

import { linkField } from '@/fields/link'

export const CallToActionBlock: Block = {
  slug: 'callToAction',
  interfaceName: 'CallToActionBlock',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    linkField({ name: 'button' }),
  ],
}
