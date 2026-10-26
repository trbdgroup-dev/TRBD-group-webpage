import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

import { SITE_NAME } from '@/lib/seo/metadata'

// Fallback link-preview image (1200×630) for pages without a photo of their own:
// the page title on the brand's navy with the amber accent. lib/seo/metadata
// points here only when no CMS image is available.

const MAX_TITLE = 110

export function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('title') ?? SITE_NAME
  const title = raw.length > MAX_TITLE ? `${raw.slice(0, MAX_TITLE - 1).trimEnd()}…` : raw

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: '#12263a',
        color: '#ffffff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            color: '#12263a',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          TRBD
        </div>
        <div
          style={{ fontSize: 28, color: '#d99a2b', letterSpacing: 4, textTransform: 'uppercase' }}
        >
          {SITE_NAME}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          borderTop: '3px solid #d99a2b',
          paddingTop: 36,
          fontSize: title.length > 60 ? 56 : 72,
          lineHeight: 1.12,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable' },
    },
  )
}
