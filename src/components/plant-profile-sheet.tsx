"use client"

import * as React from "react"
import {
  DnaIcon,
  LeafyGreenIcon,
  SproutIcon,
  UtensilsIcon,
} from "lucide-react"

import {
  getPlantProfile,
  PROFILE_SECTIONS,
  SECTION_TRAIT_KEYS,
  profileText,
  type LocalizedText,
  type PlantProfile,
  type PlantTraitKey,
  type ProfileSection,
} from "@/features/kb/plant-profiles"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/provider"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const SECTION_ICONS: Record<
  ProfileSection,
  React.ComponentType<{ className?: string }>
> = {
  taxonomy: SproutIcon,
  growing: LeafyGreenIcon,
  genetics: DnaIcon,
  usage: UtensilsIcon,
}

export function PlantProfileSheet({
  speciesId,
  title,
  description,
  imageUrl,
  open,
  onOpenChange,
}: {
  speciesId?: string | null
  title: string
  description?: React.ReactNode
  imageUrl?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { messages: m } = useI18n()
  const isMobile = useIsMobile()
  const profile = getPlantProfile(speciesId)
  const resolvedImage = imageUrl?.trim() || profile.imageUrl
  const [imageFailed, setImageFailed] = React.useState(false)

  React.useEffect(() => {
    setImageFailed(false)
  }, [speciesId, resolvedImage])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] gap-0 overflow-y-auto p-0"
      >
        <div className="relative aspect-[4/3] w-full bg-muted md:hidden">
          <ProfileImage
            src={resolvedImage}
            alt={title}
            failed={imageFailed}
            onError={() => setImageFailed(true)}
          />
        </div>

        <div className="flex items-center gap-4 px-5 pt-5 md:pr-14">
          <div className="relative hidden size-20 shrink-0 overflow-hidden rounded-2xl bg-muted md:block lg:size-24">
            <ProfileImage
              src={resolvedImage}
              alt={title}
              failed={imageFailed}
              onError={() => setImageFailed(true)}
            />
          </div>
          <SheetHeader className="min-w-0 flex-1 gap-1 p-0 text-left">
            <p className="text-xs text-muted-foreground">{m.plants.profileDraft}</p>
            <SheetTitle className="text-lg">{title}</SheetTitle>
            {description ? (
              <SheetDescription>{description}</SheetDescription>
            ) : null}
          </SheetHeader>
        </div>

        <Tabs key={speciesId ?? "profile"} defaultValue="taxonomy" className="gap-3 pt-4">
          <TabsList
            variant="line"
            className={cn(
              "w-full px-5",
              isMobile
                ? "grid h-auto grid-cols-2 gap-2 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto"
                : "justify-start overflow-x-auto"
            )}
          >
            {PROFILE_SECTIONS.map((section) => {
              const Icon = SECTION_ICONS[section]
              return (
                <TabsTrigger
                  key={section}
                  value={section}
                  className={
                    isMobile
                      ? cn(
                          "h-auto min-h-10 flex-none justify-center gap-2 rounded-xl border border-border px-3 py-2.5",
                          "after:hidden data-active:shadow-none",
                          section === "genetics"
                            ? "data-active:border-genetics/40 data-active:bg-genetics-soft data-active:text-genetics"
                            : section === "growing"
                              ? "data-active:border-growth/40 data-active:bg-growth-soft data-active:text-growth"
                              : "data-active:border-primary/40 data-active:bg-primary/10"
                        )
                      : "shrink-0"
                  }
                >
                  <Icon />
                  {m.plants.profileTabs[section]}
                </TabsTrigger>
              )
            })}
          </TabsList>
          {PROFILE_SECTIONS.map((section) => (
            <TabsContent key={section} value={section} className="px-5 pt-3 pb-8">
              <p className="text-sm text-muted-foreground">
                {m.plants.profileTabHints[section]}
              </p>
              <SectionTraits profile={profile} section={section} />
            </TabsContent>
          ))}
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

function SectionTraits({
  profile,
  section,
}: {
  profile: PlantProfile
  section: ProfileSection
}) {
  const { locale, messages: m } = useI18n()
  const traits = profile[section] as Record<string, LocalizedText>
  const keys = SECTION_TRAIT_KEYS[section]

  return (
    <dl className="grid pt-1 sm:grid-cols-2 sm:gap-x-8">
      {keys.map((key) => (
        <TraitRow
          key={key}
          label={m.plants.profileTraits[key as PlantTraitKey]}
          value={profileText(traits[key], locale)}
        />
      ))}
    </dl>
  )
}

function ProfileImage({
  src,
  alt,
  failed,
  onError,
}: {
  src: string
  alt: string
  failed: boolean
  onError: () => void
}) {
  if (src && !failed) {
    // Catalog mock URLs (public/plants); plain img keeps the mock free of next/image remote config.
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        className="size-full object-cover"
        onError={onError}
      />
    )
  }

  return (
    <div className="flex size-full items-center justify-center text-muted-foreground">
      <SproutIcon className="size-10 md:size-7" />
    </div>
  )
}

function TraitRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  )
}
