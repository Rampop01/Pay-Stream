import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'ContentStream | Decentralized Content Marketplace on Stacks',
  description: 'Monetize your premium content directly on the Stacks blockchain using Clarity smart contracts and STX royalties.',
  keywords: ['content monetization', 'stacks', 'blockchain', 'creator economy', 'STX', 'payments', 'web3', 'Bitcoin L2'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground noise-overlay`}>
        {children}
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
