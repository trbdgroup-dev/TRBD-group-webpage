import config from '@payload-config'
import { getPayload } from 'payload'

// Creates the first super admin from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD.
// Local development only; idempotent. Run with `npm run seed:admin`.
// The full content seed (task E3) reuses this.
export async function createAdmin(): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) {
    throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env (see .env.example).')
  }

  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    const [user] = existing.docs
    if (user.role !== 'super-admin') {
      await payload.update({ collection: 'users', id: user.id, data: { role: 'super-admin' } })
      payload.logger.info(`Admin ${email} exists; role set to super admin.`)
    } else {
      payload.logger.info(`Admin ${email} already exists, skipping.`)
    }
    return
  }

  await payload.create({
    collection: 'users',
    data: { email, password, name: 'Site admin', role: 'super-admin' },
  })
  payload.logger.info(`Created admin ${email}.`)
}

await createAdmin()
process.exit(0)
