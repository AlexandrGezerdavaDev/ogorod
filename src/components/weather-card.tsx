"use client"

import Link from "next/link"
import {
  CloudFogIcon,
  CloudIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSunIcon,
  SnowflakeIcon,
  SunIcon,
} from "lucide-react"

import { firstPlacedGarden } from "@/features/settings/preferences"
import { usePreferences } from "@/features/settings/provider"
import { weatherKind } from "@/features/weather/codes"
import type { WeatherKind } from "@/features/weather/types"
import { useWeather } from "@/features/weather/use-weather"
import { gardens } from "@/lib/garden-data"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useI18n } from "@/i18n/provider"

const weatherIcons: Record<WeatherKind, typeof SunIcon> = {
  clear: SunIcon,
  clouds: CloudSunIcon,
  fog: CloudFogIcon,
  rain: CloudRainIcon,
  snow: SnowflakeIcon,
  thunder: CloudLightningIcon,
  other: CloudIcon,
}

function formatTemp(value: number, unit: "c" | "f") {
  const rounded = Math.round(value)
  return unit === "f" ? `${rounded}°F` : `${rounded}°`
}

export function WeatherCard() {
  const { messages: m } = useI18n()
  const { prefs } = usePreferences()
  const placed = firstPlacedGarden(
    prefs,
    gardens.map((garden) => garden.id)
  )
  const weather = useWeather({
    gardenId: placed?.gardenId ?? null,
    latitude: placed?.place.latitude ?? null,
    longitude: placed?.place.longitude ?? null,
    timezone: placed?.place.timezone ?? "Europe/Kyiv",
    unit: prefs.garden.temperature,
  })

  const snapshot = weather.data
  const today = snapshot?.daily[0]
  const unit = snapshot?.temperatureUnit ?? prefs.garden.temperature

  if (!placed) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto shrink-0 text-muted-foreground"
        render={<Link href="/settings" />}
        nativeButton={false}
      >
        <CloudSunIcon data-icon="inline-start" />
        {m.home.weather.emptyTitle}
      </Button>
    )
  }

  if (weather.isPending && !snapshot) {
    return (
      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <Skeleton className="size-5 rounded-full" />
        <Skeleton className="h-5 w-10" />
        <Skeleton className="hidden h-4 w-16 sm:block" />
      </div>
    )
  }

  if (!snapshot) {
    return (
      <p className="ml-auto max-w-28 shrink-0 text-right text-xs text-muted-foreground">
        {m.home.weather.error}
      </p>
    )
  }

  const kind = weatherKind(snapshot.current.weatherCode)
  const Icon = weatherIcons[kind]
  const range = today
    ? `${Math.round(today.tMin)}°/${Math.round(today.tMax)}°`
    : null

  return (
    <div
      className="ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap"
      title={
        range
          ? `${m.home.weather.condition[kind]} · ${range} · ${m.home.weather.attribution}`
          : m.home.weather.attribution
      }
    >
      <Icon className="size-5 text-muted-foreground" aria-hidden />
      <span className="text-lg font-medium tabular-nums leading-none">
        {formatTemp(snapshot.current.temperature, unit)}
      </span>
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {m.home.weather.condition[kind]}
      </span>
      {range ? (
        <span className="hidden text-xs text-muted-foreground md:inline">
          {range}
        </span>
      ) : null}
      {snapshot.frost ? (
        <SnowflakeIcon className="size-3.5 text-destructive" aria-label={m.home.weather.frost} />
      ) : null}
    </div>
  )
}
