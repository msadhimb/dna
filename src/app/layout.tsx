import {
  Geist,
  Geist_Mono,
  Cormorant_Garamond,
  Alex_Brush,
} from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import ClientProviders from "@/components/ClientProviders"
import { Metadata } from "next"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
})

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  variable: "--font-signature",
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "Devi & Adhim — Wedding Invitation 12·12·2026",
  description: "Undangan pernikahan Devi & Adhim — 12 Desember 2026. Mohon doa restu dan kehadiran Anda.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"),
  openGraph: {
    title: "Devi & Adhim — Wedding Invitation",
    description: "Undangan pernikahan Devi & Adhim — 12 Desember 2026",
    type: "website",
    locale: "id_ID",
  },
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
        cormorant.variable,
        alexBrush.variable
      )}
    >
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Lewati ke konten utama
        </a>
        <ThemeProvider>
          <ClientProviders>{children}</ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
