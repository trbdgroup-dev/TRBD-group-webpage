import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { isStaffUser, isSuperAdmin, isSuperAdminOrSelf, ROLES, superAdminField } from '@/lib/access'

// The very first account (created from the /cms welcome screen) must be a super
// admin, otherwise nobody could ever manage users.
const firstUserIsSuperAdmin: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data
  const { totalDocs } = await req.payload.count({ collection: 'users', req })
  return totalDocs === 0 ? { ...data, role: 'super-admin' } : data
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Admin',
  },
  auth: true,
  access: {
    admin: ({ req }) => isStaffUser(req.user),
    read: isSuperAdminOrSelf,
    create: isSuperAdmin,
    update: isSuperAdminOrSelf,
    delete: isSuperAdmin,
  },
  hooks: {
    beforeChange: [firstUserIsSuperAdmin],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'content-editor',
      saveToJWT: true,
      options: ROLES.map((role) => ({
        value: role,
        label: role === 'super-admin' ? 'Super admin' : 'Content editor',
      })),
      access: {
        create: superAdminField,
        update: superAdminField,
      },
      admin: {
        description:
          'Super admins manage users and settings. Content editors edit and publish content.',
      },
    },
  ],
}
