import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2048 Hexagon',
  description: 'Join tiles with the same number to reach 2048!',
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./apple-touch-icon.png",
    other: {
      rel: "icon",
      url: "./favicon.ico",
    },
  }
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
