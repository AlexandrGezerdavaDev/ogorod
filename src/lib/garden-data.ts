import { addYears, differenceInYears, isAfter, parseISO } from "date-fns"

export type PlantStatus = "healthy" | "water" | "attention"

export type Plant = {
  id: string
  speciesId: string
  name: string
  variety: string
  bed: string
  status: PlantStatus
  nextCare: string
  planted: string
}

export type GardenBed = {
  name: string
  plants: number
  href: string
}

export type CareTask = {
  id: string
  title: string
  date: string
  plant: string
  kind: "water" | "feed" | "sow" | "harvest"
}

export type SeedUnit = "шт" | "г"

export type SeedLot = {
  id: string
  cultivarId: string
  speciesName: string
  cultivarName: string
  quantity: number
  unit: SeedUnit
  packedAt: string
}

export const SEED_LOT_AGE_YEARS = 2

export const user = {
  name: "Олена Коваль",
  email: "olena@ogorod.app",
  avatar: "",
}

export const gardens = [
  { id: "ogorod", name: "OGOROD", plan: "Дача · Київщина" },
  { id: "greenhouse", name: "Теплиця", plan: "Закритий ґрунт" },
  { id: "balcony", name: "Балкон", plan: "Міський город" },
] as const

export const plants: Plant[] = [
  {
    id: "1",
    speciesId: "kb_species_solanum_lycopersicum",
    name: "Помідори",
    variety: "Бичаче серце",
    bed: "greenhouse",
    status: "water",
    nextCare: "Полив сьогодні",
    planted: "12 квітня",
  },
  {
    id: "2",
    speciesId: "kb_species_cucumis_sativus",
    name: "Огірки",
    variety: "Корнішони",
    bed: "outdoor",
    status: "healthy",
    nextCare: "Підживлення 10 вер.",
    planted: "20 квітня",
  },
  {
    id: "3",
    speciesId: "kb_species_ocimum_basilicum",
    name: "Базилік",
    variety: "Генуезький",
    bed: "balcony",
    status: "attention",
    nextCare: "Переставити в тінь",
    planted: "3 травня",
  },
  {
    id: "4",
    speciesId: "kb_species_capsicum_annuum",
    name: "Перець",
    variety: "Солодкий",
    bed: "greenhouse",
    status: "healthy",
    nextCare: "Полив 9 вер.",
    planted: "18 квітня",
  },
  {
    id: "5",
    speciesId: "kb_species_fragaria_ananassa",
    name: "Полуниця",
    variety: "Альбіон",
    bed: "outdoor",
    status: "water",
    nextCare: "Полив сьогодні",
    planted: "2 березня",
  },
  {
    id: "6",
    speciesId: "kb_species_mentha_piperita",
    name: "М'ята",
    variety: "Перцева",
    bed: "balcony",
    status: "healthy",
    nextCare: "Обрізка 12 вер.",
    planted: "1 травня",
  },
]

export const beds: GardenBed[] = [
  { name: "greenhouse", plants: 2, href: "/plants" },
  { name: "outdoor", plants: 2, href: "/plants" },
  { name: "balcony", plants: 2, href: "/plants" },
]

export const tasks: CareTask[] = [
  {
    id: "t1",
    title: "Полив помідорів",
    date: "2026-09-08",
    plant: "Помідори",
    kind: "water",
  },
  {
    id: "t2",
    title: "Полив полуниці",
    date: "2026-09-08",
    plant: "Полуниця",
    kind: "water",
  },
  {
    id: "t3",
    title: "Підживлення огірків",
    date: "2026-09-10",
    plant: "Огірки",
    kind: "feed",
  },
  {
    id: "t4",
    title: "Посів редиски",
    date: "2026-09-12",
    plant: "Редиска",
    kind: "sow",
  },
  {
    id: "t5",
    title: "Збір базиліку",
    date: "2026-09-14",
    plant: "Базилік",
    kind: "harvest",
  },
]

export const statusLabel: Record<PlantStatus, string> = {
  healthy: "Здорова",
  water: "Полити",
  attention: "Увага",
}

export const taskKindLabel: Record<CareTask["kind"], string> = {
  water: "Полив",
  feed: "Підживлення",
  sow: "Посів",
  harvest: "Збір",
}

export const seedLots: SeedLot[] = [
  {
    id: "lot-tomato-2024",
    cultivarId: "kb_cultivar_bychache_sertse",
    speciesName: "Помідор",
    cultivarName: "Бичаче серце",
    quantity: 100,
    unit: "шт",
    packedAt: "2024-07-10",
  },
  {
    id: "lot-tomato-2026",
    cultivarId: "kb_cultivar_bychache_sertse",
    speciesName: "Помідор",
    cultivarName: "Бичаче серце",
    quantity: 50,
    unit: "шт",
    packedAt: "2026-02-18",
  },
]

export function formatSeedQuantity(quantity: number, unit: SeedUnit) {
  return `${quantity} ${unit}`
}

export function seedLotAgeYears(packedAt: string, now = new Date()) {
  return differenceInYears(now, parseISO(packedAt))
}

export function isAgedSeedLot(
  packedAt: string | null | undefined,
  now = new Date()
) {
  if (!packedAt) {
    return false
  }
  const packed = parseISO(packedAt)
  if (Number.isNaN(packed.getTime())) {
    return false
  }
  return !isAfter(addYears(packed, SEED_LOT_AGE_YEARS), now)
}

export function seedLotAgeLabel(packedAt: string, now = new Date()) {
  if (!isAgedSeedLot(packedAt, now)) {
    return "Свіжий"
  }
  return yearsUk(Math.max(SEED_LOT_AGE_YEARS, seedLotAgeYears(packedAt, now)))
}

export function agedSeedLots(now = new Date()) {
  return seedLots.filter((lot) => isAgedSeedLot(lot.packedAt, now))
}

function yearsUk(years: number) {
  const mod10 = years % 10
  const mod100 = years % 100
  if (mod10 === 1 && mod100 !== 11) {
    return `${years} рік`
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${years} роки`
  }
  return `${years} років`
}
