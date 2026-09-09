"use client"

import type { DisplaySeedLot } from "@/features/farm"
import { formatSeedQuantityLabel } from "@/i18n/format"
import { useI18n } from "@/i18n/provider"
import { PlantProfileSheet } from "@/components/plant-profile-sheet"

export function SeedPlantSheet({
  lot,
  open,
  onOpenChange,
}: {
  lot: DisplaySeedLot | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { messages: m } = useI18n()
  const title = lot
    ? lot.speciesName
      ? `${lot.speciesName} · ${lot.cultivarName}`
      : lot.cultivarName
    : ""

  return (
    <PlantProfileSheet
      speciesId={lot?.speciesId}
      title={title}
      description={
        lot ? formatSeedQuantityLabel(m, lot.quantity, lot.unit) : null
      }
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}
