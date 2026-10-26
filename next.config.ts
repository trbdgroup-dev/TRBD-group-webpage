import { withPayload } from '@payloadcms/next/withPayload'
import { withSentryConfig } from '@sentry/nextjs/config'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Media is served straight from the Supabase Storage public bucket (A3). Allow
// next/image to optimise from that host only. Local Supabase runs on 127.0.0.1,
// which Next.js 16 blocks by default, so local IPs are allowed only in that case.
const mediaUrl = process.env.S3_PUBLIC_URL ? new URL(process.env.S3_PUBLIC_URL) : null
const mediaIsLocal = mediaUrl ? ['127.0.0.1', 'localhost'].includes(mediaUrl.hostname) : false

const nextConfig: NextConfig = {
  // No "X-Powered-By: Next.js, Payload" banner (Payload's wrapper honours this too).
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Disk storage (STORAGE_DRIVER=local) serves files through Payload's API.
    localPatterns: [{ pathname: '/api/media/file/**' }],
    remotePatterns: mediaUrl
      ? [
          {
            protocol: mediaUrl.protocol.replace(':', '') as 'http' | 'https',
            hostname: mediaUrl.hostname,
            port: mediaUrl.port,
            pathname: `${mediaUrl.pathname}/**`,
          },
        ]
      : [],
    dangerouslyAllowLocalIP: mediaIsLocal,
  },
  async headers() {
    // Security headers on every response (Phase 5). The CSP restricts framing,
    // plugins, <base> and form targets; scripts and styles are not restricted
    // because static pages and Payload's admin rely on inline bootstraps.
    const security = [
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
      },
      {
        key: 'Content-Security-Policy',
        value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'",
      },
    ]
    // Belt and braces with robots.ts: anything other than the production deploy
    // (local, Vercel previews) tells crawlers not to index it.
    const noindex =
      process.env.VERCEL_ENV === 'production'
        ? []
        : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
    return [{ source: '/:path*', headers: [...security, ...noindex] }]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

// Sentry (F3): uploads source maps only when SENTRY_AUTH_TOKEN, SENTRY_ORG and
// SENTRY_PROJECT are set (on Vercel); otherwise it only wires error reporting.
export default withSentryConfig(withPayload(nextConfig, { devBundleServerPackages: false }), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  telemetry: false,
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
})
