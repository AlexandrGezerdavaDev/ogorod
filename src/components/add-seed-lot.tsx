"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/features/auth/client"
import { createSeedLot, type SeedUnit } from "@/features/farm"
import { useKbSpecies } from "@/features/kb/use-kb-species"
import { catalogCommonName } from "@/i18n/format"
import { useI18n } from "@/i18n/provider"
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

  const species = kb?.species ?? []
  const organizationId = session?.session.activeOrganizationId

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
      await createSeedLot({
        organizationId,
        speciesId,
        name,
        quantity,
        unit,
        packedAt: packedAt || null,
      })
      toast.success(m.seeds.saved)
      setOpen(false)
      event.currentTarget.reset()
      setUnit("шт")
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
          setError(undefined)
          setUnit("шт")
          setPending(false)
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
          <SheetTitle>{m.seeds.addTitle}</SheetTitle>
          <SheetDescription>{m.seeds.addDesc}</SheetDescription>
        </SheetHeader>
        <form
          key={open ? "open" : "closed"}
          className="flex flex-col gap-4"
          onSubmit={(event) => void onSubmit(event)}
        >
          <FieldGroup className="px-4">
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
            <Button type="submit" disabled={pending || species.length === 0}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {m.seeds.save}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
