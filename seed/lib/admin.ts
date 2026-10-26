import type { Payload } from 'payload'

// First super admin from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (local only).
// Idempotent: an existing account is upgraded to super admin, never recreated.
export async function ensureAdmin(payload: Payload): Promise<string> {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) {
    throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env (see .env.example).')
  }

  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  const existing = docs[0]

  if (!existing) {
    await payload.create({
      collection: 'users',
      data: { email, password, name: 'Site admin', role: 'super-admin' },
    })
    return `created admin ${email}`
  }
  if (existing.role !== 'super-admin') {
    await payload.update({ collection: 'users', id: existing.id, data: { role: 'super-admin' } })
    return `admin ${email} set to super admin`
  }
  return `admin ${email} already exists`
}
