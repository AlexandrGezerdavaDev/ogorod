"use client"

import * as React from "react"

import type { GardenPlace } from "@/features/settings/preferences"
import { defaultPlace } from "@/features/settings/preferences"
import type { GeoPlace, GeoSearchResponse } from "@/features/geo/types"
import { formatPlaceLabel } from "@/features/geo/types"
import { useI18n } from "@/i18n/provider"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

function placeFromGarden(place: GardenPlace): GeoPlace | null {
  if (!place.city || place.latitude == null || place.longitude == null) {
    return null
  }
  return {
    id: place.placeId ?? Math.round(place.latitude * 1000 + place.longitude),
    name: place.city,
    region: place.region,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
    timezone: place.timezone,
  }
}

function toGardenPlace(place: GeoPlace): GardenPlace {
  return {
    placeId: place.id,
    city: place.name,
    region: place.region,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
    timezone: place.timezone,
  }
}

export function PlaceCombobox({
  id,
  place,
  onChange,
}: {
  id: string
  place: GardenPlace
  onChange: (next: GardenPlace) => void
}) {
  const { locale, messages: m } = useI18n()
  const selected = placeFromGarden(place)
  const [results, setResults] = React.useState<GeoPlace[]>(
    selected ? [selected] : []
  )
  const [searching, setSearching] = React.useState(false)
  const abortRef = React.useRef<AbortController | null>(null)
  const debounceRef = React.useRef<number>(0)

  const items = React.useMemo(() => {
    if (!selected || results.some((item) => item.id === selected.id)) {
      return results
    }
    return [selected, ...results]
  }, [results, selected])

  function search(query: string) {
    window.clearTimeout(debounceRef.current)
    abortRef.current?.abort()

    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setSearching(false)
      setResults(selected ? [selected] : [])
      return
    }

    debounceRef.current = window.setTimeout(() => {
      const controller = new AbortController()
      abortRef.current = controller
      setSearching(true)
      void (async () => {
        try {
          const params = new URLSearchParams({ q: trimmed, lang: locale })
          const response = await fetch(`/api/geo/search?${params.toString()}`, {
            signal: controller.signal,
          })
          if (!response.ok) {
            return
          }
          const payload = (await response.json()) as GeoSearchResponse
          if (!controller.signal.aborted) {
            setResults(payload.results)
          }
        } catch (error) {
          if ((error as { name?: string }).name !== "AbortError") {
            setResults(selected ? [selected] : [])
          }
        } finally {
          if (!controller.signal.aborted) {
            setSearching(false)
          }
        }
      })()
    }, 300)
  }

  React.useEffect(() => {
    return () => {
      window.clearTimeout(debounceRef.current)
      abortRef.current?.abort()
    }
  }, [])

  return (
    <Combobox
      items={items}
      value={selected}
      filter={null}
      itemToStringLabel={(item: GeoPlace) => formatPlaceLabel(item)}
      isItemEqualToValue={(itemValue: GeoPlace, value: GeoPlace) =>
        itemValue.id === value.id
      }
      onValueChange={(next: GeoPlace | null) => {
        onChange(next ? toGardenPlace(next) : defaultPlace)
        setResults(next ? [next] : [])
      }}
      onInputValueChange={(next, { reason }) => {
        if (reason === "item-press") {
          return
        }
        search(next)
      }}
    >
      <ComboboxInput
        id={id}
        className="w-full"
        placeholder={m.settings.garden.cityPlaceholder}
        showClear
      />
      <ComboboxContent>
        {searching ? (
          <p className="px-2 py-2 text-center text-sm text-muted-foreground">
            {m.settings.garden.searching}
          </p>
        ) : null}
        <ComboboxEmpty>{m.settings.garden.noPlaces}</ComboboxEmpty>
        <ComboboxList>
          {(item: GeoPlace) => (
            <ComboboxItem key={item.id} value={item}>
              <span className="flex min-w-0 flex-col">
                <span className="truncate">{item.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {[item.region, item.country].filter(Boolean).join(", ")}
                </span>
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
