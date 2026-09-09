"use client"

import * as React from "react"

import {
  applyAppearance,
  defaultPreferences,
  gardenPlace,
  loadPreferences,
  savePreferences,
  type DevicePreferences,
  type GardenPlace,
} from "./preferences"

const listeners = new Set<() => void>()
let current = defaultPreferences

if (typeof window !== "undefined") {
  current = loadPreferences()
  applyAppearance()
}

function emit() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getPreferences() {
  return current
}

export function updatePreferences(
  updater: (value: DevicePreferences) => DevicePreferences
) {
  current = updater(current)
  savePreferences(current)
  emit()
}

type PreferencesContextValue = {
  prefs: DevicePreferences
  setPrefs: (updater: (current: DevicePreferences) => DevicePreferences) => void
  placeFor: (gardenId: string) => GardenPlace
  setPlace: (gardenId: string, place: GardenPlace) => void
}

const PreferencesContext = React.createContext<PreferencesContextValue | null>(
  null
)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const prefs = React.useSyncExternalStore(
    subscribe,
    getPreferences,
    () => defaultPreferences
  )

  const setPrefs = React.useCallback(
    (updater: (value: DevicePreferences) => DevicePreferences) => {
      updatePreferences(updater)
    },
    []
  )

  const setPlace = React.useCallback((gardenId: string, place: GardenPlace) => {
    updatePreferences((value) => ({
      ...value,
      places: { ...value.places, [gardenId]: place },
    }))
  }, [])

  const placeFor = React.useCallback(
    (gardenId: string) => gardenPlace(prefs, gardenId),
    [prefs]
  )

  return (
    <PreferencesContext.Provider
      value={{ prefs, setPrefs, placeFor, setPlace }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = React.useContext(PreferencesContext)
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider")
  }
  return context
}
