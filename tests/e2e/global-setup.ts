import { request, type FullConfig } from '@playwright/test'

import { STAFF_STATE } from './helpers'

// Logs the seeded admin in once per run and saves the session for the preview
// tests. Logging in from several workers at the same moment races in Payload
// (only one of the new sessions is kept), which made those tests flaky.
export default async function globalSetup(config: FullConfig) {
  const { SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: password } = process.env
  if (!email || !password) return

  const baseURL = config.projects[0]?.use.baseURL
  const context = await request.newContext({ baseURL })
  const login = await context.post('/api/users/login', { data: { email, password } })
  if (!login.ok()) throw new Error(`Staff login failed with status ${login.status()}`)
  await context.storageState({ path: STAFF_STATE })
  await context.dispose()
}
