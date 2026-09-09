"use client"

import { useCallback, useSyncExternalStore } from "react"

import {
  getPlantCare,
  getServerPlantCare,
  isCareDoneToday,
  setCareDone,
  subscribePlantCare,
  type CareKind,
} from "./care"

export function usePlantCare() {
  const state = useSyncExternalStore(
    subscribePlantCare,
    getPlantCare,
    getServerPlantCare
  )

  const isDone = useCallback(
    (plantId: string, kind: CareKind) => isCareDoneToday(state, plantId, kind),
    [state]
  )

  const toggle = useCallback((plantId: string, kind: CareKind, done: boolean) => {
    setCareDone(plantId, kind, done)
  }, [])

  return { state, isDone, toggle }
}
