export type GeoPlace = {
  id: number
  name: string
  region: string
  country: string
  latitude: number
  longitude: number
  timezone: string
}

export type GeoSearchResponse = {
  results: GeoPlace[]
}

export function formatPlaceLabel(place: {
  name?: string
  city?: string
  region?: string
  country?: string
}) {
  const name = place.name ?? place.city ?? ""
  return [name, place.region, place.country].filter(Boolean).join(", ")
}
