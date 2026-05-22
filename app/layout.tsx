
/** @description Root application layout and global providers */
import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { PageTransition } from "@/components/PageTransition"

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'PayStream | Decentralized Content Marketplace on Stacks',
  description: 'Monetize your premium content directly on the Stacks blockchain using Clarity smart contracts and STX royalties.',
  keywords: ['content monetization', 'stacks', 'blockchain', 'creator economy', 'STX', 'payments', 'web3', 'Bitcoin L2'],
  authors: [{ name: 'PayStream Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://paystream.app',
    title: 'PayStream | On-Chain Content Economy',
    description: 'Decentralized marketplace for premium content creators on the Stacks L2 network.',
    siteName: 'PayStream',
    images: [
      {
        url: 'https://paystream.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PayStream - Monetize your work directly on Stacks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PayStream | On-Chain Content Economy',
    description: 'Monetize your premium digital work directly on Stacks via Clarity smart contracts.',
    images: ['https://paystream.app/og-image.png'],
    creator: '@PayStreamApp',
  },
  verification: {
    other: {
      'talentapp:project_verification': '12c042959fb5fd3658d6ef9e391035afb5e04be7b1e17a1377beb866f4e37123334b664b4922a25035bbb39b46836256ba66becbec5f03b7235a5625dc066a4f',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground noise-overlay`}>
        <PageTransition>
          {children}
        </PageTransition>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(17, 11, 36, 0.9)',
              border: '1px solid rgba(85, 70, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              color: '#fafafa',
            },
          }}
        />
      </body>
    </html>
  )
}
