"use client"

import * as React from "react"
import { PencilIcon } from "lucide-react"
import { toast } from "sonner"

import {
  updatePlantingQuantity,
  type DisplayPlanting,
} from "@/features/farm"
import { interpolate } from "@/i18n/format"
import { useI18n } from "@/i18n/provider"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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

export function EditPlantingQuantity({ plant }: { plant: DisplayPlanting }) {
  const { messages: m } = useI18n()
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string>()
  const [quantity, setQuantity] = React.useState(String(plant.quantity))

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)

    const next = Number(quantity)
    if (!Number.isInteger(next) || next < 1) {
      setError(m.plants.quantityInvalid)
      return
    }

    setPending(true)
    try {
      await updatePlantingQuantity(plant.id, next)
      toast.success(m.plants.quantityUpdated)
      setOpen(false)
    } catch {
      setError(m.plants.quantityUpdateFailed)
    } finally {
      setPending(false)
    }
  }

  const title = plant.speciesName
    ? `${plant.speciesName} · ${plant.cultivarName}`
    : plant.cultivarName

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) {
          setQuantity(String(plant.quantity))
        } else {
          setError(undefined)
          setPending(false)
        }
      }}
    >
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            aria-label={m.plants.editQuantity}
          />
        }
      >
        <PencilIcon />
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{m.plants.editQuantityTitle}</SheetTitle>
          <SheetDescription>{m.plants.editQuantityDesc}</SheetDescription>
        </SheetHeader>
        <form className="flex flex-col gap-4" onSubmit={(event) => void onSubmit(event)}>
          <FieldGroup className="px-4">
            <p className="text-sm text-muted-foreground">
              {title}
              {" · "}
              {interpolate(m.plants.quantityCount, { count: plant.quantity })}
            </p>
            <Field data-invalid={error === m.plants.quantityInvalid || undefined}>
              <FieldLabel htmlFor={`plant-qty-${plant.id}`}>
                {m.plants.quantity}
              </FieldLabel>
              <Input
                id={`plant-qty-${plant.id}`}
                name="quantity"
                inputMode="numeric"
                type="number"
                min="1"
                step="1"
                required
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                aria-invalid={error === m.plants.quantityInvalid || undefined}
              />
            </Field>
            {error ? <FieldError>{error}</FieldError> : null}
          </FieldGroup>
          <SheetFooter>
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {m.plants.save}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
