"use client"

import * as React from "react"
import { SproutIcon } from "lucide-react"

import { getPlantProfile, PLANT_TRAIT_KEYS, profileText } from "@/features/kb/plant-profiles"
import { useI18n } from "@/i18n/provider"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export function PlantProfileSheet({
  speciesId,
  title,
  description,
  open,
  onOpenChange,
}: {
  speciesId?: string | null
  title: string
  description?: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { locale, messages: m } = useI18n()
  const profile = getPlantProfile(speciesId)
  const [imageFailed, setImageFailed] = React.useState(false)

  React.useEffect(() => {
    setImageFailed(false)
  }, [speciesId, profile.imageUrl])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] gap-0 overflow-y-auto p-0"
      >
        <div className="relative aspect-[16/10] w-full bg-muted">
          {profile.imageUrl && !imageFailed ? (
            // Catalog mock URLs (public/plants); plain img keeps the mock free of next/image remote config.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.imageUrl}
              alt={title}
              className="size-full object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <SproutIcon className="size-12" />
            </div>
          )}
          <Badge className="absolute top-3 left-3" variant="secondary">
            {m.plants.profileDraft}
          </Badge>
        </div>

        <SheetHeader className="gap-1 px-4 pt-4 text-left">
          <SheetTitle>{title}</SheetTitle>
          {description ? (
            <SheetDescription>{description}</SheetDescription>
          ) : null}
        </SheetHeader>

        <dl className="grid gap-3 px-4 pt-2 pb-6 sm:grid-cols-2">
          {PLANT_TRAIT_KEYS.map((key) => (
            <TraitRow
              key={key}
              label={m.plants.profileTraits[key]}
              value={profileText(profile[key], locale)}
            />
          ))}
        </dl>
      </SheetContent>
    </Sheet>
  )
}

function TraitRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background/60 px-3 py-2.5">
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  )
}
