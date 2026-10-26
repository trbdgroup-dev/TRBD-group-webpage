import type { Block } from 'payload'

import { anchorField } from '../shared'

// Company details come from Site Settings. Stage 1 shows an "Email us" button;
// the enquiry form replaces it in stage 2.
export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: { singular: 'Contact', plural: 'Contact' },
  fields: [
    { ...anchorField(), defaultValue: 'contact' },
    { name: 'label', type: 'text', defaultValue: 'Contact' },
    { name: 'heading', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', required: true, defaultValue: 'Email us' },
  ],
}
