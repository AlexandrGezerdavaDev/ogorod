import type { Locale } from "@/i18n/config"
import { catalogCommonName, catalogCultivarName } from "@/i18n/format"

export const speciesCategories = ["vegetable", "herb", "berry"] as const

export type SpeciesCategory = (typeof speciesCategories)[number]

export type CatalogCultivar = {
  id: string
  name: string
}

export type CatalogSpecies = {
  id: string
  scientificName: string
  commonNameUk: string
  commonNameEn?: string | null
  category: SpeciesCategory
  cultivars: CatalogCultivar[]
}

export function isSpeciesCategory(
  value: string | null | undefined
): value is SpeciesCategory {
  return value === "vegetable" || value === "herb" || value === "berry"
}

export function parseSpeciesCategory(
  value: string | null | undefined
): SpeciesCategory {
  return isSpeciesCategory(value) ? value : "vegetable"
}

function matchesQuery(
  locale: Locale,
  item: CatalogSpecies,
  query: string
) {
  if (!query) {
    return true
  }

  const haystack = [
    item.scientificName,
    item.commonNameUk,
    item.commonNameEn ?? "",
    catalogCommonName(locale, item),
    ...item.cultivars.flatMap((cultivar) => [
      cultivar.name,
      catalogCultivarName(locale, cultivar.name),
    ]),
  ]

  return haystack.some((value) => value.toLowerCase().includes(query))
}

export function filterCatalog(
  items: CatalogSpecies[],
  query: string,
  categories: readonly SpeciesCategory[],
  locale: Locale
) {
  const normalized = query.trim().toLowerCase()
  return items.filter((item) => {
    if (categories.length > 0 && !categories.includes(item.category)) {
      return false
    }
    return matchesQuery(locale, item, normalized)
  })
}
