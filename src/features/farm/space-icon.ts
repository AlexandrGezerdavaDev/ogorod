import type { LucideIcon } from "lucide-react"
import { Building2Icon, FenceIcon, WarehouseIcon } from "lucide-react"

export type SpaceKind = "greenhouse" | "garden" | "apartment" | "default"

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/’/g, "'")
}

export function spaceKind(name: string): SpaceKind {
  const value = normalize(name)

  if (
    /теплиц|парник|greenhouse|hothouse|glasshouse|оранжере/.test(value)
  ) {
    return "greenhouse"
  }

  if (
    /квартир|балкон|apartment|balcony|flat|вікон|окон|кімнат|комнат|indoor|подокон/.test(
      value
    )
  ) {
    return "apartment"
  }

  if (
    /огород|город|garden|outdoor|відкрит|открыт|ґрунт|грунт|ділянка|участ|грядк|yard|plot|дач/.test(
      value
    )
  ) {
    return "garden"
  }

  return "default"
}

export function spaceIcon(name: string): LucideIcon {
  switch (spaceKind(name)) {
    case "greenhouse":
      return WarehouseIcon
    case "apartment":
      return Building2Icon
    case "garden":
      return FenceIcon
    default:
      return FenceIcon
  }
}
