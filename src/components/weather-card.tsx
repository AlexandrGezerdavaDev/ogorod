"use client"

import Link from "next/link"
import { CloudSunIcon, SnowflakeIcon } from "lucide-react"

import { firstPlacedGarden } from "@/features/settings/preferences"
import { usePreferences } from "@/features/settings/provider"
import { weatherKind } from "@/features/weather/codes"
import { useWeather } from "@/features/weather/use-weather"
import { formatPlaceLabel } from "@/features/geo/types"
import { gardens } from "@/lib/garden-data"
import { formatRelativePast, interpolate } from "@/i18n/format"
import { useI18n } from "@/i18n/provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"

function formatTemp(value: number, unit: "c" | "f") {
  const rounded = Math.round(value)
  return unit === "f" ? `${rounded}°F` : `${rounded}°C`
}

function formatMm(value: number, unit: string) {
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${unit}`
}

export function WeatherCard() {
  const { locale, messages: m } = useI18n()
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
  const placeLabel = placed
    ? formatPlaceLabel({
        city: placed.place.city,
        region: placed.place.region,
        country: placed.place.country,
      })
    : ""

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.home.weather.title}</CardTitle>
        <CardDescription>
          {placeLabel || m.home.weather.emptyTitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!placed ? (
          <Empty className="border py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CloudSunIcon />
              </EmptyMedia>
              <EmptyTitle>{m.home.weather.emptyTitle}</EmptyTitle>
              <EmptyDescription>{m.home.weather.emptyDesc}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/settings" />}
                nativeButton={false}
              >
                {m.home.weather.openSettings}
              </Button>
            </EmptyContent>
          </Empty>
        ) : weather.isPending && !snapshot ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : snapshot ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-3xl font-medium tracking-tight">
                  {formatTemp(snapshot.current.temperature, unit)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {m.home.weather.condition[weatherKind(snapshot.current.weatherCode)]}
                </p>
              </div>
              <Badge variant={snapshot.frost ? "destructive" : "secondary"}>
                {snapshot.frost ? (
                  <SnowflakeIcon />
                ) : null}
                {snapshot.frost ? m.home.weather.frost : m.home.weather.frostNone}
              </Badge>
            </div>
            {today ? (
              <div className="flex flex-col gap-1 text-sm">
                <p>
                  {m.home.weather.today}
                  {": "}
                  {formatTemp(today.tMin, unit)}
                  {" / "}
                  {formatTemp(today.tMax, unit)}
                </p>
                <p className="text-muted-foreground">
                  {m.home.weather.precipitation}
                  {": "}
                  {formatMm(today.precipitation, m.home.weather.mm)}
                  {today.et0 != null
                    ? ` · ${m.home.weather.et0} ${formatMm(today.et0, m.home.weather.mm)}`
                    : ""}
                </p>
              </div>
            ) : null}
            {snapshot.fromCache ? (
              <p className="text-xs text-muted-foreground">
                {interpolate(m.home.weather.stale, {
                  when: formatRelativePast(locale, new Date(snapshot.fetchedAt)),
                })}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{m.home.weather.error}</p>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">{m.home.weather.attribution}</p>
      </CardFooter>
    </Card>
  )
}
