import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const kanit = Kanit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
});

export const viewport = {
  themeColor: "#222552",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Biggs Loyalty",
  description: "Join the Bigg's loyalty program and enjoy exclusive benefits, rewards, and special offers",
  
  icons: {
    icon: [
      {
        url: '/front.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/front.svg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/front.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/front.svg" />
      </head>
      <body className={`${kanit.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
