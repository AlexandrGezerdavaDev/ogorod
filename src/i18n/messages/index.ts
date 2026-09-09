import type { Locale } from "../config"
import { defaultLocale } from "../config"
import { en } from "./en"
import { ru } from "./ru"
import { uk, type Messages } from "./uk"

export type { Messages }

export const messages: Record<Locale, Messages> = {
  uk,
  en,
  ru,
}

export function getMessages(locale: Locale | string | null | undefined): Messages {
  if (locale === "en" || locale === "ru" || locale === "uk") {
    return messages[locale]
  }
  return messages[defaultLocale]
}
