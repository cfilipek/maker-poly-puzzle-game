import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Nunito, Press_Start_2P } from 'next/font/google'
import './globals.css'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
const pressStart = Press_Start_2P({ subsets: ['latin'], weight: '400', variable: '--font-press-start' })

export const metadata: Metadata = {
  title: 'Poly-Puzzle | An Urban Ag Farm Card Game',
  description:
    'Plant crop cards on your Poly-Plot, chain combo effects, and survive surprise seasonal events in this pixel farm strategy game.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        type: 'image/svg+xml',
      },
    ],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#7fb449',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${pressStart.variable} bg-background`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
