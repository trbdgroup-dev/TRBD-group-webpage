import { Public_Sans, Source_Serif_4 } from 'next/font/google'

// Self-hosted at build time by next/font: visitors' browsers never call Google.
// No optical-size axis: it tripled the font file (120 KB → see .10x QA notes)
// for a refinement the design doesn't depend on.
export const serif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-serif',
})

export const sans = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-public-sans',
})
