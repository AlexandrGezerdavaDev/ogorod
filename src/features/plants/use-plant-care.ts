"use client"

import { useCallback, useSyncExternalStore } from "react"

import {
  getCareDate,
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

  const lastDate = useCallback(
    (plantId: string, kind: CareKind) => getCareDate(state, plantId, kind),
    [state]
  )

  const toggle = useCallback((plantId: string, kind: CareKind) => {
    const current = getPlantCare()
    setCareDone(plantId, kind, !isCareDoneToday(current, plantId, kind))
  }, [])

  return { state, isDone, lastDate, toggle }
}
