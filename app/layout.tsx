import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'UK Salary Calculator - Calculate Your Take-Home Pay After Tax',
    template: '%s | UK Salary Calculator',
  },
  description:
    'Calculate your take-home pay after tax and National Insurance for UK and Scotland. Free salary calculator with detailed tax breakdown, hourly rates, and tax band information.',
  metadataBase: new URL('https://salaryukcalculator.vercel.app'),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: 'UK Salary Calculator',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  // TODO: Replace with actual Google Search Console verification code
  // verification: { google: 'YOUR_GOOGLE_VERIFICATION_CODE' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-navy">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
