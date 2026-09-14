"use client"

import { format } from "date-fns"
import { DropletIcon, SproutIcon } from "lucide-react"

import {
  parseCareDay,
  todayKey,
  type CareKind,
} from "@/features/plants/care"
import { usePlantCare } from "@/features/plants/use-plant-care"
import { cn } from "@/lib/utils"
import { dateFnsLocale, interpolate } from "@/i18n/format"
import { useI18n } from "@/i18n/provider"

function careDateLabel(
  day: string | undefined,
  locale: Parameters<typeof dateFnsLocale>[0],
  today: string,
  never: string
) {
  if (!day) {
    return never
  }
  if (day === todayKey()) {
    return today
  }
  const date = parseCareDay(day)
  if (!date) {
    return never
  }
  return format(date, "d MMM", { locale: dateFnsLocale(locale) })
}

export function PlantCareActions({
  plantId,
  name,
  compact = false,
}: {
  plantId: string
  name: string
  compact?: boolean
}) {
  const { locale, messages: m } = useI18n()
  const { isDone, lastDate, toggle } = usePlantCare()

  return (
    <div className={cn("flex", compact ? "shrink-0 gap-1" : "w-full gap-2 md:w-auto md:gap-1")}>
      <CareButton
        kind="water"
        compact={compact}
        pressed={isDone(plantId, "water")}
        label={m.plants.markWater}
        dateLabel={careDateLabel(
          lastDate(plantId, "water"),
          locale,
          m.plants.careToday,
          m.plants.careNever
        )}
        ariaLabel={interpolate(
          isDone(plantId, "water")
            ? m.plants.unmarkWaterAria
            : m.plants.markWaterAria,
          { name }
        )}
        title={
          lastDate(plantId, "water")
            ? interpolate(m.plants.lastWater, {
                date: careDateLabel(
                  lastDate(plantId, "water"),
                  locale,
                  m.plants.careToday,
                  m.plants.careNever
                ),
              })
            : m.plants.careNever
        }
        onClick={() => toggle(plantId, "water")}
      />
      <CareButton
        kind="feed"
        compact={compact}
        pressed={isDone(plantId, "feed")}
        label={m.plants.markFeed}
        dateLabel={careDateLabel(
          lastDate(plantId, "feed"),
          locale,
          m.plants.careToday,
          m.plants.careNever
        )}
        ariaLabel={interpolate(
          isDone(plantId, "feed")
            ? m.plants.unmarkFeedAria
            : m.plants.markFeedAria,
          { name }
        )}
        title={
          lastDate(plantId, "feed")
            ? interpolate(m.plants.lastFeed, {
                date: careDateLabel(
                  lastDate(plantId, "feed"),
                  locale,
                  m.plants.careToday,
                  m.plants.careNever
                ),
              })
            : m.plants.careNever
        }
        onClick={() => toggle(plantId, "feed")}
      />
    </div>
  )
}

function CareButton({
  kind,
  compact,
  pressed,
  label,
  dateLabel,
  ariaLabel,
  title,
  onClick,
}: {
  kind: CareKind
  compact: boolean
  pressed: boolean
  label: string
  dateLabel: string
  ariaLabel: string
  title: string
  onClick: () => void
}) {
  const Icon = kind === "water" ? DropletIcon : SproutIcon
  const active =
    kind === "water"
      ? "text-sky-700 dark:text-sky-300"
      : "text-amber-800 dark:text-amber-300"

  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={ariaLabel}
      title={title}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      className={cn(
        "inline-flex items-center outline-none transition-colors",
        "hover:bg-muted/80 focus-visible:ring-3 focus-visible:ring-ring/50",
        compact
          ? "flex-col gap-1 rounded-lg px-1 py-1"
          : "min-w-0 flex-1 flex-col gap-1 rounded-xl px-2 py-2 md:flex-none md:flex-row md:gap-1.5 md:rounded-full md:px-2 md:py-1"
      )}
    >
      {compact ? (
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-full border transition-colors",
            pressed
              ? kind === "water"
                ? "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
              : "border-border text-muted-foreground"
          )}
        >
          <Icon className={cn("size-4", pressed && "fill-current")} />
        </span>
      ) : (
        <Icon
          className={cn(
            "size-6 md:size-3.5",
            pressed ? cn("fill-current", active) : "text-muted-foreground"
          )}
        />
      )}
      {compact ? null : <span className="sr-only">{label}</span>}
      <span
        className={cn(
          "leading-none text-muted-foreground",
          compact ? "text-[0.7rem]" : "text-xs"
        )}
      >
        {dateLabel}
      </span>
    </button>
  )
}
