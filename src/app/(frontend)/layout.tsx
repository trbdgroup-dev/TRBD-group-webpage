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
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {preview ? <PreviewBar serverURL={env.NEXT_PUBLIC_SITE_URL} /> : null}
      </body>
    </html>
  )
}
