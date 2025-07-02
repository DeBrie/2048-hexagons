import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2048 Hexagon',
  description: 'Join tiles with the same number to reach 2048!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
