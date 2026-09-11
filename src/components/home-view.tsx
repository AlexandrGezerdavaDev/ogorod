"use client"

import Link from "next/link"
import {
  CalendarDaysIcon,
  DropletsIcon,
  LeafIcon,
  ScanLineIcon,
  SproutIcon,
  SunIcon,
} from "lucide-react"
import { format } from "date-fns"

import { isAgedSeedLot, tasks } from "@/lib/garden-data"
import { usePlantings, useSeedLots } from "@/features/farm"
import { usePlantCare } from "@/features/plants/use-plant-care"
import { Button } from "@/components/ui/button"
import { PlantCareActions } from "@/components/plant-care-actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { interpolate, dateFnsLocale } from "@/i18n/format"
import { useI18n } from "@/i18n/provider"
import { WeatherCard } from "@/components/weather-card"

const todayTasks = tasks.filter((task) => task.date === "2026-09-08")

export function HomeView({ name }: { name: string | null }) {
  const { locale, messages: m } = useI18n()
  const { lots } = useSeedLots()
  const { plantings } = usePlantings()
  const { isDone } = usePlantCare()
  const agedLots = lots.filter((lot) => isAgedSeedLot(lot.packedAt))
  const needWater = plantings.filter((plant) => !isDone(plant.id, "water")).length
  const date = format(new Date(2026, 8, 8), "d MMMM", {
    locale: dateFnsLocale(locale),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-heading text-2xl font-medium tracking-tight">
            {name
              ? interpolate(m.home.greetingName, { name })
              : m.home.greeting}
          </h1>
          <p className="truncate text-muted-foreground">
            {interpolate(m.home.todayLine, { date, count: needWater })}
          </p>
        </div>
        <WeatherCard />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={m.home.statPlants}
          value={String(plantings.length)}
          hint={m.home.statPlantsHint}
          icon={LeafIcon}
        />
        <StatCard
          title={m.home.statWater}
          value={String(needWater)}
          hint={m.home.statWaterHint}
          icon={DropletsIcon}
        />
        <StatCard
          title={m.home.statCalendar}
          value={String(todayTasks.length)}
          hint={m.home.statCalendarHint}
          icon={CalendarDaysIcon}
        />
        <StatCard
          title={m.home.statSeeds}
          value={String(lots.length)}
          hint={
            agedLots.length > 0
              ? interpolate(m.home.statSeedsAged, { count: agedLots.length })
              : m.home.statSeedsHint
          }
          icon={SproutIcon}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{m.home.attentionTitle}</CardTitle>
            <CardDescription>{m.home.attentionDesc}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {plantings.length === 0 ? (
              <p className="text-sm text-muted-foreground">{m.plants.emptyDesc}</p>
            ) : (
              plantings.slice(0, 4).map((plant) => {
                const title = plant.speciesName
                  ? `${plant.speciesName} · ${plant.cultivarName}`
                  : plant.cultivarName
                return (
                  <div
                    key={plant.id}
                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{title}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {plant.bed}
                        {" · "}
                        {interpolate(m.plants.quantityCount, {
                          count: plant.quantity,
                        })}
                      </p>
                    </div>
                    <PlantCareActions plantId={plant.id} name={title} compact />
                  </div>
                )
              })
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" render={<Link href="/plants" />} nativeButton={false}>
              {m.home.allPlants}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{m.home.quickTitle}</CardTitle>
            <CardDescription>{m.home.quickDesc}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button render={<Link href="/scan" />} nativeButton={false}>
              <ScanLineIcon data-icon="inline-start" />
              {m.home.scanPlant}
            </Button>
            <Button variant="outline" render={<Link href="/calendar" />} nativeButton={false}>
              <SunIcon data-icon="inline-start" />
              {m.home.openCalendar}
            </Button>
            <Button variant="outline" render={<Link href="/seeds" />} nativeButton={false}>
              <SproutIcon data-icon="inline-start" />
              {m.home.openSeeds}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string
  value: string
  hint: string
  icon: typeof LeafIcon
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <Icon />
          {title}
        </CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}
