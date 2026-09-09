"use client"

import { useMemo } from "react"
import { useLiveQuery } from "dexie-react-hooks"

import { catalogCommonName, catalogCultivarName } from "@/i18n/format"
import { useI18n } from "@/i18n/provider"
import { useKbSpecies } from "@/features/kb/use-kb-species"
import { localDb } from "@/features/sync/db"
import { normalizeSeedUnit } from "./seed-lots"

export type DisplaySeedLot = {
  id: string
  cultivarId: string | null
  speciesId: string | null
  speciesName: string
  cultivarName: string
  quantity: number
  unit: "шт" | "г"
  packedAt: string | null
}

export function useSeedLots() {
  const { locale } = useI18n()
  const kb = useKbSpecies()
  const rows = useLiveQuery(
    () => (localDb ? localDb.seedLots.toArray() : []),
    []
  )

  const lots = useMemo(() => {
    const species = kb.data?.species ?? []
    const cultivars = kb.data?.cultivars ?? []
    const display: DisplaySeedLot[] = (rows ?? [])
      .filter((lot) => !lot.deletedAt)
      .map((lot) => {
        const cultivar = lot.cultivarId
          ? cultivars.find((item) => item.id === lot.cultivarId)
          : undefined
        const speciesId = lot.speciesId ?? cultivar?.speciesId ?? null
        const speciesRow = species.find((item) => item.id === speciesId)
        const storedName = lot.name?.trim()
        return {
          id: lot.id,
          cultivarId: lot.cultivarId ?? null,
          speciesId,
          speciesName: speciesRow ? catalogCommonName(locale, speciesRow) : "",
          cultivarName: storedName
            ? storedName
            : cultivar
              ? catalogCultivarName(locale, cultivar.name)
              : lot.cultivarId ?? "—",
          quantity: lot.quantity,
          unit: normalizeSeedUnit(lot.unit),
          packedAt: lot.packedAt ?? null,
        }
      })

    return display.sort((left, right) => {
      if (!left.packedAt && !right.packedAt) {
        return 0
      }
      if (!left.packedAt) {
        return 1
      }
      if (!right.packedAt) {
        return -1
      }
      return left.packedAt.localeCompare(right.packedAt)
    })
  }, [kb.data, locale, rows])

  return {
    lots,
    isPending: rows === undefined,
  }
}
