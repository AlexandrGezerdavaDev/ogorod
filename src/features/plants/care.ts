import type { Plant, PlantStatus } from "@/lib/garden-data"

export const PLANT_CARE_KEY = "ogorod.plant-care"

export const careKinds = ["water", "feed"] as const

export type CareKind = (typeof careKinds)[number]

export type PlantCareDay = Partial<Record<CareKind, string>>

export type PlantCareState = Record<string, PlantCareDay>

const EMPTY: PlantCareState = {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function todayKey(now = new Date()) {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function parseCare(value: unknown): PlantCareState {
  if (!isRecord(value)) {
    return {}
  }

  const next: PlantCareState = {}
  for (const [plantId, marks] of Object.entries(value)) {
    if (!isRecord(marks)) {
      continue
    }
    const day: PlantCareDay = {}
    if (typeof marks.water === "string") {
      day.water = marks.water
    }
    if (typeof marks.feed === "string") {
      day.feed = marks.feed
    }
    if (day.water || day.feed) {
      next[plantId] = day
    }
  }
  return next
}

export function loadPlantCare(): PlantCareState {
  if (typeof window === "undefined") {
    return {}
  }
  try {
    const raw = window.localStorage.getItem(PLANT_CARE_KEY)
    if (!raw) {
      return {}
    }
    return parseCare(JSON.parse(raw))
  } catch {
    return {}
  }
}

export function parseCareDay(day: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day)
  if (!match) {
    return null
  }
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3])
  )
  return Number.isNaN(date.getTime()) ? null : date
}

export function getCareDate(
  state: PlantCareState,
  plantId: string,
  kind: CareKind
) {
  return state[plantId]?.[kind]
}

function savePlantCare(state: PlantCareState) {
  if (typeof window === "undefined") {
    return
  }
  window.localStorage.setItem(PLANT_CARE_KEY, JSON.stringify(state))
}

const listeners = new Set<() => void>()
let current: PlantCareState = EMPTY

if (typeof window !== "undefined") {
  current = loadPlantCare()
}

function emit() {
  for (const listener of listeners) {
    listener()
  }
}

export function subscribePlantCare(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getPlantCare() {
  return current
}

export function getServerPlantCare() {
  return EMPTY
}

export function isCareDoneToday(
  state: PlantCareState,
  plantId: string,
  kind: CareKind,
  now = new Date()
) {
  return state[plantId]?.[kind] === todayKey(now)
}

export function setCareDone(
  plantId: string,
  kind: CareKind,
  done: boolean,
  now = new Date()
) {
  const day = todayKey(now)
  const previous = current[plantId] ?? {}
  const nextDay: PlantCareDay = { ...previous }

  if (done) {
    nextDay[kind] = day
  } else {
    delete nextDay[kind]
  }

  const next: PlantCareState = { ...current }
  if (!nextDay.water && !nextDay.feed) {
    delete next[plantId]
  } else {
    next[plantId] = nextDay
  }

  current = next
  savePlantCare(current)
  emit()
}

export function plantDisplayStatus(
  plant: Plant,
  state: PlantCareState
): PlantStatus {
  if (plant.status === "water" && isCareDoneToday(state, plant.id, "water")) {
    return "healthy"
  }
  return plant.status
}

export function plantNeedsWater(plant: Plant, state: PlantCareState) {
  return plant.status === "water" && !isCareDoneToday(state, plant.id, "water")
}

export function plantNeedsAttention(plant: Plant, state: PlantCareState) {
  if (plant.status === "attention") {
    return true
  }
  return plantNeedsWater(plant, state)
}
