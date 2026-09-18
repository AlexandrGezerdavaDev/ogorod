"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { format, parseISO } from "date-fns"
import { QrCodeIcon, SproutIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { deleteSeedLot, useSeedLots, type DisplaySeedLot } from "@/features/farm"
import { useKbSpecies } from "@/features/kb/use-kb-species"
import { resolveSpeciesImageUrl } from "@/features/kb/resolve-profile"
import {
  isAgedSeedLot,
  seedLotAgeYears,
  SEED_LOT_AGE_YEARS,
} from "@/lib/garden-data"
import { SEED_LOT_QUERY_PARAM } from "@/lib/seed-lot-qr"
import { AddSeedLot } from "@/components/add-seed-lot"
import { EditSeedQuantity } from "@/components/edit-seed-quantity"
import { PlantCardImage } from "@/components/plant-card-image"
import { SeedLotQrSheet } from "@/components/seed-lot-qr-sheet"
import { SeedPlantSheet } from "@/components/seed-plant-sheet"
import type { SeedLotQrData } from "@/components/seed-lot-qr-label"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import {
  dateFnsLocale,
  formatSeedQuantityLabel,
  formatYears,
  interpolate,
} from "@/i18n/format"
import { useI18n } from "@/i18n/provider"
import type { Locale } from "@/i18n/config"
import type { Messages } from "@/i18n/messages"
import { cn } from "@/lib/utils"

export function SeedsView() {
  const { locale, messages: m } = useI18n()
  const { lots, isPending } = useSeedLots()
  const kb = useKbSpecies()
  const searchParams = useSearchParams()
  const [selected, setSelected] = useState<DisplaySeedLot | null>(null)
  const [qrLot, setQrLot] = useState<DisplaySeedLot | null>(null)
  const openedLotParam = useRef<string | null>(null)
  const lotParam = searchParams.get(SEED_LOT_QUERY_PARAM)

  useEffect(() => {
    if (!lotParam || isPending) {
      return
    }
    if (openedLotParam.current === lotParam) {
      return
    }
    const found = lots.find((lot) => lot.id === lotParam)
    if (found) {
      openedLotParam.current = lotParam
      setSelected(found)
    }
  }, [isPending, lotParam, lots])

  const sorted = [...lots].sort((left, right) => {
    const agedLeft = isAgedSeedLot(left.packedAt) ? 0 : 1
    const agedRight = isAgedSeedLot(right.packedAt) ? 0 : 1
    if (agedLeft !== agedRight) {
      return agedLeft - agedRight
    }
    return (left.packedAt ?? "").localeCompare(right.packedAt ?? "")
  })

  return (
    <div className="flex flex-col gap-4 pb-24 md:pb-20">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          {m.pages.seeds.title}
        </h1>
        <p className="text-muted-foreground">
          {interpolate(m.seeds.count, { count: lots.length })}
        </p>
      </div>

      {isPending ? (
        <div className="grid gap-3 lg:grid-cols-2">
          <Skeleton className="h-40 rounded-xl md:h-36" />
          <Skeleton className="h-40 rounded-xl md:h-36" />
        </div>
      ) : sorted.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SproutIcon />
            </EmptyMedia>
            <EmptyTitle>{m.seeds.emptyTitle}</EmptyTitle>
            <EmptyDescription>{m.seeds.emptyDesc}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {sorted.map((lot) => {
            const aged = isAgedSeedLot(lot.packedAt)
            const packedDate = lot.packedAt ? parseISO(lot.packedAt) : null
            const packedValid = packedDate && !Number.isNaN(packedDate.getTime())
            const title = lot.speciesName
              ? `${lot.speciesName} · ${lot.cultivarName}`
              : lot.cultivarName
            return (
              <Card
                key={lot.id}
                role="button"
                tabIndex={0}
                aria-label={title}
                className={cn(
                  "cursor-pointer gap-0 overflow-hidden py-0 transition-colors hover:bg-muted/40",
                  "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                )}
                onClick={() => setSelected(lot)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setSelected(lot)
                  }
                }}
              >
                <div className="flex flex-col md:flex-row md:items-start">
                  <PlantCardImage
                    src={
                      lot.photoUrl ||
                      resolveSpeciesImageUrl(lot.speciesId, kb.data)
                    }
                    alt={lot.speciesName || lot.cultivarName}
                  />
                  <div className="flex min-w-0 flex-1 flex-col py-(--card-spacing)">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <CardTitle>{title}</CardTitle>
                          <CardDescription>
                            {formatSeedQuantityLabel(m, lot.quantity, lot.unit)}
                          </CardDescription>
                        </div>
                        <div
                          className="flex shrink-0 items-center gap-0.5"
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) => event.stopPropagation()}
                        >
                          <EditSeedQuantity lot={lot} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground"
                            aria-label={m.seeds.qrReprint}
                            onClick={() => setQrLot(lot)}
                          >
                            <QrCodeIcon />
                          </Button>
                          <DeleteSeedLotButton lot={lot} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">
                          {packedValid
                            ? interpolate(m.seeds.packed, {
                                date: format(packedDate, "d MMMM yyyy", {
                                  locale: dateFnsLocale(locale),
                                }),
                              })
                            : m.seeds.packedUnknown}
                        </span>
                        <Badge variant={aged ? "destructive" : "secondary"}>
                          {aged && lot.packedAt
                            ? formatYears(
                                locale,
                                Math.max(
                                  SEED_LOT_AGE_YEARS,
                                  seedLotAgeYears(lot.packedAt)
                                )
                              )
                            : m.seeds.fresh}
                        </Badge>
                      </div>
                      {aged ? (
                        <p className="text-sm text-muted-foreground">
                          {interpolate(m.seeds.aged, {
                            age: formatYears(locale, SEED_LOT_AGE_YEARS),
                          })}
                        </p>
                      ) : null}
                    </CardContent>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <div className="pointer-events-none fixed inset-x-4 z-30 flex justify-end bottom-[calc(6.5rem+env(safe-area-inset-bottom))] md:bottom-6 md:right-6 md:left-auto">
        <div className="pointer-events-auto">
          <AddSeedLot className="rounded-full px-4 shadow-lg" />
        </div>
      </div>

      <SeedPlantSheet
        lot={selected}
        open={selected !== null}
        onOpenChange={(next) => {
          if (!next) {
            setSelected(null)
          }
        }}
      />
      <SeedLotQrSheet
        lot={qrLot ? seedLotQrData(locale, m, qrLot) : null}
        open={qrLot !== null}
        onOpenChange={(next) => {
          if (!next) {
            setQrLot(null)
          }
        }}
      />
    </div>
  )
}

function DeleteSeedLotButton({ lot }: { lot: DisplaySeedLot }) {
  const { messages: m } = useI18n()
  const [pending, setPending] = useState(false)
  const label =
    lot.speciesName && lot.cultivarName
      ? `${lot.speciesName} · ${lot.cultivarName}`
      : lot.cultivarName

  async function onDelete() {
    setPending(true)
    try {
      await deleteSeedLot(lot.id)
      toast.success(m.seeds.deleted)
    } catch {
      toast.error(m.seeds.deleteFailed)
    } finally {
      setPending(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            aria-label={m.seeds.delete}
          />
        }
      >
        <Trash2Icon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{m.seeds.deleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {interpolate(m.seeds.deleteDesc, { name: label })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{m.seeds.cancel}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={() => void onDelete()}
          >
            {pending ? <Spinner data-icon="inline-start" /> : null}
            {m.seeds.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function seedLotQrData(
  locale: Locale,
  m: Messages,
  lot: DisplaySeedLot
): SeedLotQrData {
  const title = lot.speciesName
    ? `${lot.speciesName} · ${lot.cultivarName}`
    : lot.cultivarName
  const packedDate = lot.packedAt ? parseISO(lot.packedAt) : null
  const packedValid = packedDate && !Number.isNaN(packedDate.getTime())
  const packedLabel = packedValid
    ? interpolate(m.seeds.packed, {
        date: format(packedDate, "d MMMM yyyy", {
          locale: dateFnsLocale(locale),
        }),
      })
    : m.seeds.packedUnknown
  return {
    id: lot.id,
    title,
    meta: `${formatSeedQuantityLabel(m, lot.quantity, lot.unit)} · ${packedLabel}`,
  }
}
