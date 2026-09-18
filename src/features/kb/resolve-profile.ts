import type { Locale } from "@/i18n/config"
import {
  getPlantProfile,
  SECTION_TRAIT_KEYS,
  type GeneticsKey,
  type GrowingKey,
  type LocalizedText,
  type PlantProfile,
  type TaxonomyKey,
  type UsageKey,
} from "@/features/kb/plant-profiles"
import type {
  LocalCareProfile,
  LocalClassificationGroup,
  LocalClassificationValue,
  LocalDisease,
  LocalSpecies,
  LocalSpeciesClassification,
  LocalSpeciesDisease,
} from "@/features/sync/db"

const dash: LocalizedText = { uk: "—", en: "—", ru: "—" }

function asLocalized(
  value: Record<string, string> | undefined
): LocalizedText {
  if (!value) {
    return dash
  }
  return {
    uk: value.uk ?? value.en ?? "—",
    en: value.en ?? value.uk ?? "—",
    ru: value.ru ?? value.uk ?? value.en ?? "—",
  }
}

function mergeSection<K extends string>(
  keys: readonly K[],
  stored: Record<string, Record<string, string>> | undefined,
  fallback: Record<K, LocalizedText>
): Record<K, LocalizedText> {
  return Object.fromEntries(
    keys.map((key) => {
      const fromStore = stored?.[key]
      if (fromStore && (fromStore.uk || fromStore.en || fromStore.ru)) {
        return [key, asLocalized(fromStore)]
      }
      return [key, fallback[key] ?? dash]
    })
  ) as Record<K, LocalizedText>
}

function localeName(
  locale: Locale,
  row: { nameUk: string; nameEn?: string | null }
) {
  if (locale === "en" && row.nameEn) {
    return row.nameEn
  }
  return row.nameUk
}

export type SpeciesClassificationChip = {
  groupType: string
  groupName: string
  valueId: string
  valueName: string
}

export type ResolvedPlantProfile = {
  profile: PlantProfile
  classifications: SpeciesClassificationChip[]
  diseases: Array<{ id: string; name: string }>
  fromCareProfile: boolean
}

export type KbProfileSource = {
  species: LocalSpecies[]
  careProfiles: LocalCareProfile[]
  classificationGroups: LocalClassificationGroup[]
  classificationValues: LocalClassificationValue[]
  speciesClassifications: LocalSpeciesClassification[]
  speciesDiseases: LocalSpeciesDisease[]
  diseases: LocalDisease[]
}

export function resolvePlantProfile(
  speciesId: string | null | undefined,
  kb: KbProfileSource | null | undefined,
  locale: Locale
): ResolvedPlantProfile {
  const fallback = getPlantProfile(speciesId)
  if (!speciesId || !kb) {
    return {
      profile: fallback,
      classifications: [],
      diseases: [],
      fromCareProfile: false,
    }
  }

  const species = kb.species.find((row) => row.id === speciesId)
  const care = kb.careProfiles.find((row) => row.speciesId === speciesId)
  const valueIds = new Set(
    kb.speciesClassifications
      .filter((row) => row.speciesId === speciesId)
      .map((row) => row.classificationValueId)
  )
  const values = kb.classificationValues.filter((row) => valueIds.has(row.id))
  const groupsById = new Map(kb.classificationGroups.map((g) => [g.id, g]))

  const classifications: SpeciesClassificationChip[] = values
    .map((value) => {
      const group = groupsById.get(value.groupId)
      if (!group) {
        return null
      }
      return {
        groupType: group.type,
        groupName: localeName(locale, group),
        valueId: value.id,
        valueName: localeName(locale, value),
      }
    })
    .filter((row): row is SpeciesClassificationChip => row !== null)
    .sort((a, b) => a.groupType.localeCompare(b.groupType) || a.valueName.localeCompare(b.valueName))

  const botanical = classifications.find((c) => c.groupType === "botanical")
  const lifeCycle = classifications.find((c) => c.groupType === "life_cycle")

  const taxonomyOverrides: Partial<Record<TaxonomyKey, LocalizedText>> = {}
  if (botanical) {
    taxonomyOverrides.family = {
      uk: botanical.valueName,
      en: botanical.valueName,
      ru: botanical.valueName,
    }
  }
  if (lifeCycle) {
    taxonomyOverrides.lifeCycle = {
      uk: lifeCycle.valueName,
      en: lifeCycle.valueName,
      ru: lifeCycle.valueName,
    }
  }
  if (species?.scientificName) {
    taxonomyOverrides.species = {
      uk: species.scientificName,
      en: species.scientificName,
      ru: species.scientificName,
    }
  }

  const taxonomy = Object.fromEntries(
    SECTION_TRAIT_KEYS.taxonomy.map((key) => [
      key,
      taxonomyOverrides[key] ?? fallback.taxonomy[key] ?? dash,
    ])
  ) as Record<TaxonomyKey, LocalizedText>

  const profile: PlantProfile = {
    imageUrl: care?.imageUrl?.trim() || fallback.imageUrl,
    taxonomy,
    growing: mergeSection(
      SECTION_TRAIT_KEYS.growing,
      care?.growing,
      fallback.growing
    ) as Record<GrowingKey, LocalizedText>,
    genetics: mergeSection(
      SECTION_TRAIT_KEYS.genetics,
      care?.genetics,
      fallback.genetics
    ) as Record<GeneticsKey, LocalizedText>,
    usage: mergeSection(
      SECTION_TRAIT_KEYS.usage,
      care?.usage,
      fallback.usage
    ) as Record<UsageKey, LocalizedText>,
  }

  const diseaseIds = new Set(
    kb.speciesDiseases
      .filter((row) => row.speciesId === speciesId)
      .map((row) => row.diseaseId)
  )
  const diseases = kb.diseases
    .filter((row) => diseaseIds.has(row.id))
    .map((row) => ({
      id: row.id,
      name: localeName(locale, row),
    }))

  return {
    profile,
    classifications,
    diseases,
    fromCareProfile: Boolean(care),
  }
}

export function resolveSpeciesImageUrl(
  speciesId: string | null | undefined,
  kb: KbProfileSource | null | undefined
) {
  if (!speciesId) {
    return getPlantProfile(null).imageUrl
  }
  const care = kb?.careProfiles.find((row) => row.speciesId === speciesId)
  if (care?.imageUrl?.trim()) {
    return care.imageUrl
  }
  return getPlantProfile(speciesId).imageUrl
}
