import type { Access, FieldAccess } from 'payload'
import { describe, expect, it } from 'vitest'

import {
  isStaff,
  isSuperAdmin,
  isSuperAdminOrSelf,
  publishedOrStaff,
  staffOnlyField,
  superAdminField,
} from '@/lib/access'

type User = { id: number; role: 'super-admin' | 'content-editor'; collection: 'users' }

const superAdmin: User = { id: 1, role: 'super-admin', collection: 'users' }
const editor: User = { id: 2, role: 'content-editor', collection: 'users' }

// The rules only read req.user, so a minimal request is enough.
const run = (rule: Access, user: User | null) =>
  rule({ req: { user } } as unknown as Parameters<Access>[0])
const runField = (rule: FieldAccess, user: User | null) =>
  rule({ req: { user } } as unknown as Parameters<FieldAccess>[0])

describe('collection access', () => {
  it('isStaff allows any signed-in user and blocks the public', () => {
    expect(run(isStaff, superAdmin)).toBe(true)
    expect(run(isStaff, editor)).toBe(true)
    expect(run(isStaff, null)).toBe(false)
  })

  it('isSuperAdmin allows only super admins', () => {
    expect(run(isSuperAdmin, superAdmin)).toBe(true)
    expect(run(isSuperAdmin, editor)).toBe(false)
    expect(run(isSuperAdmin, null)).toBe(false)
  })

  it('isSuperAdminOrSelf limits editors to their own account', () => {
    expect(run(isSuperAdminOrSelf, superAdmin)).toBe(true)
    expect(run(isSuperAdminOrSelf, editor)).toEqual({ id: { equals: 2 } })
    expect(run(isSuperAdminOrSelf, null)).toBe(false)
  })

  it('publishedOrStaff shows drafts to staff and only published docs to the public', () => {
    expect(run(publishedOrStaff, editor)).toBe(true)
    expect(run(publishedOrStaff, null)).toEqual({ _status: { equals: 'published' } })
  })
})

describe('field access', () => {
  it('staffOnlyField hides a field from the public', () => {
    expect(runField(staffOnlyField, editor)).toBe(true)
    expect(runField(staffOnlyField, null)).toBe(false)
  })

  it('superAdminField lets only super admins change it', () => {
    expect(runField(superAdminField, superAdmin)).toBe(true)
    expect(runField(superAdminField, editor)).toBe(false)
    expect(runField(superAdminField, null)).toBe(false)
  })
})
