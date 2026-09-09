"use client"

import { useQuery } from "@tanstack/react-query"

import type { TemperatureUnit } from "@/features/settings/preferences"
import { readCachedWeather, toSnapshot, writeCachedWeather } from "./cache"
import type { WeatherSnapshot } from "./types"

export function useWeather(options: {
  gardenId: string | null
  latitude: number | null
  longitude: number | null
  timezone: string
  unit: TemperatureUnit
}) {
  const enabled =
    Boolean(options.gardenId) &&
    options.latitude != null &&
    options.longitude != null

  return useQuery({
    queryKey: [
      "weather",
      options.gardenId,
      options.latitude,
      options.longitude,
      options.unit,
    ],
    enabled,
    staleTime: 30 * 60 * 1000,
    queryFn: async (): Promise<WeatherSnapshot> => {
      const gardenId = options.gardenId
      const latitude = options.latitude
      const longitude = options.longitude
      if (!gardenId || latitude == null || longitude == null) {
        throw new Error("missing_place")
      }

      const params = new URLSearchParams({
        lat: String(latitude),
        lng: String(longitude),
        tz: options.timezone,
        unit: options.unit,
      })

      try {
        const response = await fetch(`/api/weather?${params.toString()}`)
        if (!response.ok) {
          throw new Error("forecast_failed")
        }
        const snapshot = (await response.json()) as WeatherSnapshot
        await writeCachedWeather({
          ...snapshot,
          id: gardenId,
          latitude,
          longitude,
          fromCache: false,
        })
        return { ...snapshot, fromCache: false }
      } catch (error) {
        const cached = await readCachedWeather(gardenId)
        if (cached) {
          return toSnapshot(cached, true)
        }
        throw error
      }
    },
  })
}
