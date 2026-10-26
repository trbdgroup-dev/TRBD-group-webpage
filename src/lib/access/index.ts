import type { Access, FieldAccess, PayloadRequest } from 'payload'

// Staff access rules (ADR-002). Every Payload user is staff: public users sign in
// with Supabase Auth from stage 3 and never get a Payload account.

type MaybeUser = PayloadRequest['user']

export const ROLES = ['super-admin', 'content-editor'] as const
export type Role = (typeof ROLES)[number]

export const isStaffUser = (user: MaybeUser): boolean => Boolean(user)

export const isSuperAdminUser = (user: MaybeUser): boolean =>
  Boolean(user && 'role' in user && user.role === 'super-admin')

/** Any signed-in staff member. */
export const isStaff: Access = ({ req }) => isStaffUser(req.user)

/** Super admins only (user management, creating or deleting verticals). */
export const isSuperAdmin: Access = ({ req }) => isSuperAdminUser(req.user)

/** Super admins see every user; other staff only their own account. */
export const isSuperAdminOrSelf: Access = ({ req }) => {
  if (isSuperAdminUser(req.user)) return true
  if (req.user) return { id: { equals: req.user.id } }
  return false
}

/** Staff see drafts; the public only sees published documents. */
export const publishedOrStaff: Access = ({ req }) => {
  if (isStaffUser(req.user)) return true
  return { _status: { equals: 'published' } }
}

/** Field readable or writable by signed-in staff only (e.g. routing emails). */
export const staffOnlyField: FieldAccess = ({ req }) => isStaffUser(req.user)

/** Field writable by super admins only (e.g. a user's role). */
export const superAdminField: FieldAccess = ({ req }) => isSuperAdminUser(req.user)
