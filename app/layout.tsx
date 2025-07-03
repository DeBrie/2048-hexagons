import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "2048 Hexagon - Puzzle Game",
  description:
    "A hexagonal twist on the classic 2048 puzzle game. Swipe in 6 directions to combine tiles and reach 2048!",
  keywords: ["2048", "hexagon", "puzzle", "game", "mobile", "web game"],
  authors: [{ name: "2048 Hexagon Team" }],
  creator: "2048 Hexagon",
  publisher: "2048 Hexagon",
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "2048 Hexagon",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "2048 Hexagon",
  },
  openGraph: {
    title: "2048 Hexagon - Puzzle Game",
    description:
      "A hexagonal twist on the classic 2048 puzzle game. Swipe in 6 directions to combine tiles and reach 2048!",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '2048 Hexagon - Puzzle Game'
      }
    ]
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#f97316",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="touch-none">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${inter.className} touch-none overscroll-none`}
        style={{
          overscrollBehavior: "none",
          touchAction: "pan-x pan-y",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      >
        {children}
      </body>
    </html>
  )
}
