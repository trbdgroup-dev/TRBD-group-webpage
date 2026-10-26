import type { GlobalConfig } from 'payload'

import { linkField } from '@/fields/link'
import { isStaff } from '@/lib/access'
import { revalidateGlobal } from '@/lib/revalidate'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Settings',
    description:
      'Header and footer links. The footer’s vertical list comes from Verticals automatically.',
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
      name: 'headerLinks',
      type: 'array',
      maxRows: 6,
      labels: { singular: 'Header link', plural: 'Header links' },
      fields: [linkField()],
    },
    {
      name: 'headerCta',
      type: 'group',
      label: 'Header button',
      admin: {
        description: 'Optional. Leave empty to show “Contact us” linking to the contact section.',
      },
      fields: [linkField({ name: 'link', required: false })],
    },
    {
      name: 'footerLinks',
      type: 'array',
      maxRows: 8,
      labels: { singular: 'Footer link', plural: 'Footer links' },
      admin: { description: 'Shown under “Company” in the footer.' },
      fields: [linkField()],
    },
  ],
}
