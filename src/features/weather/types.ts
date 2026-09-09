export type WeatherKind =
  | "clear"
  | "clouds"
  | "fog"
  | "rain"
  | "snow"
  | "thunder"
  | "other"

export type WeatherDay = {
  date: string
  tMax: number
  tMin: number
  precipitation: number
  weatherCode: number
  et0: number | null
}

export type WeatherSnapshot = {
  fetchedAt: string
  timezone: string
  temperatureUnit: "c" | "f"
  current: {
    temperature: number
    weatherCode: number
    precipitation: number
  }
  daily: WeatherDay[]
  frost: boolean
  fromCache?: boolean
}

export type LocalWeather = WeatherSnapshot & {
  id: string
  latitude: number
  longitude: number
}
