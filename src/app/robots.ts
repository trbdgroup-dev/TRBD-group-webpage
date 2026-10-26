import type { MetadataRoute } from 'next'

import { env } from '@/lib/env'
import { robotsFor } from '@/lib/seo/indexing'

export default function robots(): MetadataRoute.Robots {
  return robotsFor(env.NEXT_PUBLIC_SITE_URL)
}
