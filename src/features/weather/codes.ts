import type { WeatherKind } from "./types"

export function weatherKind(code: number): WeatherKind {
  if (code === 0) {
    return "clear"
  }
  if (code <= 3) {
    return "clouds"
  }
  if (code <= 48) {
    return "fog"
  }
  if (code <= 67 || (code >= 80 && code <= 82)) {
    return "rain"
  }
  if (code <= 77 || (code >= 85 && code <= 86)) {
    return "snow"
  }
  if (code >= 95) {
    return "thunder"
  }
  return "other"
}

export function hasFrostRisk(days: { tMin: number }[]) {
  return days.slice(0, 2).some((day) => day.tMin <= 1)
}
