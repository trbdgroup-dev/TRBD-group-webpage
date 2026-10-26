import type { Field } from 'payload'

// Shared SEO group for Pages and Verticals. Empty fields fall back to the page's
// title, summary and hero image (spec §4; builder in lib/seo, task D1).
export const seoField = (): Field => ({
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: {
    description: 'Optional. Leave empty to use the page title, summary and main image.',
  },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      maxLength: 70,
      admin: { description: 'Shown in search results and browser tabs. About 50–60 characters.' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      maxLength: 160,
      admin: { description: 'Shown under the title in search results. About 120–155 characters.' },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Link preview image',
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: 'Hide from search engines',
      defaultValue: false,
    },
  ],
})
