export const PREFERENCES_KEY = "ogorod.preferences"

export const temperatureUnits = ["c", "f"] as const
export const areaUnits = ["m2", "sotka", "ha"] as const
export const massUnits = ["kg", "g"] as const
export const volumeUnits = ["l", "ml"] as const
export const dateFormats = ["dmy", "mdy", "ymd"] as const
export const weekStarts = ["monday", "sunday"] as const
export const timezones = [
  "Europe/Kyiv",
  "Europe/Warsaw",
  "Europe/Bucharest",
  "Europe/Chisinau",
  "UTC",
] as const

export type TemperatureUnit = (typeof temperatureUnits)[number]
export type AreaUnit = (typeof areaUnits)[number]
export type MassUnit = (typeof massUnits)[number]
export type VolumeUnit = (typeof volumeUnits)[number]
export type DateFormat = (typeof dateFormats)[number]
export type WeekStart = (typeof weekStarts)[number]
export type Timezone = (typeof timezones)[number]

export type GardenPlace = {
  placeId: number | null
  city: string
  region: string
  country: string
  latitude: number | null
  longitude: number | null
  timezone: string
}

export type DevicePreferences = {
  notifications: {
    dnd: boolean
    care: {
      water: boolean
      feed: boolean
      disease: boolean
      other: boolean
    }
    seasonal: {
      sow: boolean
      plant: boolean
      transplant: boolean
      harvest: boolean
    }
    morning: string
    evening: string
  }
  garden: {
    temperature: TemperatureUnit
    area: AreaUnit
    mass: MassUnit
    volume: VolumeUnit
    dateFormat: DateFormat
    weekStart: WeekStart
  }
  places: Record<string, GardenPlace>
  appearance: {
    showLatin: boolean
    showUnits: boolean
  }
  sync: {
    auto: boolean
  }
}

export const defaultPlace: GardenPlace = {
  placeId: null,
  city: "",
  region: "",
  country: "",
  latitude: null,
  longitude: null,
  timezone: "Europe/Kyiv",
}

export const defaultPreferences: DevicePreferences = {
  notifications: {
    dnd: false,
    care: {
      water: true,
      feed: true,
      disease: true,
      other: false,
    },
    seasonal: {
      sow: true,
      plant: true,
      transplant: false,
      harvest: true,
    },
    morning: "08:00",
    evening: "19:00",
  },
  garden: {
    temperature: "c",
    area: "m2",
    mass: "kg",
    volume: "l",
    dateFormat: "dmy",
    weekStart: "monday",
  },
  places: {},
  appearance: {
    showLatin: false,
    showUnits: true,
  },
  sync: {
    auto: true,
  },
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseCoord(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function parsePlaceId(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value
  }
  return null
}

function parseTimezone(value: unknown): string {
  if (typeof value === "string" && timezones.includes(value as Timezone)) {
    return value
  }
  if (value === "UTC") {
    return "UTC"
  }
  if (typeof value === "string" && /^[A-Za-z_]+(?:\/[A-Za-z0-9_+-]+)+$/.test(value)) {
    return value
  }
  return "Europe/Kyiv"
}

export function hasCoordinates(
  place: GardenPlace
): place is GardenPlace & { latitude: number; longitude: number } {
  return place.latitude != null && place.longitude != null
}

export function firstPlacedGarden(
  prefs: DevicePreferences,
  gardenIds: readonly string[]
) {
  for (const gardenId of gardenIds) {
    const place = gardenPlace(prefs, gardenId)
    if (hasCoordinates(place)) {
      return { gardenId, place }
    }
  }
  return null
}

export function parsePreferences(value: unknown): DevicePreferences {
  if (!isRecord(value)) {
    return defaultPreferences
  }

  const notifications = isRecord(value.notifications) ? value.notifications : {}
  const care = isRecord(notifications.care) ? notifications.care : {}
  const seasonal = isRecord(notifications.seasonal) ? notifications.seasonal : {}
  const garden = isRecord(value.garden) ? value.garden : {}
  const appearance = isRecord(value.appearance) ? value.appearance : {}
  const sync = isRecord(value.sync) ? value.sync : {}
  const places = isRecord(value.places) ? value.places : {}

  return {
    notifications: {
      dnd: Boolean(notifications.dnd),
      care: {
        water: care.water !== false,
        feed: care.feed !== false,
        disease: care.disease !== false,
        other: Boolean(care.other),
      },
      seasonal: {
        sow: seasonal.sow !== false,
        plant: seasonal.plant !== false,
        transplant: Boolean(seasonal.transplant),
        harvest: seasonal.harvest !== false,
      },
      morning:
        typeof notifications.morning === "string"
          ? notifications.morning
          : defaultPreferences.notifications.morning,
      evening:
        typeof notifications.evening === "string"
          ? notifications.evening
          : defaultPreferences.notifications.evening,
    },
    garden: {
      temperature: garden.temperature === "f" ? "f" : "c",
      area:
        garden.area === "sotka" || garden.area === "ha" ? garden.area : "m2",
      mass: garden.mass === "g" ? "g" : "kg",
      volume: garden.volume === "ml" ? "ml" : "l",
      dateFormat:
        garden.dateFormat === "mdy" || garden.dateFormat === "ymd"
          ? garden.dateFormat
          : "dmy",
      weekStart: garden.weekStart === "sunday" ? "sunday" : "monday",
    },
    places: Object.fromEntries(
      Object.entries(places).flatMap(([id, place]) => {
        if (!isRecord(place)) {
          return []
        }
        return [
          [
            id,
            {
              placeId: parsePlaceId(place.placeId),
              city: typeof place.city === "string" ? place.city : "",
              region: typeof place.region === "string" ? place.region : "",
              country: typeof place.country === "string" ? place.country : "",
              latitude: parseCoord(place.latitude),
              longitude: parseCoord(place.longitude),
              timezone: parseTimezone(place.timezone),
            },
          ],
        ]
      })
    ),
    appearance: {
      showLatin: Boolean(appearance.showLatin),
      showUnits: appearance.showUnits !== false,
    },
    sync: {
      auto: sync.auto !== false,
    },
  }
}

export function loadPreferences(): DevicePreferences {
  if (typeof window === "undefined") {
    return defaultPreferences
  }
  try {
    const raw = window.localStorage.getItem(PREFERENCES_KEY)
    if (!raw) {
      return defaultPreferences
    }
    return parsePreferences(JSON.parse(raw))
  } catch {
    return defaultPreferences
  }
}

export function savePreferences(prefs: DevicePreferences) {
  if (typeof window === "undefined") {
    return
  }
  window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs))
  applyAppearance()
}

export function applyAppearance() {
  if (typeof document === "undefined") {
    return
  }
  delete document.documentElement.dataset.density
}

export function gardenPlace(
  prefs: DevicePreferences,
  gardenId: string
): GardenPlace {
  return prefs.places[gardenId] ?? defaultPlace
}
