"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import * as React from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { PwaRegister } from "@/components/pwa-register"
import { LocaleProvider } from "@/i18n/provider"
import { PreferencesProvider } from "@/features/settings/provider"
import type { Locale } from "@/i18n/config"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
      },
    },
  })
}

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: Locale
}) {
  const [queryClient] = React.useState(makeQueryClient)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LocaleProvider locale={locale}>
        <PreferencesProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              {children}
              <Toaster />
              <PwaRegister />
            </TooltipProvider>
          </QueryClientProvider>
        </PreferencesProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}
