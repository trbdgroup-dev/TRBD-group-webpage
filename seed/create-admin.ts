import config from '@payload-config'
import { getPayload } from 'payload'

import { ensureAdmin } from './lib/admin'

// `npm run seed:admin`: only the first super admin. The full seed (`npm run seed`) also does this.
const payload = await getPayload({ config })
payload.logger.info(await ensureAdmin(payload))
process.exit(0)
