import { localDb } from "./db"
import type { SyncState } from "./types"

function deviceName() {
  if (typeof navigator === "undefined") {
    return "Пристрій"
  }
  const ua = navigator.userAgent
  if (/iPhone|iPad/i.test(ua)) {
    return "iPhone"
  }
  if (/Android/i.test(ua)) {
    return "Android"
  }
  return "Браузер"
}

export async function getOrCreateDevice(): Promise<SyncState | null> {
  const db = localDb
  if (!db) {
    return null
  }

  const existing = await db.syncState.get("self")
  if (existing) {
    return existing
  }

  const created: SyncState = {
    id: "self",
    deviceId: crypto.randomUUID(),
    deviceName: deviceName(),
    farmCursor: null,
    kbRevision: 0,
  }
  await db.syncState.put(created)
  return created
}
