"use client"

import * as React from "react"
import { format } from "date-fns"

import { tasks } from "@/lib/garden-data"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { dateFnsLocale, dayPickerLocale, interpolate } from "@/i18n/format"
import { localizeTask } from "@/i18n/localize"
import { useI18n } from "@/i18n/provider"
import { usePreferences } from "@/features/settings/provider"

function toDateKey(date: Date) {
  return format(date, "yyyy-MM-dd")
}

export function CalendarView() {
  const { locale, messages: m } = useI18n()
  const { prefs } = usePreferences()
  const [selected, setSelected] = React.useState<Date>(new Date(2026, 8, 8))
  const dayKey = toDateKey(selected)
  const dayTasks = tasks.filter((task) => task.date === dayKey)
  const marked = tasks.map((task) => new Date(`${task.date}T12:00:00`))

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          {m.pages.calendar.title}
        </h1>
        <p className="text-muted-foreground">{m.pages.calendar.description}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <Card className="w-full lg:w-fit">
          <CardHeader>
            <CardTitle>{m.calendar.careTitle}</CardTitle>
            <CardDescription>{m.calendar.careDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              locale={dayPickerLocale(locale)}
              weekStartsOn={prefs.garden.weekStart === "sunday" ? 0 : 1}
              selected={selected}
              onSelect={(date) => date && setSelected(date)}
              modifiers={{ task: marked }}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {format(selected, "d MMMM yyyy", { locale: dateFnsLocale(locale) })}
            </CardTitle>
            <CardDescription>
              {dayTasks.length > 0
                ? interpolate(m.calendar.tasksCount, { count: dayTasks.length })
                : m.calendar.noTasks}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {dayTasks.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>{m.calendar.freeTitle}</EmptyTitle>
                  <EmptyDescription>{m.calendar.freeDesc}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              dayTasks.map((task) => {
                const copy = localizeTask(m, task)
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                  >
                    <div>
                      <p className="font-medium">{copy.title}</p>
                      <p className="text-sm text-muted-foreground">{copy.plant}</p>
                    </div>
                    <Badge variant="secondary">{m.taskKind[task.kind]}</Badge>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
