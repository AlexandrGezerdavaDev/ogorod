"use client"

import { useEffect, useMemo, useState } from "react"
import { format, parseISO } from "date-fns"
import {
  BookOpenIcon,
  LeafIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

import { type PlantStatus } from "@/lib/garden-data"
import {
  deletePlanting,
  usePlantings,
  useSpaces,
  type DisplayPlanting,
} from "@/features/farm"
import { usePlantCare } from "@/features/plants/use-plant-care"
import { AddPlanting } from "@/components/add-planting"
import { PlantProfileSheet } from "@/components/plant-profile-sheet"
import { cn } from "@/lib/utils"
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
import {
  filterCatalog,
  parseSpeciesCategory,
  speciesCategories,
  type CatalogSpecies,
  type SpeciesCategory,
} from "@/features/kb/catalog"
import { getPlantProfile } from "@/features/kb/plant-profiles"
import { useKbSpecies } from "@/features/kb/use-kb-species"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  catalogCommonName,
  catalogCultivarName,
  dateFnsLocale,
  interpolate,
} from "@/i18n/format"
import { useI18n } from "@/i18n/provider"
import { usePreferences } from "@/features/settings/provider"
import { useSearchParams } from "next/navigation"

const badgeVariant: Record<
  PlantStatus,
  "default" | "secondary" | "destructive"
> = {
  healthy: "secondary",
  water: "default",
  attention: "destructive",
}

export function PlantsView() {
  const { messages: m } = useI18n()
  const searchParams = useSearchParams()
  const { spaces } = useSpaces()
  const fieldId = searchParams.get("space")
  const space = fieldId
    ? spaces.find((item) => item.id === fieldId)
    : undefined
  const { plantings } = usePlantings({ fieldId })

  return (
    <div className="flex flex-col gap-4 pb-16 md:pb-0">
      <Tabs defaultValue="mine" className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-medium tracking-tight">
              {space?.label ?? m.pages.plants.title}
            </h1>
          </div>
          <AddPlanting
            className="hidden md:inline-flex"
            defaultFieldId={fieldId}
          />
        </div>
        <TabsList variant="line" className="w-full">
          <TabsTrigger value="mine">{m.plants.mine}</TabsTrigger>
          <TabsTrigger value="catalog">{m.plants.catalog}</TabsTrigger>
        </TabsList>
        <TabsContent value="mine" className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            {space
              ? interpolate(m.plants.mineCountSpace, {
                  count: plantings.length,
                  space: space.label,
                })
              : interpolate(m.plants.mineCount, { count: plantings.length })}
          </p>
          <MyPlants fieldId={fieldId} spaceLabel={space?.label} />
        </TabsContent>
        <TabsContent value="catalog" className="flex flex-col gap-4">
          <CatalogPlants />
        </TabsContent>
      </Tabs>
      {plantings.length > 0 ? (
        <div className="pointer-events-none fixed inset-x-4 z-30 flex justify-end md:hidden bottom-[calc(6.5rem+env(safe-area-inset-bottom))]">
          <div className="pointer-events-auto">
            <AddPlanting
              className="rounded-full px-4 shadow-lg"
              defaultFieldId={fieldId}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function plantedCopy(
  plantedAt: string | null,
  locale: Parameters<typeof dateFnsLocale>[0],
  planted: string,
  unknown: string
) {
  if (!plantedAt) {
    return unknown
  }
  const date = parseISO(plantedAt)
  if (Number.isNaN(date.getTime())) {
    return unknown
  }
  return interpolate(planted, {
    date: format(date, "d MMMM yyyy", { locale: dateFnsLocale(locale) }),
  })
}

function MyPlants({
  fieldId,
  spaceLabel,
}: {
  fieldId: string | null
  spaceLabel?: string
}) {
  const { locale, messages: m } = useI18n()
  const { plantings, isPending } = usePlantings({ fieldId })
  const { isDone, toggle } = usePlantCare()
  const [selected, setSelected] = useState<DisplayPlanting | null>(null)

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    )
  }

  if (plantings.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LeafIcon />
          </EmptyMedia>
          <EmptyTitle>
            {spaceLabel
              ? interpolate(m.plants.emptySpaceTitle, { space: spaceLabel })
              : m.plants.emptyTitle}
          </EmptyTitle>
          <EmptyDescription>
            {spaceLabel ? m.plants.emptySpaceDesc : m.plants.emptyDesc}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="md:hidden">
          <AddPlanting className="w-full" defaultFieldId={fieldId} />
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {plantings.map((plant) => {
          const title = plant.speciesName
            ? `${plant.speciesName} · ${plant.cultivarName}`
            : plant.cultivarName
          const planted = plantedCopy(
            plant.plantedAt,
            locale,
            m.plants.planted,
            m.plants.plantedUnknown
          )
          const status: PlantStatus = "healthy"
          return (
            <Card key={plant.id} className="pt-0">
              <div
                role="button"
                tabIndex={0}
                aria-label={title}
                className={cn(
                  "flex cursor-pointer flex-col gap-(--card-spacing) rounded-t-xl text-left",
                  "transition-colors hover:bg-muted/40",
                  "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                )}
                onClick={() => setSelected(plant)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setSelected(plant)
                  }
                }}
              >
                <PlantCardImage
                  src={getPlantProfile(plant.speciesId).imageUrl}
                  alt={plant.speciesName || plant.cultivarName}
                />
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <CardTitle>{plant.speciesName || plant.cultivarName}</CardTitle>
                      <CardDescription>{plant.cultivarName}</CardDescription>
                    </div>
                    <div
                      className="shrink-0"
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                    >
                      <DeletePlantingButton plant={plant} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">{plant.bed}</span>
                    <Badge variant={badgeVariant[status]}>
                      {m.status[status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{planted}</p>
                </CardContent>
              </div>
              <CardFooter className="gap-4">
                <Field orientation="horizontal" className="w-auto">
                  <Checkbox
                    id={`plant-${plant.id}-water`}
                    checked={isDone(plant.id, "water")}
                    aria-label={interpolate(m.plants.markWaterAria, {
                      name: title,
                    })}
                    onCheckedChange={(checked) =>
                      toggle(plant.id, "water", checked === true)
                    }
                  />
                  <FieldLabel htmlFor={`plant-${plant.id}-water`} className="font-normal">
                    {m.plants.markWater}
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal" className="w-auto">
                  <Checkbox
                    id={`plant-${plant.id}-feed`}
                    checked={isDone(plant.id, "feed")}
                    aria-label={interpolate(m.plants.markFeedAria, {
                      name: title,
                    })}
                    onCheckedChange={(checked) =>
                      toggle(plant.id, "feed", checked === true)
                    }
                  />
                  <FieldLabel htmlFor={`plant-${plant.id}-feed`} className="font-normal">
                    {m.plants.markFeed}
                  </FieldLabel>
                </Field>
              </CardFooter>
            </Card>
          )
        })}
      </div>
      <PlantProfileSheet
        speciesId={selected?.speciesId}
        title={
          selected
            ? selected.speciesName
              ? `${selected.speciesName} · ${selected.cultivarName}`
              : selected.cultivarName
            : ""
        }
        description={
          selected
            ? `${selected.bed} · ${plantedCopy(selected.plantedAt, locale, m.plants.planted, m.plants.plantedUnknown)}`
            : null
        }
        open={selected !== null}
        onOpenChange={(next) => {
          if (!next) {
            setSelected(null)
          }
        }}
      />
    </>
  )
}

function DeletePlantingButton({ plant }: { plant: DisplayPlanting }) {
  const { messages: m } = useI18n()
  const [pending, setPending] = useState(false)
  const label = plant.speciesName
    ? `${plant.speciesName} · ${plant.cultivarName}`
    : plant.cultivarName

  async function onDelete() {
    setPending(true)
    try {
      await deletePlanting(plant.id)
      toast.success(m.plants.deleted)
    } catch {
      toast.error(m.plants.deleteFailed)
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
            aria-label={m.plants.delete}
          />
        }
      >
        <Trash2Icon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{m.plants.deleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {interpolate(m.plants.deleteDesc, { name: label })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{m.plants.cancel}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={() => void onDelete()}
          >
            {pending ? <Spinner data-icon="inline-start" /> : null}
            {m.plants.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function CatalogPlants() {
  const { locale, messages: m } = useI18n()
  const { prefs } = usePreferences()
  const { data, isPending, isError } = useKbSpecies()
  const [query, setQuery] = useState("")
  const [categories, setCategories] = useState<SpeciesCategory[]>([])
  const [selected, setSelected] = useState<CatalogSpecies | null>(null)
  const species = data?.species ?? []

  const grouped = useMemo(() => {
    const rows = data?.species ?? []
    const cultivars = data?.cultivars ?? []
    return rows.map((item) => ({
      ...item,
      category: parseSpeciesCategory(item.category),
      cultivars: cultivars.filter((cultivar) => cultivar.speciesId === item.id),
    }))
  }, [data])

  const filtered = useMemo(
    () => filterCatalog(grouped, query, categories, locale),
    [grouped, query, categories, locale]
  )

  const hasFilters = query.trim() !== "" || categories.length > 0

  function toggleCategory(category: SpeciesCategory, checked: boolean) {
    setCategories((current) =>
      checked
        ? [...current, category]
        : current.filter((value) => value !== category)
    )
  }

  function resetFilters() {
    setQuery("")
    setCategories([])
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-5 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpenIcon />
          </EmptyMedia>
          <EmptyTitle>{m.plants.catalogErrorTitle}</EmptyTitle>
          <EmptyDescription>{m.plants.catalogErrorDesc}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (species.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpenIcon />
          </EmptyMedia>
          <EmptyTitle>{m.plants.catalogEmptyTitle}</EmptyTitle>
          <EmptyDescription>{m.plants.catalogEmptyDesc}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <FieldGroup className="gap-3">
        <Field>
          <FieldLabel htmlFor="catalog-search" className="sr-only">
            {m.plants.catalogSearch}
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              id="catalog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={m.plants.catalogSearchPlaceholder}
              autoComplete="off"
            />
            {query ? (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label={m.plants.catalogClearSearch}
                  onClick={() => setQuery("")}
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            ) : null}
          </InputGroup>
        </Field>
        <FieldSet>
          <FieldLegend variant="label">{m.plants.catalogFilters}</FieldLegend>
          <div data-slot="checkbox-group" className="flex flex-wrap gap-x-4 gap-y-2">
            {speciesCategories.map((category) => {
              const id = `catalog-category-${category}`
              return (
                <Field key={category} orientation="horizontal" className="w-auto">
                  <Checkbox
                    id={id}
                    checked={categories.includes(category)}
                    onCheckedChange={(checked) =>
                      toggleCategory(category, checked === true)
                    }
                  />
                  <FieldLabel htmlFor={id} className="font-normal">
                    {m.plants.catalogCategory[category]}
                  </FieldLabel>
                </Field>
              )
            })}
          </div>
        </FieldSet>
      </FieldGroup>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground">
          {hasFilters
            ? interpolate(m.plants.catalogFilteredCount, {
                count: filtered.length,
                total: species.length,
              })
            : interpolate(m.plants.catalogCount, { count: species.length })}
        </p>
        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            {m.plants.catalogReset}
          </Button>
        ) : null}
      </div>
      {filtered.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>{m.plants.catalogNoResultsTitle}</EmptyTitle>
            <EmptyDescription>{m.plants.catalogNoResultsDesc}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => {
            const title = prefs.appearance.showLatin
              ? item.scientificName
              : catalogCommonName(locale, item)
            const subtitle = prefs.appearance.showLatin
              ? catalogCommonName(locale, item)
              : item.scientificName
            return (
              <Card
                key={item.id}
                role="button"
                tabIndex={0}
                aria-label={title}
                className={cn(
                  "cursor-pointer pt-0 transition-colors hover:bg-muted/40",
                  "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                )}
                onClick={() => setSelected(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setSelected(item)
                  }
                }}
              >
                <PlantCardImage
                  src={getPlantProfile(item.id).imageUrl}
                  alt={title}
                />
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle>{title}</CardTitle>
                    <Badge variant="outline">
                      {m.plants.catalogCategory[item.category]}
                    </Badge>
                  </div>
                  <CardDescription className={prefs.appearance.showLatin ? undefined : "italic"}>
                    {subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {item.cultivars.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {m.plants.catalogNoCultivars}
                    </p>
                  ) : (
                    item.cultivars.map((cultivar) => (
                      <Badge key={cultivar.id} variant="secondary">
                        {catalogCultivarName(locale, cultivar.name)}
                      </Badge>
                    ))
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
      <PlantProfileSheet
        speciesId={selected?.id}
        title={
          selected
            ? prefs.appearance.showLatin
              ? selected.scientificName
              : catalogCommonName(locale, selected)
            : ""
        }
        description={
          selected
            ? prefs.appearance.showLatin
              ? catalogCommonName(locale, selected)
              : selected.scientificName
            : null
        }
        open={selected !== null}
        onOpenChange={(next) => {
          if (!next) {
            setSelected(null)
          }
        }}
      />
    </div>
  )
}

function PlantCardImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  return (
    <div className="relative aspect-[16/10] w-full bg-muted">
      {src && !failed ? (
        // Catalog mock URLs (public/plants); plain img keeps the mock free of next/image remote config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <LeafIcon className="size-10" />
        </div>
      )}
    </div>
  )
}
