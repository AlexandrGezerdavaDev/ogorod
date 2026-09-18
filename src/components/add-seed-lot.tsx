"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { ImagePlusIcon, PlusIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/features/auth/client"
import { createSeedLot, type SeedUnit } from "@/features/farm"
import { useKbSpecies } from "@/features/kb/use-kb-species"
import {
  catalogCommonName,
  dateFnsLocale,
  formatSeedQuantityLabel,
  interpolate,
} from "@/i18n/format"
import { useI18n } from "@/i18n/provider"
import { compressImageFile } from "@/lib/compress-image"
import { cn } from "@/lib/utils"
import { SeedLotQrLabel, type SeedLotQrData } from "@/components/seed-lot-qr-label"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

function todayIsoDate() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${month}-${day}`
}

export function AddSeedLot({ className }: { className?: string }) {
  const { locale, messages: m } = useI18n()
  const { data: session } = authClient.useSession()
  const { data: kb } = useKbSpecies()
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string>()
  const [unit, setUnit] = React.useState<SeedUnit>("шт")
  const [photoUrl, setPhotoUrl] = React.useState<string | null>(null)
  const [photoPending, setPhotoPending] = React.useState(false)
  const [created, setCreated] = React.useState<SeedLotQrData | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const species = kb?.species ?? []
  const organizationId = session?.session.activeOrganizationId

  function resetFormState() {
    setError(undefined)
    setUnit("шт")
    setPending(false)
    setPhotoUrl(null)
    setPhotoPending(false)
    setCreated(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function onPhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setPhotoPending(true)
    setError(undefined)
    try {
      const compressed = await compressImageFile(file)
      setPhotoUrl(compressed)
    } catch {
      setError(m.seeds.photoFailed)
      setPhotoUrl(null)
    } finally {
      setPhotoPending(false)
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)

    if (!organizationId) {
      setError(m.seeds.saveFailed)
      return
    }

    const form = new FormData(event.currentTarget)
    const speciesId = String(form.get("speciesId") ?? "").trim()
    const name = String(form.get("name") ?? "").trim()
    const quantity = Number(form.get("quantity"))
    const packedAt = String(form.get("packedAt") ?? "").trim()

    if (!speciesId) {
      setError(m.seeds.speciesRequired)
      return
    }
    if (!name) {
      setError(m.seeds.cultivarRequired)
      return
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError(m.seeds.quantityInvalid)
      return
    }

    setPending(true)
    try {
      const id = await createSeedLot({
        organizationId,
        speciesId,
        name,
        quantity,
        unit,
        packedAt: packedAt || null,
        photoUrl,
      })
      const speciesRow = species.find((item) => item.id === speciesId)
      const title = speciesRow
        ? `${catalogCommonName(locale, speciesRow)} · ${name}`
        : name
      const packedDate = packedAt ? parseISO(packedAt) : null
      const packedValid = packedDate && !Number.isNaN(packedDate.getTime())
      const packedLabel = packedValid
        ? interpolate(m.seeds.packed, {
            date: format(packedDate, "d MMMM yyyy", {
              locale: dateFnsLocale(locale),
            }),
          })
        : m.seeds.packedUnknown
      setCreated({
        id,
        title,
        meta: `${formatSeedQuantityLabel(m, quantity, unit)} · ${packedLabel}`,
      })
      toast.success(m.seeds.saved)
    } catch {
      setError(m.seeds.saveFailed)
    } finally {
      setPending(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          resetFormState()
        }
      }}
    >
      <SheetTrigger
        render={
          <Button
            size="lg"
            className={cn("min-h-12 gap-2 px-5 text-base [&_svg:not([class*='size-'])]:size-5", className)}
          />
        }
      >
        <PlusIcon data-icon="inline-start" />
        {m.seeds.add}
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{created ? m.seeds.qrTitle : m.seeds.addTitle}</SheetTitle>
          <SheetDescription>
            {created ? m.seeds.qrDesc : m.seeds.addDesc}
          </SheetDescription>
        </SheetHeader>
        {created ? (
          <>
            <div className="px-4">
              <SeedLotQrLabel lot={created} />
            </div>
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {m.seeds.qrDone}
              </Button>
            </SheetFooter>
          </>
        ) : (
        <form
          key={open ? "open" : "closed"}
          className="flex flex-col gap-4"
          onSubmit={(event) => void onSubmit(event)}
        >
          <FieldGroup className="px-4">
            <Field>
              <FieldLabel>{m.seeds.photo}</FieldLabel>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(event) => void onPhotoChange(event)}
              />
              {photoUrl ? (
                <div className="relative overflow-hidden rounded-xl bg-muted">
                  {/* Preview of the just-picked plant photo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt={m.seeds.photoPreviewAlt}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPhotoUrl(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                    aria-label={m.seeds.photoRemove}
                  >
                    <XIcon />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto min-h-24 w-full flex-col gap-2 py-6"
                  disabled={photoPending}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photoPending ? (
                    <Spinner />
                  ) : (
                    <ImagePlusIcon className="size-6 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">
                    {photoPending ? m.seeds.photoProcessing : m.seeds.photoAdd}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {m.seeds.photoHint}
                  </span>
                </Button>
              )}
            </Field>
            <Field data-invalid={error === m.seeds.speciesRequired || undefined}>
              <FieldLabel htmlFor="seed-species">{m.seeds.species}</FieldLabel>
              {species.length === 0 ? (
                <p className="text-sm text-muted-foreground">{m.seeds.noCatalog}</p>
              ) : (
                <NativeSelect
                  id="seed-species"
                  name="speciesId"
                  className="w-full"
                  required
                  aria-invalid={error === m.seeds.speciesRequired || undefined}
                >
                  <NativeSelectOption value="">
                    {m.seeds.speciesPlaceholder}
                  </NativeSelectOption>
                  {species.map((item) => (
                    <NativeSelectOption key={item.id} value={item.id}>
                      {catalogCommonName(locale, item)}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            </Field>
            <Field data-invalid={error === m.seeds.cultivarRequired || undefined}>
              <FieldLabel htmlFor="seed-cultivar">{m.seeds.cultivar}</FieldLabel>
              <Input
                id="seed-cultivar"
                name="name"
                autoComplete="off"
                required
                placeholder={m.seeds.cultivarPlaceholder}
                aria-invalid={error === m.seeds.cultivarRequired || undefined}
              />
            </Field>
            <Field data-invalid={error === m.seeds.quantityInvalid || undefined}>
              <FieldLabel htmlFor="seed-quantity">{m.seeds.quantity}</FieldLabel>
              <Input
                id="seed-quantity"
                name="quantity"
                inputMode="decimal"
                type="number"
                min="0"
                step="any"
                required
                aria-invalid={error === m.seeds.quantityInvalid || undefined}
              />
            </Field>
            <Field>
              <FieldLabel id="seed-unit">{m.seeds.unit}</FieldLabel>
              <ToggleGroup
                value={[unit]}
                onValueChange={(value) => {
                  const next = value[0]
                  if (next === "шт" || next === "г") {
                    setUnit(next)
                  }
                }}
                spacing={2}
                aria-labelledby="seed-unit"
              >
                <ToggleGroupItem value="шт">{m.seeds.unitPcs}</ToggleGroupItem>
                <ToggleGroupItem value="г">{m.seeds.unitG}</ToggleGroupItem>
              </ToggleGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="seed-packed">{m.seeds.packedAt}</FieldLabel>
              <Input
                id="seed-packed"
                name="packedAt"
                type="date"
                defaultValue={todayIsoDate()}
              />
            </Field>
            {error ? <FieldError>{error}</FieldError> : null}
          </FieldGroup>
          <SheetFooter>
            <Button type="submit" disabled={pending || photoPending || species.length === 0}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {m.seeds.save}
            </Button>
          </SheetFooter>
        </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
