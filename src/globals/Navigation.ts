import type { GlobalConfig } from 'payload'

import { linkField } from '@/fields/link'
import { isStaff } from '@/lib/access'

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
      fields: [linkField({ name: 'link' })],
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
