import { loadPreferences } from "@/features/settings/preferences"

import { localDb } from "./db"
import { getOrCreateDevice } from "./device"
import { markSynced } from "./status"
import type { OutboxEntity, OutboxItem, SyncOperation } from "./types"

type PushResult = {
  accepted: string[]
  duplicates: string[]
  conflicts: { id: string; server: Record<string, unknown> | null }[]
}

type PullResult = {
  kb: {
    revision: number
    changes: {
      entity: string
      entityId: string
      operation: string
      record: Record<string, unknown> | null
    }[]
  }
  changes: {
    entity: OutboxEntity
    entityId: string
    operation: SyncOperation
    version: number
    record: Record<string, unknown> | null
  }[]
  nextCursor: string | null
  hasMore: boolean
}

async function readJson<T>(response: Response) {
  const type = response.headers.get("content-type") ?? ""
  if (!type.includes("application/json")) {
    return null
  }
  return (await response.json()) as T
}

async function drainOutbox(force = false) {
  try {
    if (!force && !loadPreferences().sync.auto) {
      return
    }
    const db = localDb
    const device = await getOrCreateDevice()
    if (!db || !device || !navigator.onLine) {
      return
    }

    const items = await db.outbox.orderBy("createdAt").toArray()
    if (items.length > 0) {
      await pushItems(db, device.deviceId, device.deviceName, items)
    }

    await pullRemote(db, device.deviceId, device.deviceName)
    markSynced()
  } catch {
    return
  }
}

export function syncNow() {
  return drainOutbox(true)
}

async function pushItems(
  db: NonNullable<typeof localDb>,
  deviceId: string,
  deviceName: string,
  items: OutboxItem[]
) {
  try {
    const response = await fetch("/api/sync/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId,
        deviceName,
        items: items.map((item) => ({
          id: item.id,
          entity: item.entity,
          entityId: item.entityId,
          operation: item.operation,
          expectedVersion: item.expectedVersion,
          payload: item.payload,
        })),
      }),
    })

    if (!response.ok) {
      throw new Error(`sync push failed: ${response.status}`)
    }

    const result = await readJson<PushResult>(response)
    if (!result) {
      throw new Error("sync push returned non-json")
    }
    const accepted = new Set([...(result.accepted ?? []), ...(result.duplicates ?? [])])
    const conflicts = new Map(
      (result.conflicts ?? []).map((row) => [row.id, row.server] as const)
    )

    await db.transaction(
      "rw",
      [db.outbox, db.fields, db.plantings, db.observations, db.harvests, db.seedLots],
      async () => {
      for (const item of items) {
        if (accepted.has(item.id)) {
          await db.outbox.delete(item.id)
          continue
        }
        if (conflicts.has(item.id)) {
          await db.outbox.update(item.id, {
            attempts: item.attempts + 1,
            lastError: "conflict",
          })
          await markConflict(db, item, conflicts.get(item.id) ?? null)
          continue
        }
        await db.outbox.update(item.id, {
          attempts: item.attempts + 1,
          lastError: "not accepted",
        })
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "sync failed"
    await db.transaction("rw", db.outbox, async () => {
      for (const item of items) {
        await db.outbox.update(item.id, {
          attempts: item.attempts + 1,
          lastError: message,
        })
      }
    })
  }
}

async function markConflict(
  db: NonNullable<typeof localDb>,
  item: OutboxItem,
  server: Record<string, unknown> | null
) {
  const version = typeof server?.version === "number" ? server.version : item.expectedVersion
  if (item.entity === "field") {
    await db.fields.update(item.entityId, { syncStatus: "conflict", version })
  }
  if (item.entity === "planting") {
    await db.plantings.update(item.entityId, { syncStatus: "conflict", version })
  }
  if (item.entity === "observation") {
    await db.observations.update(item.entityId, { syncStatus: "conflict", version })
  }
  if (item.entity === "harvest") {
    await db.harvests.update(item.entityId, { syncStatus: "conflict", version })
  }
  if (item.entity === "seed_lot") {
    await db.seedLots.update(item.entityId, { syncStatus: "conflict", version })
  }
}

async function pullRemote(
  db: NonNullable<typeof localDb>,
  deviceId: string,
  deviceName: string
) {
  const state = await db.syncState.get("self")
  const params = new URLSearchParams()
  params.set("deviceId", deviceId)
  params.set("deviceName", deviceName)
  params.set("kbRevision", String(state?.kbRevision ?? 0))
  if (state?.farmCursor) {
    params.set("cursor", state.farmCursor)
  }

  const response = await fetch(`/api/sync/pull?${params.toString()}`)
  if (!response.ok) {
    return
  }

  const result = await readJson<PullResult>(response)
  if (!result) {
    return
  }
  await applyPull(db, result)
}

async function applyPull(db: NonNullable<typeof localDb>, result: PullResult) {
  await db.transaction(
    "rw",
    [
      db.species,
      db.cultivar,
      db.disease,
      db.classificationGroup,
      db.classificationValue,
      db.speciesClassification,
      db.speciesDisease,
      db.careProfile,
      db.fields,
      db.plantings,
      db.observations,
      db.harvests,
      db.seedLots,
      db.syncState,
    ],
    async () => {
      for (const change of result.kb.changes) {
        if (change.operation === "delete" || !change.record) {
          await deleteKbRecord(db, change.entity, change.entityId)
          continue
        }
        await putKbRecord(db, change.entity, change.entityId, change.record)
      }

      for (const change of result.changes) {
        if (!change.record) {
          continue
        }
        await putFarmRecord(db, change.entity, change.record)
      }

      await db.syncState.update("self", {
        kbRevision: result.kb.revision,
        farmCursor: result.nextCursor,
      })
    }
  )
}

async function deleteKbRecord(
  db: NonNullable<typeof localDb>,
  entity: string,
  entityId: string
) {
  if (entity === "species") await db.species.delete(entityId)
  if (entity === "cultivar") await db.cultivar.delete(entityId)
  if (entity === "disease") await db.disease.delete(entityId)
  if (entity === "classification_group") await db.classificationGroup.delete(entityId)
  if (entity === "classification_value") await db.classificationValue.delete(entityId)
  if (entity === "species_classification") await db.speciesClassification.delete(entityId)
  if (entity === "species_disease") await db.speciesDisease.delete(entityId)
  if (entity === "care_profile") await db.careProfile.delete(entityId)
}

async function putKbRecord(
  db: NonNullable<typeof localDb>,
  entity: string,
  entityId: string,
  record: Record<string, unknown>
) {
  if (entity === "species") {
    await db.species.put({
      id: String(record.id),
      scientificName: String(record.scientificName ?? ""),
      commonNameUk: String(record.commonNameUk ?? ""),
      commonNameEn: record.commonNameEn ? String(record.commonNameEn) : null,
    })
  }
  if (entity === "cultivar") {
    await db.cultivar.put({
      id: String(record.id),
      speciesId: String(record.speciesId ?? ""),
      name: String(record.name ?? ""),
    })
  }
  if (entity === "disease") {
    await db.disease.put({
      id: String(record.id),
      nameUk: String(record.nameUk ?? ""),
      nameEn: record.nameEn ? String(record.nameEn) : null,
    })
  }
  if (entity === "classification_group") {
    await db.classificationGroup.put({
      id: String(record.id),
      nameUk: String(record.nameUk ?? ""),
      nameEn: record.nameEn ? String(record.nameEn) : null,
      type: String(record.type ?? ""),
    })
  }
  if (entity === "classification_value") {
    await db.classificationValue.put({
      id: String(record.id),
      groupId: String(record.groupId ?? ""),
      nameUk: String(record.nameUk ?? ""),
      nameEn: record.nameEn ? String(record.nameEn) : null,
    })
  }
  if (entity === "species_classification") {
    const speciesId = String(record.speciesId ?? "")
    const classificationValueId = String(record.classificationValueId ?? "")
    await db.speciesClassification.put({
      id: entityId || `${speciesId}::${classificationValueId}`,
      speciesId,
      classificationValueId,
    })
  }
  if (entity === "species_disease") {
    const speciesId = String(record.speciesId ?? "")
    const diseaseId = String(record.diseaseId ?? "")
    await db.speciesDisease.put({
      id: entityId || `${speciesId}::${diseaseId}`,
      speciesId,
      diseaseId,
    })
  }
  if (entity === "care_profile") {
    await db.careProfile.put({
      id: String(record.id),
      speciesId: String(record.speciesId ?? ""),
      imageUrl: record.imageUrl ? String(record.imageUrl) : null,
      growing: (record.growing as Record<string, Record<string, string>>) ?? {},
      genetics: (record.genetics as Record<string, Record<string, string>>) ?? {},
      usage: (record.usage as Record<string, Record<string, string>>) ?? {},
    })
  }
}

async function putFarmRecord(
  db: NonNullable<typeof localDb>,
  entity: OutboxEntity,
  record: Record<string, unknown>
) {
  const base = {
    id: String(record.id),
    organizationId: String(record.organizationId ?? ""),
    version: Number(record.version ?? 1),
    syncStatus: "synced" as const,
    createdAt: String(record.createdAt ?? ""),
    updatedAt: String(record.updatedAt ?? ""),
    deletedAt: record.deletedAt ? String(record.deletedAt) : null,
  }

  if (entity === "field") {
    await db.fields.put({ ...base, name: String(record.name ?? "") })
  }
  if (entity === "planting") {
    const quantity =
      typeof record.quantity === "number" && record.quantity >= 1
        ? Math.trunc(record.quantity)
        : 1
    await db.plantings.put({
      ...base,
      fieldId: String(record.fieldId ?? ""),
      speciesId: record.speciesId ? String(record.speciesId) : null,
      cultivarId: record.cultivarId ? String(record.cultivarId) : null,
      nickname: record.nickname ? String(record.nickname) : null,
      plantedAt: record.plantedAt ? String(record.plantedAt) : null,
      quantity,
      photoUrl: record.photoUrl ? String(record.photoUrl) : null,
    })
  }
  if (entity === "observation") {
    await db.observations.put({
      ...base,
      plantingId: String(record.plantingId ?? ""),
      note: record.note ? String(record.note) : null,
      photoKey: record.photoKey ? String(record.photoKey) : null,
      latitude: typeof record.latitude === "number" ? record.latitude : null,
      longitude: typeof record.longitude === "number" ? record.longitude : null,
      observedAt: String(record.observedAt ?? base.updatedAt),
    })
  }
  if (entity === "harvest") {
    await db.harvests.put({
      ...base,
      plantingId: String(record.plantingId ?? ""),
      quantity: typeof record.quantity === "number" ? record.quantity : null,
      unit: record.unit ? String(record.unit) : null,
      note: record.note ? String(record.note) : null,
      harvestedAt: String(record.harvestedAt ?? base.updatedAt),
    })
  }
  if (entity === "seed_lot") {
    await db.seedLots.put({
      ...base,
      speciesId: record.speciesId ? String(record.speciesId) : null,
      cultivarId: record.cultivarId ? String(record.cultivarId) : null,
      name: record.name ? String(record.name) : String(record.cultivarId ?? "—"),
      quantity: typeof record.quantity === "number" ? record.quantity : 0,
      unit: record.unit ? String(record.unit) : "шт",
      packedAt: record.packedAt ? String(record.packedAt) : null,
      photoUrl: record.photoUrl ? String(record.photoUrl) : null,
    })
  }
}

export function startSyncEngine() {
  if (typeof window === "undefined") {
    return () => undefined
  }

  const run = () => {
    void drainOutbox()
  }

  const onVisibility = () => {
    if (document.visibilityState === "visible") {
      run()
    }
  }

  window.addEventListener("online", run)
  document.addEventListener("visibilitychange", onVisibility)
  run()

  return () => {
    window.removeEventListener("online", run)
    document.removeEventListener("visibilitychange", onVisibility)
  }
}
