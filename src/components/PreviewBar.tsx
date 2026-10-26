'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'

// Loaded only when the bar renders (draft mode), so the live-preview code isn't
// downloaded by ordinary visitors (Phase 5 performance fix).
const RefreshRouteOnSave = dynamic(
  () => import('@payloadcms/live-preview-react').then((mod) => mod.RefreshRouteOnSave),
  { ssr: false },
)

// Shown only in draft mode. Re-renders the page whenever the editor saves in
// the CMS (live preview), and offers a way back to the published site.
export function PreviewBar({ serverURL }: { serverURL: string }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <>
      <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />
      <div
        role="status"
        className="fixed bottom-3 left-3 z-50 flex items-center gap-3 bg-ink px-3 py-2 text-xs text-white shadow-lg"
      >
        <span>Preview: showing unpublished drafts</span>
        <a
          href={`/preview/exit?path=${encodeURIComponent(pathname)}`}
          className="font-semibold text-amber underline-offset-2 hover:underline"
        >
          Exit preview
        </a>
      </div>
    </>
  )
}
