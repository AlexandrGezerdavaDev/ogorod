"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
  localeCookie,
  parseLocale,
  type Locale,
} from "./config"
import { getMessages, type Messages } from "./messages"

type LocaleContextValue = {
  locale: Locale
  messages: Messages
  setLocale: (locale: Locale) => void
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null)

function persistLocale(locale: Locale) {
  document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; SameSite=Lax`
  document.documentElement.lang = locale
  try {
    localStorage.setItem(localeCookie, locale)
  } catch {
    // ignore quota / private mode
  }
}

export function LocaleProvider({
  locale: initialLocale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const router = useRouter()
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale)

  React.useEffect(() => {
    setLocaleState(initialLocale)
    document.documentElement.lang = initialLocale
  }, [initialLocale])

  const setLocale = React.useCallback(
    (next: Locale) => {
      const locale = parseLocale(next)
      setLocaleState(locale)
      persistLocale(locale)
      router.refresh()
    },
    [router]
  )

  const value = React.useMemo(
    () => ({
      locale,
      messages: getMessages(locale),
      setLocale,
    }),
    [locale, setLocale]
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useI18n() {
  const context = React.useContext(LocaleContext)
  if (!context) {
    throw new Error("useI18n must be used within LocaleProvider")
  }
  return context
}
