"use client"

import { useMemo } from "react"
import { useLiveQuery } from "dexie-react-hooks"

import { authClient } from "@/features/auth/client"
import { catalogCommonName, catalogCultivarName } from "@/i18n/format"
import { localizeBed } from "@/i18n/localize"
import { useI18n } from "@/i18n/provider"
import { useKbSpecies } from "@/features/kb/use-kb-species"
import { localDb } from "@/features/sync/db"

export type DisplayPlanting = {
  id: string
  speciesId: string | null
  cultivarId: string | null
  speciesName: string
  cultivarName: string
  fieldId: string
  fieldName: string
  bed: string
  plantedAt: string | null
}

export function usePlantings(options?: { fieldId?: string | null }) {
  const fieldId = options?.fieldId
  const { locale, messages: m } = useI18n()
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const organizationId = session?.session.activeOrganizationId
  const kb = useKbSpecies()
  const rows = useLiveQuery(
    () => (localDb ? localDb.plantings.toArray() : []),
    []
  )
  const fields = useLiveQuery(
    () => (localDb ? localDb.fields.toArray() : []),
    []
  )

  const plantings = useMemo(() => {
    const species = kb.data?.species ?? []
    const cultivars = kb.data?.cultivars ?? []
    const display: DisplayPlanting[] = (rows ?? [])
      .filter((planting) => !planting.deletedAt)
      .filter((planting) =>
        organizationId ? planting.organizationId === organizationId : false
      )
      .filter((planting) => (fieldId ? planting.fieldId === fieldId : true))
      .map((planting) => {
        const cultivar = planting.cultivarId
          ? cultivars.find((item) => item.id === planting.cultivarId)
          : undefined
        const speciesId = planting.speciesId ?? cultivar?.speciesId ?? null
        const speciesRow = species.find((item) => item.id === speciesId)
        const field = (fields ?? []).find((item) => item.id === planting.fieldId)
        const storedName = planting.nickname?.trim()
        return {
          id: planting.id,
          speciesId,
          cultivarId: planting.cultivarId ?? null,
          speciesName: speciesRow ? catalogCommonName(locale, speciesRow) : "",
          cultivarName: storedName
            ? storedName
            : cultivar
              ? catalogCultivarName(locale, cultivar.name)
              : "—",
          fieldId: planting.fieldId,
          fieldName: field?.name ?? "",
          bed: field ? localizeBed(m, field.name) : "",
          plantedAt: planting.plantedAt ?? null,
        }
      })

    return display.sort((left, right) => {
      if (!left.plantedAt && !right.plantedAt) {
        return 0
      }
      if (!left.plantedAt) {
        return 1
      }
      if (!right.plantedAt) {
        return -1
      }
      return right.plantedAt.localeCompare(left.plantedAt)
    })
  }, [fieldId, fields, kb.data, locale, m, organizationId, rows])

  return {
    plantings,
    isPending: rows === undefined || sessionPending,
  }
}
