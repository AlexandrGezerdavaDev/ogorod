import type { Locale } from "@/i18n/config"
import { catalogCommonName, catalogCultivarName } from "@/i18n/format"

/** Catalog filter uses agricultural_use classification values (legacy category ids). */
export const agriculturalUseFilters = [
  "vegetable",
  "herb",
  "berry",
  "cereal",
  "legume",
  "oilseed",
] as const

export type AgriculturalUseFilter = (typeof agriculturalUseFilters)[number]

/** @deprecated Use AgriculturalUseFilter — kept for gradual UI rename */
export type SpeciesCategory = AgriculturalUseFilter
export const speciesCategories = agriculturalUseFilters

export type CatalogCultivar = {
  id: string
  name: string
}

export type CatalogSpecies = {
  id: string
  scientificName: string
  commonNameUk: string
  commonNameEn?: string | null
  /** Primary agricultural_use filter key */
  agriculturalUse: AgriculturalUseFilter
  classificationValueIds: string[]
  cultivars: CatalogCultivar[]
}

export function isAgriculturalUseFilter(
  value: string | null | undefined
): value is AgriculturalUseFilter {
  return (
    value === "vegetable" ||
    value === "herb" ||
    value === "berry" ||
    value === "cereal" ||
    value === "legume" ||
    value === "oilseed"
  )
}

export function parseAgriculturalUseFilter(
  value: string | null | undefined
): AgriculturalUseFilter {
  return isAgriculturalUseFilter(value) ? value : "vegetable"
}

/** @deprecated */
export const isSpeciesCategory = isAgriculturalUseFilter
/** @deprecated */
export const parseSpeciesCategory = parseAgriculturalUseFilter

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
  uses: readonly AgriculturalUseFilter[],
  locale: Locale
) {
  const normalized = query.trim().toLowerCase()
  return items.filter((item) => {
    if (uses.length > 0) {
      const plantUses = agriculturalUsesFromValueIds(item.classificationValueIds)
      if (!uses.some((use) => plantUses.includes(use))) {
        return false
      }
    }
    return matchesQuery(locale, item, normalized)
  })
}

const VALUE_ID_TO_FILTER: Record<string, AgriculturalUseFilter> = {
  kb_cv_vegetable: "vegetable",
  kb_cv_herb: "herb",
  kb_cv_berry: "berry",
  kb_cv_cereal: "cereal",
  kb_cv_legume: "legume",
  kb_cv_fabaceae: "legume",
  kb_cv_oilseed: "oilseed",
}

const FILTER_PRIORITY: AgriculturalUseFilter[] = [
  "vegetable",
  "herb",
  "berry",
  "cereal",
  "legume",
  "oilseed",
]

export function agriculturalUsesFromValueIds(
  valueIds: string[]
): AgriculturalUseFilter[] {
  const found = new Set<AgriculturalUseFilter>()
  for (const id of valueIds) {
    const filter = VALUE_ID_TO_FILTER[id]
    if (filter) {
      found.add(filter)
    }
  }
  return FILTER_PRIORITY.filter((key) => found.has(key))
}

export function agriculturalUseFromValueIds(
  valueIds: string[]
): AgriculturalUseFilter {
  return agriculturalUsesFromValueIds(valueIds)[0] ?? "vegetable"
}
