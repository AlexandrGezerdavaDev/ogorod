import { localDb } from "@/features/sync/db"
import { getOrCreateDevice } from "@/features/sync/device"
import { syncNow } from "@/features/sync/engine"
import type { LocalField } from "@/features/sync/db"

export function normalizeSpaceName(name: string) {
  return name.trim().replace(/\s+/g, " ")
}

async function findSpaceByName(
  organizationId: string,
  name: string,
  exceptId?: string
) {
  const db = localDb
  if (!db) {
    return undefined
  }
  const needle = normalizeSpaceName(name).toLowerCase()
  return (await db.fields.toArray()).find(
    (row) =>
      row.organizationId === organizationId &&
      !row.deletedAt &&
      row.id !== exceptId &&
      normalizeSpaceName(row.name).toLowerCase() === needle
  )
}

export async function createField(organizationId: string, name: string) {
  const db = localDb
  const device = await getOrCreateDevice()
  if (!db || !device) {
    throw new Error("no_device")
  }

  const spaceName = normalizeSpaceName(name)
  if (!spaceName) {
    throw new Error("invalid_name")
  }
  if (await findSpaceByName(organizationId, spaceName)) {
    throw new Error("duplicate_name")
  }

  const now = new Date().toISOString()
  const id = crypto.randomUUID()
  const field: LocalField = {
    id,
    organizationId,
    name: spaceName,
    version: 1,
    syncStatus: "pending",
    createdAt: now,
    updatedAt: now,
  }

  await db.transaction("rw", [db.fields, db.outbox], async () => {
    await db.fields.put(field)
    await db.outbox.add({
      id: crypto.randomUUID(),
      deviceId: device.deviceId,
      entity: "field",
      entityId: id,
      operation: "upsert",
      expectedVersion: 0,
      payload: { name: spaceName },
      attempts: 0,
      createdAt: now,
    })
  })

  void syncNow()
  return id
}

export async function updateField(id: string, name: string) {
  const db = localDb
  const device = await getOrCreateDevice()
  if (!db || !device) {
    throw new Error("no_device")
  }

  const field = await db.fields.get(id)
  if (!field || field.deletedAt) {
    throw new Error("not_found")
  }

  const spaceName = normalizeSpaceName(name)
  if (!spaceName) {
    throw new Error("invalid_name")
  }
  if (await findSpaceByName(field.organizationId, spaceName, id)) {
    throw new Error("duplicate_name")
  }
  if (spaceName === field.name) {
    return id
  }

  const now = new Date().toISOString()
  const payload = { name: spaceName }

  await db.transaction("rw", [db.fields, db.outbox], async () => {
    await db.fields.update(id, {
      name: spaceName,
      updatedAt: now,
      syncStatus: "pending",
    })

    const pendingUpserts = await db.outbox
      .where("entityId")
      .equals(id)
      .filter((item) => item.entity === "field" && item.operation === "upsert")
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
      entity: "field",
      entityId: id,
      operation: "upsert",
      expectedVersion: field.version,
      payload,
      attempts: 0,
      createdAt: now,
    })
  })

  void syncNow()
  return id
}
