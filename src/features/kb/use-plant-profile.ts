"use client"

import { useMemo } from "react"

import { useI18n } from "@/i18n/provider"
import { useKbSpecies } from "@/features/kb/use-kb-species"
import {
  resolvePlantProfile,
  resolveSpeciesImageUrl,
  type ResolvedPlantProfile,
} from "@/features/kb/resolve-profile"
import { getPlantProfile } from "@/features/kb/plant-profiles"

export function usePlantProfile(
  speciesId: string | null | undefined
): ResolvedPlantProfile {
  const { locale } = useI18n()
  const kb = useKbSpecies()

  return useMemo(() => {
    if (!kb.data) {
      return {
        profile: getPlantProfile(speciesId),
        classifications: [],
        diseases: [],
        fromCareProfile: false,
      }
    }
    return resolvePlantProfile(speciesId, kb.data, locale)
  }, [speciesId, kb.data, locale])
}

export function useSpeciesImageUrl(speciesId: string | null | undefined) {
  const kb = useKbSpecies()
  return useMemo(
    () => resolveSpeciesImageUrl(speciesId, kb.data),
    [speciesId, kb.data]
  )
}
