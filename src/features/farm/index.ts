export function remainingAfterSow(quantity: number, sown: number) {
  if (!Number.isFinite(quantity) || !Number.isFinite(sown) || sown <= 0) {
    return quantity
  }
  return Math.max(0, quantity - sown)
}

export {
  createSeedLot,
  deleteSeedLot,
  normalizeSeedUnit,
  updateSeedLotQuantity,
} from "./seed-lots"
export type { CreateSeedLotInput, SeedUnit } from "./seed-lots"
export { createPlanting, deletePlanting } from "./plantings"
export type { CreatePlantingInput } from "./plantings"
export { createField, updateField } from "./fields"
export { useSeedLots } from "./use-seed-lots"
export type { DisplaySeedLot } from "./use-seed-lots"
export { usePlantings } from "./use-plantings"
export type { DisplayPlanting } from "./use-plantings"
export { useSpaces } from "./use-spaces"
export type { DisplaySpace } from "./use-spaces"
