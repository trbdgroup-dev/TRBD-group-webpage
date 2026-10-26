import type { Block } from 'payload'

import { anchorField } from '../shared'

// A section header on its own, e.g. "Who we are".
export const SectionIntroBlock: Block = {
  slug: 'sectionIntro',
  interfaceName: 'SectionIntroBlock',
  labels: { singular: 'Section intro', plural: 'Section intros' },
  fields: [
    anchorField(),
    { name: 'label', type: 'text', required: true },
    { name: 'heading', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
  ],
}
