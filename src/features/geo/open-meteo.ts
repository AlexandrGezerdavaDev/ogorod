import type { GeoPlace } from "./types"

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search"
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

type OpenMeteoPlace = {
  id?: number
  name?: string
  admin1?: string
  country?: string
  latitude?: number
  longitude?: number
  timezone?: string
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

export async function searchPlaces(query: string, language: string) {
  const url = new URL(GEO_URL)
  url.searchParams.set("name", query)
  url.searchParams.set("count", "8")
  url.searchParams.set("language", language)

  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error("geocoding_failed")
  }

  const payload = (await response.json()) as { results?: OpenMeteoPlace[] }
  const results: GeoPlace[] = []
  for (const row of payload.results ?? []) {
    const latitude = asNumber(row.latitude)
    const longitude = asNumber(row.longitude)
    if (!row.id || !row.name || latitude == null || longitude == null) {
      continue
    }
    results.push({
      id: row.id,
      name: row.name,
      region: row.admin1 ?? "",
      country: row.country ?? "",
      latitude,
      longitude,
      timezone: row.timezone || "Europe/Kyiv",
    })
  }
  return results
}

type OpenMeteoForecast = {
  timezone?: string
  current?: {
    temperature_2m?: number
    weather_code?: number
    precipitation?: number
  }
  daily?: {
    time?: string[]
    temperature_2m_max?: number[]
    temperature_2m_min?: number[]
    precipitation_sum?: number[]
    weather_code?: number[]
    et0_fao_evapotranspiration?: number[]
  }
}

export async function fetchForecast(options: {
  latitude: number
  longitude: number
  timezone?: string
  unit: "c" | "f"
}) {
  const url = new URL(FORECAST_URL)
  url.searchParams.set("latitude", String(options.latitude))
  url.searchParams.set("longitude", String(options.longitude))
  url.searchParams.set("current", "temperature_2m,weather_code,precipitation")
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,et0_fao_evapotranspiration"
  )
  url.searchParams.set("forecast_days", "7")
  url.searchParams.set(
    "temperature_unit",
    options.unit === "f" ? "fahrenheit" : "celsius"
  )
  url.searchParams.set("timezone", options.timezone || "auto")

  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error("forecast_failed")
  }

  return (await response.json()) as OpenMeteoForecast
}
