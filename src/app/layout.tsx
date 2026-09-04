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
  title: "Devi & Adhim",
  description: "Wedding Invitation",
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
        <ThemeProvider>
          <ClientProviders>{children}</ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
