import { Public_Sans, Source_Serif_4 } from 'next/font/google'

// Self-hosted at build time by next/font: visitors' browsers never call Google.
export const serif = Source_Serif_4({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-source-serif',
})

export const sans = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-public-sans',
})
