"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { localeLabels, locales, type Locale } from "@/i18n/config"
import { useI18n } from "@/i18n/provider"

export function LocaleSwitcher({
  labelledBy,
}: {
  labelledBy?: string
}) {
  const { locale, setLocale } = useI18n()

  return (
    <ToggleGroup
      value={[locale]}
      onValueChange={(value) => {
        const next = value[0]
        if (next === "uk" || next === "en" || next === "ru") {
          setLocale(next)
        }
      }}
      spacing={2}
      aria-labelledby={labelledBy}
    >
      {locales.map((code: Locale) => (
        <ToggleGroupItem key={code} value={code}>
          {localeLabels[code]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
