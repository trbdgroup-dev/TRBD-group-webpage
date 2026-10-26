import type { Block } from 'payload'

import { anchorField } from '../shared'

export const ImageTextBlock: Block = {
  slug: 'imageText',
  interfaceName: 'ImageTextBlock',
  labels: { singular: 'Image and text', plural: 'Image and text' },
  fields: [
    anchorField(),
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'imageSide',
      type: 'radio',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    { name: 'label', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'richText', required: true },
  ],
}
