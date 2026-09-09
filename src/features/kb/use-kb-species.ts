"use client"

import { useQuery } from "@tanstack/react-query"

import { localDb } from "@/features/sync/db"
import { getOrCreateDevice } from "@/features/sync/device"
import type { LocalCultivar, LocalSpecies } from "@/features/sync/db"

type KbRow = {
  id: string
  scientificName?: string
  commonNameUk?: string
  commonNameEn?: string | null
  category?: string | null
  speciesId?: string
  name?: string
}

type KbResponse = {
  revision?: number
  species: KbRow[]
  cultivars: KbRow[]
}

function toSpecies(row: KbRow): LocalSpecies {
  return {
    id: row.id,
    scientificName: row.scientificName ?? "",
    commonNameUk: row.commonNameUk ?? "",
    commonNameEn: row.commonNameEn,
    category: row.category ?? "vegetable",
  }
}

function toCultivar(row: KbRow): LocalCultivar {
  return {
    id: row.id,
    speciesId: row.speciesId ?? "",
    name: row.name ?? "",
  }
}

export function useKbSpecies() {
  return useQuery({
    queryKey: ["kb", "species"],
    queryFn: async () => {
      const response = await fetch("/api/kb/species")
      if (!response.ok) {
        throw new Error("Не вдалося завантажити каталог рослин")
      }
      const data = (await response.json()) as KbResponse
      const species = data.species.map(toSpecies)
      const cultivars = data.cultivars.map(toCultivar)
      if (localDb) {
        await getOrCreateDevice()
        await localDb.species.bulkPut(species)
        await localDb.cultivar.bulkPut(cultivars)
        if (typeof data.revision === "number") {
          await localDb.syncState.update("self", { kbRevision: data.revision })
        }
      }
      return { species, cultivars }
    },
  })
}
