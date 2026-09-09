import { localDb } from "./db"

export const LAST_SYNC_KEY = "ogorod.lastSyncedAt"
export const SYNC_EVENT = "ogorod:sync"

let cachedRaw: string | null = null
let cachedAt: Date | null = null
let cacheReady = false

function remember(raw: string | null) {
  if (cacheReady && raw === cachedRaw) {
    return cachedAt
  }
  cacheReady = true
  cachedRaw = raw
  if (!raw) {
    cachedAt = null
    return null
  }
  const date = new Date(raw)
  cachedAt = Number.isNaN(date.getTime()) ? null : date
  return cachedAt
}

export function markSynced(at = new Date()) {
  if (typeof window === "undefined") {
    return
  }
  const raw = at.toISOString()
  window.localStorage.setItem(LAST_SYNC_KEY, raw)
  remember(raw)
  window.dispatchEvent(new Event(SYNC_EVENT))
}

export function readLastSyncedAt(): Date | null {
  if (typeof window === "undefined") {
    return null
  }
  return remember(window.localStorage.getItem(LAST_SYNC_KEY))
}

export async function readSyncCounts() {
  const db = localDb
  if (!db) {
    return { pending: 0, conflicts: 0 }
  }

  const [pending, fieldConflicts, plantingConflicts, observationConflicts, harvestConflicts, seedConflicts] =
    await Promise.all([
      db.outbox.count(),
      db.fields.where("syncStatus").equals("conflict").count(),
      db.plantings.where("syncStatus").equals("conflict").count(),
      db.observations.where("syncStatus").equals("conflict").count(),
      db.harvests.where("syncStatus").equals("conflict").count(),
      db.seedLots.where("syncStatus").equals("conflict").count(),
    ])

  return {
    pending,
    conflicts:
      fieldConflicts +
      plantingConflicts +
      observationConflicts +
      harvestConflicts +
      seedConflicts,
  }
}

export async function exportLocalData() {
  const db = localDb
  const tables = db
    ? {
        species: await db.species.toArray(),
        cultivar: await db.cultivar.toArray(),
        disease: await db.disease.toArray(),
        fields: await db.fields.toArray(),
        plantings: await db.plantings.toArray(),
        observations: await db.observations.toArray(),
        harvests: await db.harvests.toArray(),
        seedLots: await db.seedLots.toArray(),
        outbox: await db.outbox.toArray(),
        syncState: await db.syncState.toArray(),
      }
    : {}

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    preferences: window.localStorage.getItem("ogorod.preferences"),
    lastSyncedAt: window.localStorage.getItem(LAST_SYNC_KEY),
    tables,
  }
}

export async function clearLocalData() {
  const db = localDb
  if (db) {
    await db.delete()
  }
  window.localStorage.removeItem("ogorod.preferences")
  window.localStorage.removeItem(LAST_SYNC_KEY)
  remember(null)
}
