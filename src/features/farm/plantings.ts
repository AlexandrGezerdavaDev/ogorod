import { localDb } from "@/features/sync/db"
import { getOrCreateDevice } from "@/features/sync/device"
import { syncNow } from "@/features/sync/engine"
import type { LocalPlanting } from "@/features/sync/db"

export type CreatePlantingInput = {
  organizationId: string
  speciesId: string
  name: string
  fieldId: string
  cultivarId?: string | null
  plantedAt?: string | null
}

export async function createPlanting(input: CreatePlantingInput) {
  const db = localDb
  const device = await getOrCreateDevice()
  if (!db || !device) {
    throw new Error("no_device")
  }

  const name = input.name.trim()
  const speciesId = input.speciesId.trim()
  const fieldId = input.fieldId.trim()
  if (!name) {
    throw new Error("invalid_name")
  }
  if (!speciesId) {
    throw new Error("invalid_species")
  }
  if (!fieldId) {
    throw new Error("invalid_field")
  }

  const field = await db.fields.get(fieldId)
  if (
    !field ||
    field.deletedAt ||
    field.organizationId !== input.organizationId
  ) {
    throw new Error("invalid_field")
  }

  const now = new Date().toISOString()
  const id = crypto.randomUUID()
  const plantedAt = input.plantedAt?.trim() ? input.plantedAt : null
  const cultivarId = input.cultivarId?.trim() || null
  const planting: LocalPlanting = {
    id,
    organizationId: input.organizationId,
    fieldId,
    speciesId,
    cultivarId,
    nickname: name,
    plantedAt,
    version: 1,
    syncStatus: "pending",
    createdAt: now,
    updatedAt: now,
  }

  const payload = {
    fieldId,
    speciesId,
    cultivarId,
    nickname: name,
    plantedAt,
  }

  await db.transaction("rw", [db.plantings, db.outbox], async () => {
    await db.plantings.put(planting)
    await db.outbox.add({
      id: crypto.randomUUID(),
      deviceId: device.deviceId,
      entity: "planting",
      entityId: id,
      operation: "upsert",
      expectedVersion: 0,
      payload,
      attempts: 0,
      createdAt: now,
    })
  })

  void syncNow()
  return id
}

export async function deletePlanting(id: string) {
  const db = localDb
  const device = await getOrCreateDevice()
  if (!db || !device) {
    throw new Error("no_device")
  }

  const planting = await db.plantings.get(id)
  if (!planting || planting.deletedAt) {
    return
  }

  const now = new Date().toISOString()

  await db.transaction("rw", [db.plantings, db.outbox], async () => {
    const pending = await db.outbox
      .where("entityId")
      .equals(id)
      .filter((item) => item.entity === "planting")
      .toArray()
    const neverSynced = pending.some(
      (item) => item.operation === "upsert" && item.expectedVersion === 0
    )

    for (const item of pending) {
      await db.outbox.delete(item.id)
    }

    if (neverSynced) {
      await db.plantings.delete(id)
      return
    }

    await db.plantings.update(id, {
      deletedAt: now,
      updatedAt: now,
      syncStatus: "pending",
    })
    await db.outbox.add({
      id: crypto.randomUUID(),
      deviceId: device.deviceId,
      entity: "planting",
      entityId: id,
      operation: "delete",
      expectedVersion: planting.version,
      payload: {},
      attempts: 0,
      createdAt: now,
    })
  })

  void syncNow()
}
