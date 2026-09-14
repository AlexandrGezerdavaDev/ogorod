import { differenceInDays, differenceInMonths, differenceInYears, formatDistanceToNow } from "date-fns"
import { enUS, ru, uk } from "date-fns/locale"
import { enUS as dayPickerEn, ru as dayPickerRu, uk as dayPickerUk } from "react-day-picker/locale"

import type { Locale } from "./config"
import type { Messages } from "./messages"
import { getMessages } from "./messages"

export function interpolate(
  template: string,
  vars?: Record<string, string | number>
) {
  if (!vars) {
    return template
  }
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] === undefined ? `{${key}}` : String(vars[key])
  )
}

export function formatRelativePast(locale: Locale, date: Date) {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: dateFnsLocale(locale),
  })
}

export function dateFnsLocale(locale: Locale) {
  if (locale === "en") {
    return enUS
  }
  if (locale === "ru") {
    return ru
  }
  return uk
}

export function dayPickerLocale(locale: Locale) {
  if (locale === "en") {
    return dayPickerEn
  }
  if (locale === "ru") {
    return dayPickerRu
  }
  return dayPickerUk
}

function slavicPlural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) {
    return one
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few
  }
  return many
}

export function formatYears(locale: Locale, years: number) {
  if (locale === "en") {
    return years === 1 ? "1 year" : `${years} years`
  }
  if (locale === "ru") {
    return `${years} ${slavicPlural(years, "год", "года", "лет")}`
  }
  return `${years} ${slavicPlural(years, "рік", "роки", "років")}`
}

export function formatDays(locale: Locale, days: number) {
  if (locale === "en") {
    return days === 1 ? "1 day" : `${days} days`
  }
  if (locale === "ru") {
    return `${days} ${slavicPlural(days, "день", "дня", "дней")}`
  }
  return `${days} ${slavicPlural(days, "день", "дні", "днів")}`
}

export function formatMonths(locale: Locale, months: number) {
  if (locale === "en") {
    return months === 1 ? "1 month" : `${months} months`
  }
  if (locale === "ru") {
    return `${months} ${slavicPlural(months, "месяц", "месяца", "месяцев")}`
  }
  return `${months} ${slavicPlural(months, "місяць", "місяці", "місяців")}`
}

export function formatPlantAge(locale: Locale, planted: Date, now = new Date()) {
  const days = Math.max(0, differenceInDays(now, planted))
  if (days < 1) {
    return null
  }
  if (days < 30) {
    return formatDays(locale, days)
  }
  const months = differenceInMonths(now, planted)
  if (months < 12) {
    return formatMonths(locale, Math.max(1, months))
  }
  return formatYears(locale, Math.max(1, differenceInYears(now, planted)))
}

export function seedUnitLabel(m: Messages, unit: string) {
  if (unit === "г" || unit === "g") {
    return m.seeds.unitG
  }
  return m.seeds.unitPcs
}

export function formatSeedQuantityLabel(
  m: Messages,
  quantity: number,
  unit: string
) {
  return `${quantity} ${seedUnitLabel(m, unit)}`
}

export function catalogCommonName(
  locale: Locale,
  names: { commonNameUk: string; commonNameEn?: string | null }
) {
  if (locale === "en") {
    return names.commonNameEn || names.commonNameUk
  }
  if (locale === "ru") {
    if (names.commonNameUk === "Помідор") {
      return getMessages("ru").demo.tomato
    }
    return names.commonNameUk
  }
  return names.commonNameUk
}

export function catalogCultivarName(locale: Locale, name: string) {
  if (name === "Бичаче серце") {
    return getMessages(locale).demo.oxheart
  }
  return name
}
