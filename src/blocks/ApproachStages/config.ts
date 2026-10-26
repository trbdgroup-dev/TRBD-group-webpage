import type { Block } from 'payload'

import { sectionHeaderFields } from '../shared'

export const ApproachStagesBlock: Block = {
  slug: 'approachStages',
  interfaceName: 'ApproachStagesBlock',
  labels: { singular: 'Approach stages', plural: 'Approach stages' },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'stages',
      type: 'array',
      minRows: 3,
      maxRows: 6,
      labels: { singular: 'Stage', plural: 'Stages' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
  ],
}
