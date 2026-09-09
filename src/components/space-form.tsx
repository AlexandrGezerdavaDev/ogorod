"use client"

import * as React from "react"
import { toast } from "sonner"

import { authClient } from "@/features/auth/client"
import { createField, updateField } from "@/features/farm"
import { localizeBed } from "@/i18n/localize"
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
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"

export type SpaceFormValue = {
  id: string
  name: string
}

export function SpaceFormSheet({
  open,
  onOpenChange,
  space,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  space?: SpaceFormValue
}) {
  const { messages: m } = useI18n()
  const { data: session } = authClient.useSession()
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string>()
  const organizationId = session?.session.activeOrganizationId
  const editing = Boolean(space)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)

    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") ?? "").trim()

    if (!name) {
      setError(m.garden.spaceNameRequired)
      return
    }
    if (!organizationId) {
      setError(m.garden.spaceSaveFailed)
      return
    }

    setPending(true)
    try {
      if (space) {
        await updateField(space.id, name)
        toast.success(m.garden.spaceUpdated)
      } else {
        await createField(organizationId, name)
        toast.success(m.garden.spaceSaved)
      }
      onOpenChange(false)
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : ""
      setError(
        code === "duplicate_name"
          ? m.garden.spaceDuplicate
          : m.garden.spaceSaveFailed
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          setError(undefined)
          setPending(false)
        }
      }}
    >
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {editing ? m.garden.spaceEditTitle : m.garden.spaceAddTitle}
          </SheetTitle>
          <SheetDescription>
            {editing ? m.garden.spaceEditDesc : m.garden.spaceAddDesc}
          </SheetDescription>
        </SheetHeader>
        <form
          key={open ? (space?.id ?? "add") : "closed"}
          className="flex flex-col gap-4"
          onSubmit={(event) => void onSubmit(event)}
        >
          <FieldGroup className="px-4">
            <Field data-invalid={error === m.garden.spaceNameRequired || undefined}>
              <FieldLabel htmlFor="space-name">{m.garden.spaceName}</FieldLabel>
              <Input
                id="space-name"
                name="name"
                autoComplete="off"
                required
                autoFocus
                defaultValue={space ? localizeBed(m, space.name) : ""}
                placeholder={m.garden.spaceNamePlaceholder}
                aria-invalid={error === m.garden.spaceNameRequired || undefined}
              />
            </Field>
            {error ? <FieldError>{error}</FieldError> : null}
          </FieldGroup>
          <SheetFooter>
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {m.garden.spaceSave}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
