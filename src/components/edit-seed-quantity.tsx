"use client"

import * as React from "react"
import { PencilIcon } from "lucide-react"
import { toast } from "sonner"

import {
  updateSeedLotQuantity,
  type DisplaySeedLot,
} from "@/features/farm"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatSeedQuantityLabel } from "@/i18n/format"
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

export function EditSeedQuantity({ lot }: { lot: DisplaySeedLot }) {
  const { messages: m } = useI18n()
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string>()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)

    const form = new FormData(event.currentTarget)
    const quantity = Number(form.get("quantity"))

    if (!Number.isFinite(quantity) || quantity < 0) {
      setError(m.seeds.quantityNonNegative)
      return
    }

    setPending(true)
    try {
      await updateSeedLotQuantity(lot.id, quantity)
      toast.success(m.seeds.quantityUpdated)
      setOpen(false)
    } catch {
      setError(m.seeds.quantityUpdateFailed)
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
            aria-label={m.seeds.editQuantity}
          />
        }
      >
        <PencilIcon />
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{m.seeds.editQuantityTitle}</SheetTitle>
          <SheetDescription>{m.seeds.editQuantityDesc}</SheetDescription>
        </SheetHeader>
        <form
          key={open ? `${lot.id}-open` : `${lot.id}-closed`}
          className="flex flex-col gap-4"
          onSubmit={(event) => void onSubmit(event)}
        >
          <FieldGroup className="px-4">
            <p className="text-sm text-muted-foreground">
              {lot.speciesName
                ? `${lot.speciesName} · ${lot.cultivarName}`
                : lot.cultivarName}
              {" · "}
              {formatSeedQuantityLabel(m, lot.quantity, lot.unit)}
            </p>
            <Field data-invalid={error === m.seeds.quantityNonNegative || undefined}>
              <FieldLabel htmlFor={`seed-qty-${lot.id}`}>{m.seeds.quantity}</FieldLabel>
              <Input
                id={`seed-qty-${lot.id}`}
                name="quantity"
                inputMode="decimal"
                type="number"
                min="0"
                step="any"
                required
                defaultValue={lot.quantity}
                aria-invalid={error === m.seeds.quantityNonNegative || undefined}
              />
            </Field>
            {error ? <FieldError>{error}</FieldError> : null}
          </FieldGroup>
          <SheetFooter>
            <Button type="submit" size={isMobile ? "lg" : "default"} disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {m.seeds.save}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
