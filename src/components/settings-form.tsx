"use client"

import * as React from "react"
import { LogOutIcon, RefreshCwIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { authClient } from "@/features/auth/client"
import { usePreferences } from "@/features/settings/provider"
import {
  PREFERENCES_KEY,
  areaUnits,
  dateFormats,
  massUnits,
  temperatureUnits,
  volumeUnits,
  weekStarts,
  type AreaUnit,
  type DateFormat,
  type MassUnit,
  type TemperatureUnit,
  type VolumeUnit,
  type WeekStart,
} from "@/features/settings/preferences"
import { syncNow } from "@/features/sync/engine"
import { clearLocalData, exportLocalData, LAST_SYNC_KEY } from "@/features/sync/status"
import { useSyncStatus } from "@/features/sync/use-sync-status"
import { gardens } from "@/lib/garden-data"
import { interpolate, formatRelativePast } from "@/i18n/format"
import { localizeGarden } from "@/i18n/localize"
import { useI18n } from "@/i18n/provider"
import { InstallPrompt } from "@/components/install-prompt"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { PlaceCombobox } from "@/components/place-combobox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

function pickValue<T extends string>(value: string[], fallback: T): T {
  return (value[0] as T | undefined) ?? fallback
}

export function SettingsForm() {
  return (
    <div className="flex flex-col gap-4">
      <ProfileCard />
      <NotificationsCard />
      <GardenCard />
      <AppearanceCard />
      <InstallPrompt />
      <DataCard />
      <LogoutCard />
    </div>
  )
}

function ProfileCard() {
  const { messages: m } = useI18n()
  const { data: session } = authClient.useSession()
  const name = session?.user.name ?? ""
  const email = session?.user.email ?? ""
  const image = session?.user.image ?? ""
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
  const [edited, setEdited] = React.useState<string | null>(null)
  const draft = edited ?? name

  async function saveName() {
    const next = draft.trim()
    if (!next || next === name) {
      setEdited(null)
      return
    }
    const { error } = await authClient.updateUser({ name: next })
    if (error) {
      toast.error(m.settings.profile.saveFailed)
      return
    }
    setEdited(null)
    toast.success(m.settings.profile.saved)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.settings.profile.title}</CardTitle>
        <CardDescription>{m.settings.profile.desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="profile-name">{m.settings.profile.name}</FieldLabel>
            <Input
              id="profile-name"
              value={draft}
              onChange={(event) => setEdited(event.target.value)}
              onBlur={() => {
                void saveName()
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="profile-email">{m.settings.profile.email}</FieldLabel>
            <Input id="profile-email" value={email} readOnly />
          </Field>
          <Field>
            <FieldLabel>{m.settings.profile.photo}</FieldLabel>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={image} alt={name} />
                <AvatarFallback>{initials || "OG"}</AvatarFallback>
              </Avatar>
              <FieldDescription>{m.settings.profile.photoDesc}</FieldDescription>
            </div>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

function NotificationsCard() {
  const { messages: m } = useI18n()
  const { prefs, setPrefs } = usePreferences()
  const notes = prefs.notifications
  const muted = notes.dnd

  function patch(
    updater: (current: typeof notes) => typeof notes
  ) {
    setPrefs((current) => ({
      ...current,
      notifications: updater(current.notifications),
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.settings.notifications.title}</CardTitle>
        <CardDescription>{m.settings.notifications.desc}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="dnd">{m.settings.notifications.dnd}</FieldLabel>
            <FieldDescription>{m.settings.notifications.dndDesc}</FieldDescription>
          </FieldContent>
          <Switch
            id="dnd"
            checked={notes.dnd}
            onCheckedChange={(checked) =>
              patch((current) => ({ ...current, dnd: checked }))
            }
          />
        </Field>
        <Separator />
        <FieldSet data-disabled={muted || undefined}>
          <FieldLegend variant="label">{m.settings.notifications.care}</FieldLegend>
          <FieldGroup>
            <NoticeSwitch
              id="care-water"
              label={m.settings.notifications.water}
              checked={notes.care.water}
              disabled={muted}
              onCheckedChange={(checked) =>
                patch((current) => ({
                  ...current,
                  care: { ...current.care, water: checked },
                }))
              }
            />
            <NoticeSwitch
              id="care-feed"
              label={m.settings.notifications.feed}
              checked={notes.care.feed}
              disabled={muted}
              onCheckedChange={(checked) =>
                patch((current) => ({
                  ...current,
                  care: { ...current.care, feed: checked },
                }))
              }
            />
            <NoticeSwitch
              id="care-disease"
              label={m.settings.notifications.disease}
              checked={notes.care.disease}
              disabled={muted}
              onCheckedChange={(checked) =>
                patch((current) => ({
                  ...current,
                  care: { ...current.care, disease: checked },
                }))
              }
            />
            <NoticeSwitch
              id="care-other"
              label={m.settings.notifications.other}
              checked={notes.care.other}
              disabled={muted}
              onCheckedChange={(checked) =>
                patch((current) => ({
                  ...current,
                  care: { ...current.care, other: checked },
                }))
              }
            />
          </FieldGroup>
        </FieldSet>
        <FieldSet data-disabled={muted || undefined}>
          <FieldLegend variant="label">{m.settings.notifications.seasonal}</FieldLegend>
          <FieldGroup>
            <NoticeSwitch
              id="season-sow"
              label={m.settings.notifications.sow}
              checked={notes.seasonal.sow}
              disabled={muted}
              onCheckedChange={(checked) =>
                patch((current) => ({
                  ...current,
                  seasonal: { ...current.seasonal, sow: checked },
                }))
              }
            />
            <NoticeSwitch
              id="season-plant"
              label={m.settings.notifications.plant}
              checked={notes.seasonal.plant}
              disabled={muted}
              onCheckedChange={(checked) =>
                patch((current) => ({
                  ...current,
                  seasonal: { ...current.seasonal, plant: checked },
                }))
              }
            />
            <NoticeSwitch
              id="season-transplant"
              label={m.settings.notifications.transplant}
              checked={notes.seasonal.transplant}
              disabled={muted}
              onCheckedChange={(checked) =>
                patch((current) => ({
                  ...current,
                  seasonal: { ...current.seasonal, transplant: checked },
                }))
              }
            />
            <NoticeSwitch
              id="season-harvest"
              label={m.settings.notifications.harvest}
              checked={notes.seasonal.harvest}
              disabled={muted}
              onCheckedChange={(checked) =>
                patch((current) => ({
                  ...current,
                  seasonal: { ...current.seasonal, harvest: checked },
                }))
              }
            />
          </FieldGroup>
        </FieldSet>
        <FieldSet data-disabled={muted || undefined}>
          <FieldLegend variant="label">{m.settings.notifications.time}</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="morning">{m.settings.notifications.morning}</FieldLabel>
              <Input
                id="morning"
                type="time"
                value={notes.morning}
                disabled={muted}
                onChange={(event) =>
                  patch((current) => ({ ...current, morning: event.target.value }))
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="evening">{m.settings.notifications.evening}</FieldLabel>
              <Input
                id="evening"
                type="time"
                value={notes.evening}
                disabled={muted}
                onChange={(event) =>
                  patch((current) => ({ ...current, evening: event.target.value }))
                }
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}

function NoticeSwitch({
  id,
  label,
  checked,
  disabled,
  onCheckedChange,
}: {
  id: string
  label: string
  checked: boolean
  disabled: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <Field orientation="horizontal" data-disabled={disabled || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </Field>
  )
}

function GardenCard() {
  const { messages: m } = useI18n()
  const { prefs, setPrefs, placeFor, setPlace } = usePreferences()
  const [gardenId, setGardenId] = React.useState<string>(gardens[0]?.id ?? "ogorod")
  const place = placeFor(gardenId)
  const g = prefs.garden

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.settings.garden.title}</CardTitle>
        <CardDescription>{m.settings.garden.desc}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field>
          <FieldLabel id="garden-select">{m.settings.garden.selectGarden}</FieldLabel>
          <ToggleGroup
            value={[gardenId]}
            onValueChange={(value) => {
              const next = value[0]
              if (next) {
                setGardenId(next)
              }
            }}
            spacing={2}
            className="flex-wrap"
            aria-labelledby="garden-select"
          >
            {gardens.map((garden) => (
              <ToggleGroupItem key={garden.id} value={garden.id}>
                {localizeGarden(m, garden).name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>
        <FieldSet>
          <FieldLegend variant="label">{m.settings.garden.units}</FieldLegend>
          <FieldGroup>
            <UnitToggle
              label={m.settings.garden.temperature}
              value={g.temperature}
              options={temperatureUnits.map((unit) => ({
                value: unit,
                label: unit === "c" ? m.settings.garden.unitC : m.settings.garden.unitF,
              }))}
              onChange={(value) =>
                setPrefs((current) => ({
                  ...current,
                  garden: { ...current.garden, temperature: value as TemperatureUnit },
                }))
              }
            />
            <UnitToggle
              label={m.settings.garden.area}
              value={g.area}
              options={areaUnits.map((unit) => ({
                value: unit,
                label:
                  unit === "m2"
                    ? m.settings.garden.unitM2
                    : unit === "sotka"
                      ? m.settings.garden.unitSotka
                      : m.settings.garden.unitHa,
              }))}
              onChange={(value) =>
                setPrefs((current) => ({
                  ...current,
                  garden: { ...current.garden, area: value as AreaUnit },
                }))
              }
            />
            <UnitToggle
              label={m.settings.garden.mass}
              value={g.mass}
              options={massUnits.map((unit) => ({
                value: unit,
                label: unit === "kg" ? m.settings.garden.unitKg : m.settings.garden.unitG,
              }))}
              onChange={(value) =>
                setPrefs((current) => ({
                  ...current,
                  garden: { ...current.garden, mass: value as MassUnit },
                }))
              }
            />
            <UnitToggle
              label={m.settings.garden.volume}
              value={g.volume}
              options={volumeUnits.map((unit) => ({
                value: unit,
                label: unit === "l" ? m.settings.garden.unitL : m.settings.garden.unitMl,
              }))}
              onChange={(value) =>
                setPrefs((current) => ({
                  ...current,
                  garden: { ...current.garden, volume: value as VolumeUnit },
                }))
              }
            />
            <Field orientation="horizontal">
              <FieldLabel htmlFor="date-format">{m.settings.garden.dateFormat}</FieldLabel>
              <NativeSelect
                id="date-format"
                value={g.dateFormat}
                onChange={(event) =>
                  setPrefs((current) => ({
                    ...current,
                    garden: {
                      ...current.garden,
                      dateFormat: event.target.value as DateFormat,
                    },
                  }))
                }
              >
                {dateFormats.map((format) => (
                  <NativeSelectOption key={format} value={format}>
                    {format === "dmy"
                      ? m.settings.garden.dateDmy
                      : format === "mdy"
                        ? m.settings.garden.dateMdy
                        : m.settings.garden.dateYmd}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <UnitToggle
              label={m.settings.garden.weekStart}
              value={g.weekStart}
              options={weekStarts.map((day) => ({
                value: day,
                label:
                  day === "monday"
                    ? m.settings.garden.weekMonday
                    : m.settings.garden.weekSunday,
              }))}
              onChange={(value) =>
                setPrefs((current) => ({
                  ...current,
                  garden: { ...current.garden, weekStart: value as WeekStart },
                }))
              }
            />
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">{m.settings.garden.location}</FieldLegend>
          <FieldDescription>{m.settings.garden.locationDesc}</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="garden-city">{m.settings.garden.city}</FieldLabel>
              <PlaceCombobox
                id="garden-city"
                place={place}
                onChange={(next) => setPlace(gardenId, next)}
              />
              {place.city ? (
                <FieldDescription>
                  {interpolate(m.settings.garden.timezoneHint, {
                    zone: place.timezone,
                  })}
                </FieldDescription>
              ) : null}
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}

function UnitToggle({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  const labelId = React.useId()
  return (
    <Field orientation="horizontal">
      <FieldLabel id={labelId}>{label}</FieldLabel>
      <ToggleGroup
        value={[value]}
        onValueChange={(next) => {
          const picked = pickValue(next, value)
          if (picked !== value) {
            onChange(picked)
          }
        }}
        spacing={2}
        className="flex-wrap"
        aria-labelledby={labelId}
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Field>
  )
}

function AppearanceCard() {
  const { theme, setTheme } = useTheme()
  const { messages: m } = useI18n()
  const { prefs, setPrefs } = usePreferences()
  const isClient = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.settings.appearance.title}</CardTitle>
        <CardDescription>{m.settings.appearance.desc}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field orientation="horizontal">
          <FieldLabel id="theme-label">{m.settings.appearance.theme}</FieldLabel>
          {isClient ? (
            <ToggleGroup
              value={[theme ?? "system"]}
              onValueChange={(value) => {
                const next = value[0]
                if (next) {
                  setTheme(next)
                }
              }}
              spacing={2}
              aria-labelledby="theme-label"
            >
              <ToggleGroupItem value="light">
                {m.settings.appearance.themeLight}
              </ToggleGroupItem>
              <ToggleGroupItem value="dark">
                {m.settings.appearance.themeDark}
              </ToggleGroupItem>
              <ToggleGroupItem value="system">
                {m.settings.appearance.themeSystem}
              </ToggleGroupItem>
            </ToggleGroup>
          ) : (
            <div className="h-8 w-56 rounded-lg bg-muted" />
          )}
        </Field>
        <Field>
          <FieldContent>
            <FieldLabel id="language-label">{m.settings.appearance.language}</FieldLabel>
            <FieldDescription>{m.settings.appearance.languageDesc}</FieldDescription>
          </FieldContent>
          <LocaleSwitcher labelledBy="language-label" />
        </Field>
        <NoticeSwitch
          id="show-latin"
          label={m.settings.appearance.showLatin}
          checked={prefs.appearance.showLatin}
          disabled={false}
          onCheckedChange={(checked) =>
            setPrefs((current) => ({
              ...current,
              appearance: { ...current.appearance, showLatin: checked },
            }))
          }
        />
        <NoticeSwitch
          id="show-units"
          label={m.settings.appearance.showUnits}
          checked={prefs.appearance.showUnits}
          disabled={false}
          onCheckedChange={(checked) =>
            setPrefs((current) => ({
              ...current,
              appearance: { ...current.appearance, showUnits: checked },
            }))
          }
        />
      </CardContent>
    </Card>
  )
}

function DataCard() {
  const { locale, messages: m } = useI18n()
  const { prefs, setPrefs } = usePreferences()
  const { lastSyncedAt, pending, conflicts, online, refresh } = useSyncStatus()
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [syncing, setSyncing] = React.useState(false)

  const when = lastSyncedAt
    ? interpolate(m.settings.data.lastSync, {
        when: formatRelativePast(locale, lastSyncedAt),
      })
    : m.settings.data.neverSync

  async function onExport() {
    const payload = await exportLocalData()
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ogorod-data-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success(m.settings.data.exported)
  }

  async function onImport(file: File) {
    try {
      const parsed = JSON.parse(await file.text()) as {
        preferences?: string | null
        lastSyncedAt?: string | null
      }
      if (typeof parsed.preferences === "string") {
        window.localStorage.setItem(PREFERENCES_KEY, parsed.preferences)
      }
      if (typeof parsed.lastSyncedAt === "string") {
        window.localStorage.setItem(LAST_SYNC_KEY, parsed.lastSyncedAt)
      }
      toast.success(m.settings.data.imported)
    } catch {
      toast.error(m.settings.data.importFailed)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.settings.data.title}</CardTitle>
        <CardDescription>{m.settings.data.desc}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field>
          <FieldLabel>{m.settings.data.status}</FieldLabel>
          <FieldDescription>
            {online ? m.settings.data.online : m.settings.data.offline}
            {" · "}
            {when}
            {pending > 0
              ? ` · ${interpolate(m.settings.data.pending, { count: pending })}`
              : ""}
          </FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="auto-sync">{m.settings.data.auto}</FieldLabel>
            <FieldDescription>{m.settings.data.autoDesc}</FieldDescription>
          </FieldContent>
          <Switch
            id="auto-sync"
            checked={prefs.sync.auto}
            onCheckedChange={(checked) =>
              setPrefs((current) => ({
                ...current,
                sync: { ...current.sync, auto: checked },
              }))
            }
          />
        </Field>
        <Button
          variant="outline"
          disabled={syncing || !online}
          onClick={async () => {
            setSyncing(true)
            await syncNow()
            await refresh()
            setSyncing(false)
            toast.success(m.settings.data.synced)
          }}
        >
          <RefreshCwIcon data-icon="inline-start" />
          {m.settings.data.now}
        </Button>
        {conflicts > 0 ? (
          <Alert>
            <AlertTitle>{m.settings.data.conflicts}</AlertTitle>
            <AlertDescription>
              {interpolate(m.settings.data.conflictsCount, { count: conflicts })}
            </AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-muted-foreground">{m.settings.data.conflictsNone}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) {
                void onImport(file)
              }
              event.target.value = ""
            }}
          />
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            {m.settings.data.import}
          </Button>
          <Button variant="outline" onClick={() => void onExport()}>
            {m.settings.data.export}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}>
              {m.settings.data.clear}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{m.settings.data.clearTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {m.settings.data.clearDesc}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{m.settings.data.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={async () => {
                    await clearLocalData()
                    window.location.reload()
                  }}
                >
                  {m.settings.data.clear}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

function LogoutCard() {
  const router = useRouter()
  const { messages: m } = useI18n()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.settings.profile.account}</CardTitle>
        <CardDescription>{m.settings.profile.accountDesc}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.replace("/login")
                  router.refresh()
                },
              },
            })
          }
        >
          <LogOutIcon data-icon="inline-start" />
          {m.settings.logout}
        </Button>
      </CardContent>
    </Card>
  )
}
