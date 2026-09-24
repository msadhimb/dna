import { Geist_Mono } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import ClientProviders from "@/components/ClientProviders"
import { Metadata } from "next"

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const metropolis = localFont({
  src: [
    { path: "../../public/fonts/metropolis/metropolis-300.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/metropolis/metropolis-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/metropolis/metropolis-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/metropolis/metropolis-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/metropolis/metropolis-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
})

const belganAesthetic = localFont({
  src: [{ path: "../../public/fonts/belgan-aesthetic/Belgan Aesthetic.ttf", weight: "400", style: "normal" }],
  variable: "--font-serif",
})

const anturaScript = localFont({
  src: [{ path: "../../public/fonts/antura-script/Antura Script.otf", weight: "400", style: "normal" }],
  variable: "--font-signature",
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
        metropolis.variable,
        belganAesthetic.variable,
        anturaScript.variable
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
