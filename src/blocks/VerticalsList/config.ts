import type { Block } from 'payload'

import { sectionHeaderFields } from '../shared'

// "What we do": the alternating vertical rows come from Verticals automatically.
export const VerticalsListBlock: Block = {
  slug: 'verticalsList',
  interfaceName: 'VerticalsListBlock',
  labels: { singular: 'Verticals list', plural: 'Verticals lists' },
  fields: sectionHeaderFields(),
}
