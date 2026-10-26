import type { Metadata } from 'next'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { PreviewBar } from '@/components/PreviewBar'
import { env } from '@/lib/env'
import { getSiteSettings, isPreview } from '@/lib/payload'
import { organizationJsonLd } from '@/lib/seo/jsonld'
import { HOME_TITLE, SITE_NAME, TITLE_TEMPLATE } from '@/lib/seo/metadata'

import { sans, serif } from './fonts'
import './globals.css'

// Site-wide defaults; each page's generateMetadata fills in its own title,
// description, canonical URL and link-preview image (lib/seo).
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const verification = {
    ...(settings.googleVerification ? { google: settings.googleVerification } : {}),
    ...(settings.bingVerification ? { other: { 'msvalidate.01': settings.bingVerification } } : {}),
  }

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: { default: HOME_TITLE, template: TITLE_TEMPLATE },
    applicationName: SITE_NAME,
    ...(Object.keys(verification).length ? { verification } : {}),
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [preview, settings] = await Promise.all([isPreview(), getSiteSettings()])

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-navy focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <JsonLd data={organizationJsonLd(settings, env.NEXT_PUBLIC_SITE_URL)} />
        {preview ? <PreviewBar serverURL={env.NEXT_PUBLIC_SITE_URL} /> : null}
      </body>
    </html>
  )
}
