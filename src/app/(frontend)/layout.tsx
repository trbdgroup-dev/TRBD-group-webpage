import type { Metadata } from 'next'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PreviewBar } from '@/components/PreviewBar'
import { env } from '@/lib/env'
import { isPreview } from '@/lib/payload'

import { sans, serif } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'TRBD Consulting Group',
  description:
    'Manpower, Education & Training, Oil & Gas, Green Energy and Global Business consulting.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const preview = await isPreview()

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
        {preview ? <PreviewBar serverURL={env.NEXT_PUBLIC_SITE_URL} /> : null}
      </body>
    </html>
  )
}
