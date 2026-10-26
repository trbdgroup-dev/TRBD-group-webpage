import type { CollectionConfig } from 'payload'

import { seoField } from '@/fields/seo'
import { isStaff, isSuperAdmin, publishedOrStaff, staffOnlyField } from '@/lib/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/lib/revalidate'
import { VERTICAL_SLUGS } from '@/lib/slugs'

export const Verticals: CollectionConfig = {
  slug: 'verticals',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'copyStatus', '_status', 'updatedAt'],
    group: 'Content',
    description:
      'The five verticals. Their pages, the home page tiles and rows, and the footer list all come from here.',
  },
  defaultSort: 'order',
  access: {
    read: publishedOrStaff,
    // The set of verticals is fixed; only super admins add or remove one.
    create: isSuperAdmin,
    update: isStaff,
    delete: isSuperAdmin,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 800 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: { description: 'Short name for tiles and labels, e.g. “Manpower”.' },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: { description: 'Page heading, e.g. “Manpower & Workforce Solutions”.' },
                },
              ],
            },
            {
              name: 'heroHeadline',
              type: 'text',
              required: true,
              admin: { description: 'Headline on this vertical’s home page slide.' },
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              admin: {
                description:
                  'Two or three sentences. Used on the home page, the vertical page intro and search results.',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'whoWeWorkWith',
              type: 'array',
              label: 'Who we work with',
              labels: { singular: 'Client type', plural: 'Client types' },
              fields: [{ name: 'label', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Services',
          fields: [
            {
              name: 'services',
              type: 'array',
              minRows: 1,
              labels: { singular: 'Service', plural: 'Services' },
              admin: { initCollapsed: true },
              fields: [
                { name: 'name', type: 'text', required: true },
                {
                  name: 'summary',
                  type: 'text',
                  required: true,
                  admin: { description: 'One line, shown in lists.' },
                },
                {
                  name: 'description',
                  type: 'richText',
                  admin: {
                    description:
                      'Full description on the vertical page. Falls back to the one-line summary.',
                  },
                },
              ],
            },
            {
              name: 'howWeDeliver',
              type: 'richText',
              label: 'How we deliver',
              admin: { description: 'Optional. The section is hidden when empty.' },
            },
            {
              name: 'faqs',
              type: 'array',
              label: 'Common questions',
              labels: { singular: 'Question', plural: 'Questions' },
              admin: { initCollapsed: true },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [seoField()],
        },
      ],
    },
    {
      name: 'slug',
      type: 'select',
      required: true,
      unique: true,
      index: true,
      options: VERTICAL_SLUGS.map((slug) => ({ value: slug, label: `/${slug}` })),
      admin: {
        position: 'sidebar',
        description: 'Page address. Fixed for each vertical.',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 1,
      admin: { position: 'sidebar', description: 'Sort order on the site (not shown).' },
    },
    {
      name: 'copyStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft-needs-review',
      options: [
        { label: 'Draft – needs review', value: 'draft-needs-review' },
        { label: 'Reviewed', value: 'reviewed' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Set to “Reviewed” once the copy has been checked.',
      },
    },
    {
      name: 'notificationEmail',
      type: 'email',
      label: 'Team inbox',
      access: {
        read: staffOnlyField,
        create: staffOnlyField,
        update: staffOnlyField,
      },
      admin: {
        position: 'sidebar',
        description: 'Enquiries for this vertical go here (from stage 2). Never shown on the site.',
      },
    },
  ],
}
