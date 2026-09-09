import { localDb } from "@/features/sync/db"
import { getOrCreateDevice } from "@/features/sync/device"
import { syncNow } from "@/features/sync/engine"
import type { LocalSeedLot } from "@/features/sync/db"

export type SeedUnit = "шт" | "г"

export type CreateSeedLotInput = {
  organizationId: string
  speciesId: string
  name: string
  cultivarId?: string | null
  quantity: number
  unit: SeedUnit
  packedAt?: string | null
}

export function normalizeSeedUnit(unit: string): SeedUnit {
  if (unit === "г" || unit === "g") {
    return "г"
  }
  return "шт"
}

export async function createSeedLot(input: CreateSeedLotInput) {
  const db = localDb
  const device = await getOrCreateDevice()
  if (!db || !device) {
    throw new Error("no_device")
  }

  const name = input.name.trim()
  if (!name) {
    throw new Error("invalid_name")
  }
  if (!input.speciesId.trim()) {
    throw new Error("invalid_species")
  }

  const now = new Date().toISOString()
  const id = crypto.randomUUID()
  const packedAt = input.packedAt?.trim() ? input.packedAt : null
  const cultivarId = input.cultivarId?.trim() || null
  const lot: LocalSeedLot = {
    id,
    organizationId: input.organizationId,
    speciesId: input.speciesId,
    cultivarId,
    name,
    quantity: input.quantity,
    unit: input.unit,
    packedAt,
    version: 1,
    syncStatus: "pending",
    createdAt: now,
    updatedAt: now,
  }

  const payload = {
    speciesId: input.speciesId,
    cultivarId,
    name,
    quantity: input.quantity,
    unit: input.unit,
    packedAt,
  }

  await db.transaction("rw", [db.seedLots, db.outbox], async () => {
    await db.seedLots.put(lot)
    await db.outbox.add({
      id: crypto.randomUUID(),
      deviceId: device.deviceId,
      entity: "seed_lot",
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

export async function deleteSeedLot(id: string) {
  const db = localDb
  const device = await getOrCreateDevice()
  if (!db || !device) {
    throw new Error("no_device")
  }

  const lot = await db.seedLots.get(id)
  if (!lot || lot.deletedAt) {
    return
  }

  const now = new Date().toISOString()

  await db.transaction("rw", [db.seedLots, db.outbox], async () => {
    const pending = await db.outbox
      .where("entityId")
      .equals(id)
      .filter((item) => item.entity === "seed_lot")
      .toArray()
    const neverSynced = pending.some(
      (item) => item.operation === "upsert" && item.expectedVersion === 0
    )

    for (const item of pending) {
      await db.outbox.delete(item.id)
    }

    if (neverSynced) {
      await db.seedLots.delete(id)
      return
    }

    await db.seedLots.update(id, {
      deletedAt: now,
      updatedAt: now,
      syncStatus: "pending",
    })
    await db.outbox.add({
      id: crypto.randomUUID(),
      deviceId: device.deviceId,
      entity: "seed_lot",
      entityId: id,
      operation: "delete",
      expectedVersion: lot.version,
      payload: {},
      attempts: 0,
      createdAt: now,
    })
  })

  void syncNow()
}

export async function updateSeedLotQuantity(id: string, quantity: number) {
  if (!Number.isFinite(quantity) || quantity < 0) {
    throw new Error("invalid_quantity")
  }

  const db = localDb
  const device = await getOrCreateDevice()
  if (!db || !device) {
    throw new Error("no_device")
  }

  const lot = await db.seedLots.get(id)
  if (!lot || lot.deletedAt) {
    throw new Error("not_found")
  }

  const now = new Date().toISOString()
  const payload = {
    speciesId: lot.speciesId ?? null,
    cultivarId: lot.cultivarId ?? null,
    name: lot.name,
    quantity,
    unit: lot.unit,
    packedAt: lot.packedAt ?? null,
  }

  await db.transaction("rw", [db.seedLots, db.outbox], async () => {
    await db.seedLots.update(id, {
      quantity,
      updatedAt: now,
      syncStatus: "pending",
    })

    const pendingUpserts = await db.outbox
      .where("entityId")
      .equals(id)
      .filter((item) => item.entity === "seed_lot" && item.operation === "upsert")
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
      entity: "seed_lot",
      entityId: id,
      operation: "upsert",
      expectedVersion: lot.version,
      payload,
      attempts: 0,
      createdAt: now,
    })
  })

  void syncNow()
}
