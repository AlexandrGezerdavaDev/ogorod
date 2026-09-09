import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { fetchForecast } from "@/features/geo/open-meteo"
import { hasFrostRisk } from "@/features/weather/codes"
import type { WeatherDay, WeatherSnapshot } from "@/features/weather/types"
import { getSession } from "@/lib/session"

const querySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  tz: z.string().min(1).max(80).optional(),
  unit: z.enum(["c", "f"]).optional(),
})

function at(values: number[] | undefined, index: number) {
  const value = values?.[index]
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const parsed = querySchema.safeParse({
    lat: request.nextUrl.searchParams.get("lat") ?? undefined,
    lng: request.nextUrl.searchParams.get("lng") ?? undefined,
    tz: request.nextUrl.searchParams.get("tz") ?? undefined,
    unit: request.nextUrl.searchParams.get("unit") ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_query" }, { status: 400 })
  }

  const unit = parsed.data.unit ?? "c"

  try {
    const forecast = await fetchForecast({
      latitude: parsed.data.lat,
      longitude: parsed.data.lng,
      timezone: parsed.data.tz,
      unit,
    })

    const days: WeatherDay[] = (forecast.daily?.time ?? []).map((date, index) => ({
      date,
      tMax: at(forecast.daily?.temperature_2m_max, index) ?? 0,
      tMin: at(forecast.daily?.temperature_2m_min, index) ?? 0,
      precipitation: at(forecast.daily?.precipitation_sum, index) ?? 0,
      weatherCode: at(forecast.daily?.weather_code, index) ?? 0,
      et0: at(forecast.daily?.et0_fao_evapotranspiration, index),
    }))

    const snapshot: WeatherSnapshot = {
      fetchedAt: new Date().toISOString(),
      timezone: forecast.timezone || parsed.data.tz || "auto",
      temperatureUnit: unit,
      current: {
        temperature: forecast.current?.temperature_2m ?? days[0]?.tMax ?? 0,
        weatherCode: forecast.current?.weather_code ?? days[0]?.weatherCode ?? 0,
        precipitation: forecast.current?.precipitation ?? 0,
      },
      daily: days,
      frost: hasFrostRisk(days),
    }

    return NextResponse.json(snapshot)
  } catch {
    return NextResponse.json({ error: "forecast_failed" }, { status: 502 })
  }
}
