import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { env } from '@/lib/env'
import { getPayloadClient } from '@/lib/payload'
import { safePreviewPath } from '@/lib/preview'

// Enables draft mode for signed-in staff, then shows the requested page (B6).
// Needs both the preview secret (from the admin's preview links) and a valid
// staff session, so a leaked link alone never exposes drafts.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const path = safePreviewPath(params.get('path'))

  if (params.get('secret') !== env.PREVIEW_SECRET || !path) {
    return new Response('Invalid preview link.', { status: 401 })
  }

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) {
    return new Response('Sign in to the CMS to preview drafts.', { status: 403 })
  }

  ;(await draftMode()).enable()
  redirect(path)
}
