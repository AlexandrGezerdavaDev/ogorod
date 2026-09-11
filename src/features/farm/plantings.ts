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
  quantity?: number
}

function normalizeQuantity(value: number | undefined) {
  if (value === undefined) {
    return 1
  }
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 1) {
    throw new Error("invalid_quantity")
  }
  return value
}

function plantingPayload(planting: {
  fieldId: string
  speciesId?: string | null
  cultivarId?: string | null
  nickname?: string | null
  plantedAt?: string | null
  quantity: number
}) {
  return {
    fieldId: planting.fieldId,
    speciesId: planting.speciesId ?? null,
    cultivarId: planting.cultivarId ?? null,
    nickname: planting.nickname ?? null,
    plantedAt: planting.plantedAt ?? null,
    quantity: planting.quantity,
  }
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
  const quantity = normalizeQuantity(input.quantity)
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
    quantity,
    version: 1,
    syncStatus: "pending",
    createdAt: now,
    updatedAt: now,
  }

  const payload = plantingPayload(planting)

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

export async function updatePlantingQuantity(id: string, quantity: number) {
  const nextQuantity = normalizeQuantity(quantity)
  const db = localDb
  const device = await getOrCreateDevice()
  if (!db || !device) {
    throw new Error("no_device")
  }

  const planting = await db.plantings.get(id)
  if (!planting || planting.deletedAt) {
    throw new Error("not_found")
  }

  const now = new Date().toISOString()
  const payload = plantingPayload({
    fieldId: planting.fieldId,
    speciesId: planting.speciesId,
    cultivarId: planting.cultivarId,
    nickname: planting.nickname,
    plantedAt: planting.plantedAt,
    quantity: nextQuantity,
  })

  await db.transaction("rw", [db.plantings, db.outbox], async () => {
    await db.plantings.update(id, {
      quantity: nextQuantity,
      updatedAt: now,
      syncStatus: "pending",
    })

    const pendingUpserts = await db.outbox
      .where("entityId")
      .equals(id)
      .filter((item) => item.entity === "planting" && item.operation === "upsert")
      .toArray()

    if (pendingUpserts.length > 0) {
      const [first, ...rest] = pendingUpserts
      await db.outbox.update(first.id, { payload })
      for (const item of rest) {
        await db.outbox.delete(item.id)
      }
      return
    }

    await db.outbox.add({
      id: crypto.randomUUID(),
      deviceId: device.deviceId,
      entity: "planting",
      entityId: id,
      operation: "upsert",
      expectedVersion: planting.version,
      payload,
      attempts: 0,
      createdAt: now,
    })
  })

  void syncNow()
}
