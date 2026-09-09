import { localDb } from "@/features/sync/db"
import type { LocalWeather, WeatherSnapshot } from "./types"

export async function readCachedWeather(id: string) {
  if (!localDb) {
    return undefined
  }
  return localDb.weather.get(id)
}

export async function writeCachedWeather(row: LocalWeather) {
  if (!localDb) {
    return
  }
  await localDb.weather.put(row)
}

export function toSnapshot(row: LocalWeather, fromCache: boolean): WeatherSnapshot {
  return {
    fetchedAt: row.fetchedAt,
    timezone: row.timezone,
    temperatureUnit: row.temperatureUnit,
    current: row.current,
    daily: row.daily,
    frost: row.frost,
    fromCache,
  }
}
