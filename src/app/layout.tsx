import type { Metadata, Viewport } from "next"
import { Geist_Mono, Manrope } from "next/font/google"

import { Providers } from "@/components/providers"
import { getRequestLocale } from "@/i18n/server"
import { getMessages } from "@/i18n/messages"
import "./globals.css"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const messages = getMessages(locale)
  return {
    title: {
      default: "OGOROD",
      template: "%s · OGOROD",
    },
    description: messages.meta.description,
    applicationName: "OGOROD",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "OGOROD",
    },
    formatDetection: {
      telephone: false,
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3f6b45" },
    { media: "(prefers-color-scheme: dark)", color: "#1c2b1e" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getRequestLocale()

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  )
}
