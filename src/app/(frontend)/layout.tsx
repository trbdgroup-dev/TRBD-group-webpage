import type { Metadata } from 'next'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

import { sans, serif } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'TRBD Consulting Group',
  description:
    'Manpower, Education & Training, Oil & Gas, Green Energy and Global Business consulting.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
