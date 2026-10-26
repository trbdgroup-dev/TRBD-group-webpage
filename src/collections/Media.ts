import type { CollectionConfig } from 'payload'

import { isStaff } from '@/lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'credit', 'updatedAt'],
    group: 'Content',
    description:
      'Site images. Alt text is required. Stock photos keep their credit and source until the firm replaces them.',
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    // Pages use next/image on the original; these sizes cover admin previews,
    // cards and link previews (og is cropped around the focal point).
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 960 },
      { name: 'hero', width: 2000 },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe what the image shows for people using screen readers, e.g. "Rows of solar panels on a green field".',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'credit',
          type: 'text',
          admin: {
            description: 'e.g. "Jane Doe on Unsplash". Leave empty for the firm’s own photos.',
          },
        },
        {
          name: 'sourceUrl',
          type: 'text',
          label: 'Source URL',
        },
      ],
    },
  ],
}
