import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { safePreviewPath } from '@/lib/preview'

// Leaves draft mode and returns to the published version of the page.
export async function GET(request: NextRequest) {
  ;(await draftMode()).disable()
  redirect(safePreviewPath(request.nextUrl.searchParams.get('path')) ?? '/')
}
