import type { GlobalConfig } from 'payload'

import { isStaff } from '@/lib/access'
import { revalidateGlobal } from '@/lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'Settings',
    description:
      'Company details used across the site. Empty contact fields are hidden on the site.',
  },
  access: {
    read: () => true,
    update: isStaff,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'companyName',
                  type: 'text',
                  required: true,
                  defaultValue: 'TRBD Consulting Group',
                },
                {
                  name: 'legalName',
                  type: 'text',
                  required: true,
                  defaultValue: 'TRBD Consulting Group Private Limited',
                },
              ],
            },
            {
              name: 'tagline',
              type: 'text',
              defaultValue: 'People, skills, energy and markets under one roof.',
              admin: { description: 'Shown in the footer.' },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Optional. Without a logo the site shows the navy “TRBD” mark.',
              },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'contactEmail',
                  type: 'email',
                  required: true,
                  defaultValue: 'contact@trbdgroup.com',
                },
                { name: 'phone', type: 'text' },
              ],
            },
            { name: 'officeAddress', type: 'textarea' },
            {
              name: 'workingHours',
              type: 'text',
              admin: { description: 'e.g. “Monday to Saturday, 9:30 am to 6:30 pm IST”.' },
            },
            {
              name: 'socialLinks',
              type: 'array',
              labels: { singular: 'Social link', plural: 'Social links' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'Facebook', value: 'facebook' },
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'X', value: 'x' },
                        { label: 'YouTube', value: 'youtube' },
                      ],
                    },
                    { name: 'url', type: 'text', label: 'URL', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'defaultOgImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Default link preview image',
              admin: { description: 'Used when a page has no image of its own.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'googleVerification',
                  type: 'text',
                  label: 'Google Search Console code',
                  admin: { description: 'Only the code from the meta tag’s content="…".' },
                },
                {
                  name: 'bingVerification',
                  type: 'text',
                  label: 'Bing Webmaster code',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
