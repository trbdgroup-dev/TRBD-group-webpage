import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'TRBD Consulting Group',
  description:
    'Manpower, Education & Training, Oil & Gas, Green Energy and Global Business consulting.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
