export const locales = ["uk", "en", "ru"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "uk"

export const localeCookie = "ogorod.locale"

export const localeLabels: Record<Locale, string> = {
  uk: "Українська",
  en: "English",
  ru: "Русский",
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "uk" || value === "en" || value === "ru"
}

export function parseLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : defaultLocale
}

export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) {
    return defaultLocale
  }

  const tags = header
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter((tag): tag is string => Boolean(tag))

  for (const tag of tags) {
    if (tag === "uk" || tag.startsWith("uk-")) {
      return "uk"
    }
    if (tag === "ru" || tag.startsWith("ru-")) {
      return "ru"
    }
    if (tag === "en" || tag.startsWith("en-")) {
      return "en"
    }
  }

  return defaultLocale
}
