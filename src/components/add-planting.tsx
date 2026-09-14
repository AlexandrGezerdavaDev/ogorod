"use client"

import * as React from "react"
import { ImagePlusIcon, PlusIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/features/auth/client"
import { createPlanting, useSpaces } from "@/features/farm"
import { useKbSpecies } from "@/features/kb/use-kb-species"
import { catalogCommonName } from "@/i18n/format"
import { useI18n } from "@/i18n/provider"
import { compressImageFile } from "@/lib/compress-image"
import { cn } from "@/lib/utils"
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
import { SpaceFormSheet } from "@/components/space-form"

function todayIsoDate() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${month}-${day}`
}

export function AddPlanting({
  className,
  defaultFieldId,
}: {
  className?: string
  defaultFieldId?: string | null
}) {
  const { locale, messages: m } = useI18n()
  const { data: session } = authClient.useSession()
  const { data: kb } = useKbSpecies()
  const [open, setOpen] = React.useState(false)
  const [spaceOpen, setSpaceOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string>()
  const [photoUrl, setPhotoUrl] = React.useState<string | null>(null)
  const [photoPending, setPhotoPending] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const species = kb?.species ?? []
  const cultivars = kb?.cultivars ?? []
  const { spaces } = useSpaces()
  const organizationId = session?.session.activeOrganizationId

  function resetFormState() {
    setError(undefined)
    setPending(false)
    setPhotoUrl(null)
    setPhotoPending(false)
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
      setError(m.plants.photoFailed)
      setPhotoUrl(null)
    } finally {
      setPhotoPending(false)
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)

    if (!organizationId) {
      setError(m.plants.saveFailed)
      return
    }

    const form = new FormData(event.currentTarget)
    const speciesId = String(form.get("speciesId") ?? "").trim()
    const name = String(form.get("name") ?? "").trim()
    const fieldId = String(form.get("fieldId") ?? "").trim()
    const plantedAt = String(form.get("plantedAt") ?? "").trim()
    const quantity = Number(form.get("quantity"))

    if (!speciesId) {
      setError(m.plants.speciesRequired)
      return
    }
    if (!name) {
      setError(m.plants.cultivarRequired)
      return
    }
    if (!fieldId) {
      setError(m.plants.spaceRequired)
      return
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      setError(m.plants.quantityInvalid)
      return
    }

    const cultivar = cultivars.find(
      (item) =>
        item.speciesId === speciesId &&
        item.name.trim().toLowerCase() === name.toLowerCase()
    )

    setPending(true)
    try {
      await createPlanting({
        organizationId,
        speciesId,
        name,
        fieldId,
        cultivarId: cultivar?.id ?? null,
        plantedAt: plantedAt || null,
        quantity,
        photoUrl,
      })
      toast.success(m.plants.saved)
      setOpen(false)
      event.currentTarget.reset()
      resetFormState()
    } catch {
      setError(m.plants.saveFailed)
    } finally {
      setPending(false)
    }
  }

  return (
    <>
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
        {m.plants.add}
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{m.plants.addTitle}</SheetTitle>
          <SheetDescription>{m.plants.addDesc}</SheetDescription>
        </SheetHeader>
        <form
          key={`${open ? "open" : "closed"}:${defaultFieldId ?? ""}`}
          className="flex flex-col gap-4"
          onSubmit={(event) => void onSubmit(event)}
        >
          <FieldGroup className="px-4">
            <Field>
              <FieldLabel>{m.plants.photo}</FieldLabel>
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
                    alt={m.plants.photoPreviewAlt}
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
                    aria-label={m.plants.photoRemove}
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
                    {photoPending ? m.plants.photoProcessing : m.plants.photoAdd}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {m.plants.photoHint}
                  </span>
                </Button>
              )}
            </Field>
            <Field data-invalid={error === m.plants.speciesRequired || undefined}>
              <FieldLabel htmlFor="plant-species">{m.plants.species}</FieldLabel>
              {species.length === 0 ? (
                <p className="text-sm text-muted-foreground">{m.plants.noCatalog}</p>
              ) : (
                <NativeSelect
                  id="plant-species"
                  name="speciesId"
                  className="w-full"
                  required
                  aria-invalid={error === m.plants.speciesRequired || undefined}
                >
                  <NativeSelectOption value="">
                    {m.plants.speciesPlaceholder}
                  </NativeSelectOption>
                  {species.map((item) => (
                    <NativeSelectOption key={item.id} value={item.id}>
                      {catalogCommonName(locale, item)}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            </Field>
            <Field data-invalid={error === m.plants.cultivarRequired || undefined}>
              <FieldLabel htmlFor="plant-cultivar">{m.plants.cultivar}</FieldLabel>
              <Input
                id="plant-cultivar"
                name="name"
                autoComplete="off"
                required
                placeholder={m.plants.cultivarPlaceholder}
                aria-invalid={error === m.plants.cultivarRequired || undefined}
              />
            </Field>
            <Field data-invalid={error === m.plants.spaceRequired || undefined}>
              <FieldLabel htmlFor="plant-space">{m.plants.space}</FieldLabel>
              {spaces.length === 0 ? (
                <p className="text-sm text-muted-foreground">{m.plants.noSpaces}</p>
              ) : (
                <NativeSelect
                  id="plant-space"
                  name="fieldId"
                  className="w-full"
                  required
                  defaultValue={defaultFieldId ?? ""}
                  aria-invalid={error === m.plants.spaceRequired || undefined}
                >
                  <NativeSelectOption value="">
                    {m.plants.spacePlaceholder}
                  </NativeSelectOption>
                  {spaces.map((space) => (
                    <NativeSelectOption key={space.id} value={space.id}>
                      {space.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setSpaceOpen(true)}
              >
                <PlusIcon data-icon="inline-start" />
                {m.garden.addSpace}
              </Button>
            </Field>
            <Field>
              <FieldLabel htmlFor="plant-planted">{m.plants.plantedOn}</FieldLabel>
              <Input
                id="plant-planted"
                name="plantedAt"
                type="date"
                defaultValue={todayIsoDate()}
              />
            </Field>
            <Field data-invalid={error === m.plants.quantityInvalid || undefined}>
              <FieldLabel htmlFor="plant-quantity">{m.plants.quantity}</FieldLabel>
              <Input
                id="plant-quantity"
                name="quantity"
                inputMode="numeric"
                type="number"
                min="1"
                step="1"
                required
                defaultValue="1"
                aria-invalid={error === m.plants.quantityInvalid || undefined}
              />
            </Field>
            {error ? <FieldError>{error}</FieldError> : null}
          </FieldGroup>
          <SheetFooter>
            <Button
              type="submit"
              disabled={
                pending || photoPending || species.length === 0 || spaces.length === 0
              }
            >
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {m.plants.save}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
    <SpaceFormSheet open={spaceOpen} onOpenChange={setSpaceOpen} />
    </>
  )
}
