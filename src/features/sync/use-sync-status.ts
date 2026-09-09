"use client"

import * as React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { readLastSyncedAt, readSyncCounts, SYNC_EVENT } from "./status"

function subscribeOnline(onChange: () => void) {
  window.addEventListener("online", onChange)
  window.addEventListener("offline", onChange)
  return () => {
    window.removeEventListener("online", onChange)
    window.removeEventListener("offline", onChange)
  }
}

function subscribeSync(onChange: () => void) {
  window.addEventListener(SYNC_EVENT, onChange)
  return () => {
    window.removeEventListener(SYNC_EVENT, onChange)
  }
}

const SERVER_ONLINE = true
const SERVER_LAST_SYNC: Date | null = null

export function useSyncStatus() {
  const queryClient = useQueryClient()
  const online = React.useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => SERVER_ONLINE
  )
  const lastSyncedAt = React.useSyncExternalStore(
    subscribeSync,
    readLastSyncedAt,
    () => SERVER_LAST_SYNC
  )
  const counts = useQuery({
    queryKey: ["sync-status-counts"],
    queryFn: readSyncCounts,
  })

  React.useEffect(() => {
    const onSync = () => {
      void queryClient.invalidateQueries({ queryKey: ["sync-status-counts"] })
    }
    window.addEventListener(SYNC_EVENT, onSync)
    return () => window.removeEventListener(SYNC_EVENT, onSync)
  }, [queryClient])

  return {
    online,
    lastSyncedAt,
    pending: counts.data?.pending ?? 0,
    conflicts: counts.data?.conflicts ?? 0,
    refresh: counts.refetch,
  }
}
