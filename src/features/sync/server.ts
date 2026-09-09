import { and, asc, eq, gt, inArray } from "drizzle-orm"

import { db } from "@/db"
import { appendFarmChange } from "@/db/change-log"
import {
  cultivar,
  device,
  disease,
  farmChange,
  field,
  harvest,
  kbChange,
  observation,
  planting,
  seedLot,
  species,
  syncReceipt,
} from "@/db/schema"

export type FarmEntity = "field" | "planting" | "observation" | "harvest" | "seed_lot"
export type KbEntity = "species" | "cultivar" | "disease"
export type SyncOperation = "upsert" | "delete"

export type PushItem = {
  id: string
  entity: FarmEntity
  entityId: string
  operation: SyncOperation
  expectedVersion: number
  payload: Record<string, unknown>
}

export type ApplyStatus = "accepted" | "duplicate" | "conflict"

export type ApplyResult = {
  itemId: string
  status: ApplyStatus
  server?: Record<string, unknown>
}

const PULL_LIMIT = 200

export function encodeFarmCursor(seq: number) {
  return Buffer.from(JSON.stringify({ v: 1, seq }), "utf8").toString("base64url")
}

export function decodeFarmCursor(cursor: string | null) {
  if (!cursor) {
    return 0
  }
  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as {
      seq?: unknown
    }
    return typeof parsed.seq === "number" && Number.isFinite(parsed.seq) && parsed.seq >= 0
      ? parsed.seq
      : 0
  } catch {
    return 0
  }
}

export async function ensureDevice(input: {
  deviceId: string
  userId: string
  name: string
}) {
  const now = new Date()
  const [existing] = await db
    .select()
    .from(device)
    .where(eq(device.id, input.deviceId))
    .limit(1)

  if (existing && existing.userId !== input.userId) {
    return { ok: false as const, error: "device_owned" as const }
  }

  if (existing) {
    await db
      .update(device)
      .set({ name: input.name, lastSeenAt: now })
      .where(eq(device.id, input.deviceId))
    return { ok: true as const }
  }

  await db.insert(device).values({
    id: input.deviceId,
    userId: input.userId,
    name: input.name,
    lastSeenAt: now,
  })
  return { ok: true as const }
}

export async function applyPushItems(input: {
  organizationId: string
  deviceId: string
  items: PushItem[]
}) {
  const results: ApplyResult[] = []

  for (const item of input.items) {
    const [receipt] = await db
      .select({ itemId: syncReceipt.itemId })
      .from(syncReceipt)
      .where(
        and(eq(syncReceipt.deviceId, input.deviceId), eq(syncReceipt.itemId, item.id))
      )
      .limit(1)

    if (receipt) {
      results.push({ itemId: item.id, status: "duplicate" })
      continue
    }

    const applied = await applyFarmItem(input.organizationId, item)
    if (applied.status === "accepted") {
      await db.insert(syncReceipt).values({
        deviceId: input.deviceId,
        itemId: item.id,
      })
    }
    results.push({ itemId: item.id, ...applied })
  }

  return results
}

async function applyFarmItem(
  organizationId: string,
  item: PushItem
): Promise<Omit<ApplyResult, "itemId">> {
  if (item.operation === "delete") {
    return applyDelete(organizationId, item)
  }
  return applyUpsert(organizationId, item)
}

async function applyUpsert(organizationId: string, item: PushItem) {
  const now = new Date()
  const nextVersion = item.expectedVersion + 1

  if (item.expectedVersion === 0) {
    const created = await insertFarmRow(organizationId, item, now)
    if (created) {
      await appendFarmChange({
        organizationId,
        entity: item.entity,
        entityId: item.entityId,
        operation: "upsert",
        version: 1,
      })
      return { status: "accepted" as const }
    }
    const server = await loadFarmRow(item.entity, item.entityId, organizationId)
    return { status: "conflict" as const, server: server ?? undefined }
  }

  const updated = await updateFarmRow(organizationId, item, now, nextVersion)
  if (updated) {
    await appendFarmChange({
      organizationId,
      entity: item.entity,
      entityId: item.entityId,
      operation: "upsert",
      version: nextVersion,
    })
    return { status: "accepted" as const }
  }

  const server = await loadFarmRow(item.entity, item.entityId, organizationId)
  return { status: "conflict" as const, server: server ?? undefined }
}

async function applyDelete(organizationId: string, item: PushItem) {
  const now = new Date()
  const nextVersion = item.expectedVersion + 1
  const updated = await tombstoneFarmRow(organizationId, item, now, nextVersion)
  if (updated) {
    await appendFarmChange({
      organizationId,
      entity: item.entity,
      entityId: item.entityId,
      operation: "delete",
      version: nextVersion,
    })
    return { status: "accepted" as const }
  }
  const server = await loadFarmRow(item.entity, item.entityId, organizationId)
  return { status: "conflict" as const, server: server ?? undefined }
}

async function insertFarmRow(organizationId: string, item: PushItem, now: Date) {
  const payload = item.payload
  if (item.entity === "field") {
    const [row] = await db
      .insert(field)
      .values({
        id: item.entityId,
        organizationId,
        name: String(payload.name ?? ""),
        version: 1,
        updatedAt: now,
      })
      .onConflictDoNothing()
      .returning({ id: field.id })
    return Boolean(row)
  }
  if (item.entity === "planting") {
    const [row] = await db
      .insert(planting)
      .values({
        id: item.entityId,
        organizationId,
        fieldId: String(payload.fieldId),
        cultivarId: payload.cultivarId ? String(payload.cultivarId) : null,
        speciesId: payload.speciesId ? String(payload.speciesId) : null,
        nickname: payload.nickname ? String(payload.nickname) : null,
        plantedAt: payload.plantedAt ? new Date(String(payload.plantedAt)) : null,
        version: 1,
        updatedAt: now,
      })
      .onConflictDoNothing()
      .returning({ id: planting.id })
    return Boolean(row)
  }
  if (item.entity === "observation") {
    const [row] = await db
      .insert(observation)
      .values({
        id: item.entityId,
        organizationId,
        plantingId: String(payload.plantingId),
        note: payload.note ? String(payload.note) : null,
        photoKey: payload.photoKey ? String(payload.photoKey) : null,
        latitude: toNumber(payload.latitude),
        longitude: toNumber(payload.longitude),
        observedAt: payload.observedAt ? new Date(String(payload.observedAt)) : now,
        version: 1,
        updatedAt: now,
      })
      .onConflictDoNothing()
      .returning({ id: observation.id })
    return Boolean(row)
  }
  if (item.entity === "harvest") {
    const [row] = await db
      .insert(harvest)
      .values({
        id: item.entityId,
        organizationId,
        plantingId: String(payload.plantingId),
        quantity: toNumber(payload.quantity),
        unit: payload.unit ? String(payload.unit) : null,
        note: payload.note ? String(payload.note) : null,
        harvestedAt: payload.harvestedAt ? new Date(String(payload.harvestedAt)) : now,
        version: 1,
        updatedAt: now,
      })
      .onConflictDoNothing()
      .returning({ id: harvest.id })
    return Boolean(row)
  }
  if (item.entity === "seed_lot") {
    const quantity = toNumber(payload.quantity)
    const cultivarId = payload.cultivarId ? String(payload.cultivarId) : null
    const speciesId = payload.speciesId ? String(payload.speciesId) : null
    const name = String(payload.name ?? "").trim() || "—"
    const [row] = await db
      .insert(seedLot)
      .values({
        id: item.entityId,
        organizationId,
        speciesId,
        cultivarId,
        name,
        quantity: quantity ?? 0,
        unit: payload.unit ? String(payload.unit) : "шт",
        packedAt: payload.packedAt ? new Date(String(payload.packedAt)) : null,
        version: 1,
        updatedAt: now,
      })
      .onConflictDoNothing()
      .returning({ id: seedLot.id })
    return Boolean(row)
  }
  return false
}

async function updateFarmRow(
  organizationId: string,
  item: PushItem,
  now: Date,
  nextVersion: number
) {
  const payload = item.payload

  if (item.entity === "field") {
    const [row] = await db
      .update(field)
      .set({ name: String(payload.name ?? ""), version: nextVersion, updatedAt: now })
      .where(
        and(
          eq(field.id, item.entityId),
          eq(field.organizationId, organizationId),
          eq(field.version, item.expectedVersion)
        )
      )
      .returning({ id: field.id })
    return Boolean(row)
  }
  if (item.entity === "planting") {
    const [row] = await db
      .update(planting)
      .set({
        fieldId: String(payload.fieldId),
        cultivarId: payload.cultivarId ? String(payload.cultivarId) : null,
        speciesId: payload.speciesId ? String(payload.speciesId) : null,
        nickname: payload.nickname ? String(payload.nickname) : null,
        plantedAt: payload.plantedAt ? new Date(String(payload.plantedAt)) : null,
        version: nextVersion,
        updatedAt: now,
      })
      .where(
        and(
          eq(planting.id, item.entityId),
          eq(planting.organizationId, organizationId),
          eq(planting.version, item.expectedVersion)
        )
      )
      .returning({ id: planting.id })
    return Boolean(row)
  }
  if (item.entity === "observation") {
    const [row] = await db
      .update(observation)
      .set({
        note: payload.note ? String(payload.note) : null,
        photoKey: payload.photoKey ? String(payload.photoKey) : null,
        latitude: toNumber(payload.latitude),
        longitude: toNumber(payload.longitude),
        version: nextVersion,
        updatedAt: now,
      })
      .where(
        and(
          eq(observation.id, item.entityId),
          eq(observation.organizationId, organizationId),
          eq(observation.version, item.expectedVersion)
        )
      )
      .returning({ id: observation.id })
    return Boolean(row)
  }
  if (item.entity === "harvest") {
    const [row] = await db
      .update(harvest)
      .set({
        quantity: toNumber(payload.quantity),
        unit: payload.unit ? String(payload.unit) : null,
        note: payload.note ? String(payload.note) : null,
        version: nextVersion,
        updatedAt: now,
      })
      .where(
        and(
          eq(harvest.id, item.entityId),
          eq(harvest.organizationId, organizationId),
          eq(harvest.version, item.expectedVersion)
        )
      )
      .returning({ id: harvest.id })
    return Boolean(row)
  }
  if (item.entity === "seed_lot") {
    const quantity = toNumber(payload.quantity)
    const cultivarId = payload.cultivarId ? String(payload.cultivarId) : null
    const speciesId = payload.speciesId ? String(payload.speciesId) : null
    const name = String(payload.name ?? "").trim() || "—"
    const [row] = await db
      .update(seedLot)
      .set({
        speciesId,
        cultivarId,
        name,
        quantity: quantity ?? 0,
        unit: payload.unit ? String(payload.unit) : "шт",
        packedAt: payload.packedAt ? new Date(String(payload.packedAt)) : null,
        version: nextVersion,
        updatedAt: now,
      })
      .where(
        and(
          eq(seedLot.id, item.entityId),
          eq(seedLot.organizationId, organizationId),
          eq(seedLot.version, item.expectedVersion)
        )
      )
      .returning({ id: seedLot.id })
    return Boolean(row)
  }
  return false
}

async function tombstoneFarmRow(
  organizationId: string,
  item: PushItem,
  now: Date,
  nextVersion: number
) {
  const tombstone = { deletedAt: now, updatedAt: now, version: nextVersion }
  if (item.entity === "field") {
    const [row] = await db
      .update(field)
      .set(tombstone)
      .where(
        and(
          eq(field.id, item.entityId),
          eq(field.organizationId, organizationId),
          eq(field.version, item.expectedVersion)
        )
      )
      .returning({ id: field.id })
    return Boolean(row)
  }
  if (item.entity === "planting") {
    const [row] = await db
      .update(planting)
      .set(tombstone)
      .where(
        and(
          eq(planting.id, item.entityId),
          eq(planting.organizationId, organizationId),
          eq(planting.version, item.expectedVersion)
        )
      )
      .returning({ id: planting.id })
    return Boolean(row)
  }
  if (item.entity === "observation") {
    const [row] = await db
      .update(observation)
      .set(tombstone)
      .where(
        and(
          eq(observation.id, item.entityId),
          eq(observation.organizationId, organizationId),
          eq(observation.version, item.expectedVersion)
        )
      )
      .returning({ id: observation.id })
    return Boolean(row)
  }
  if (item.entity === "harvest") {
    const [row] = await db
      .update(harvest)
      .set(tombstone)
      .where(
        and(
          eq(harvest.id, item.entityId),
          eq(harvest.organizationId, organizationId),
          eq(harvest.version, item.expectedVersion)
        )
      )
      .returning({ id: harvest.id })
    return Boolean(row)
  }
  if (item.entity === "seed_lot") {
    const [row] = await db
      .update(seedLot)
      .set(tombstone)
      .where(
        and(
          eq(seedLot.id, item.entityId),
          eq(seedLot.organizationId, organizationId),
          eq(seedLot.version, item.expectedVersion)
        )
      )
      .returning({ id: seedLot.id })
    return Boolean(row)
  }
  return false
}

async function loadFarmRow(entity: FarmEntity, entityId: string, organizationId: string) {
  if (entity === "field") {
    const [row] = await db
      .select()
      .from(field)
      .where(and(eq(field.id, entityId), eq(field.organizationId, organizationId)))
      .limit(1)
    return row ?? null
  }
  if (entity === "planting") {
    const [row] = await db
      .select()
      .from(planting)
      .where(and(eq(planting.id, entityId), eq(planting.organizationId, organizationId)))
      .limit(1)
    return row ?? null
  }
  if (entity === "observation") {
    const [row] = await db
      .select()
      .from(observation)
      .where(
        and(eq(observation.id, entityId), eq(observation.organizationId, organizationId))
      )
      .limit(1)
    return row ?? null
  }
  if (entity === "harvest") {
    const [row] = await db
      .select()
      .from(harvest)
      .where(and(eq(harvest.id, entityId), eq(harvest.organizationId, organizationId)))
      .limit(1)
    return row ?? null
  }
  if (entity === "seed_lot") {
    const [row] = await db
      .select()
      .from(seedLot)
      .where(and(eq(seedLot.id, entityId), eq(seedLot.organizationId, organizationId)))
      .limit(1)
    return row ?? null
  }
  return null
}

export async function pullKbSince(revision: number) {
  const rows = await db
    .select()
    .from(kbChange)
    .where(gt(kbChange.revision, revision))
    .orderBy(asc(kbChange.revision))

  const latest = new Map<string, (typeof rows)[number]>()
  for (const row of rows) {
    latest.set(`${row.entity}:${row.entityId}`, row)
  }

  const changes = []
  for (const row of latest.values()) {
    const record = await loadKbRow(row.entity as KbEntity, row.entityId)
    changes.push({
      revision: row.revision,
      entity: row.entity,
      entityId: row.entityId,
      operation: row.operation,
      record,
    })
  }

  const head = rows.at(-1)?.revision ?? revision
  return { revision: head, changes }
}

export async function pullFarmSince(organizationId: string, cursor: string | null) {
  const after = decodeFarmCursor(cursor)
  const rows = await db
    .select()
    .from(farmChange)
    .where(and(eq(farmChange.organizationId, organizationId), gt(farmChange.seq, after)))
    .orderBy(asc(farmChange.seq))
    .limit(PULL_LIMIT + 1)

  const page = rows.slice(0, PULL_LIMIT)
  const latest = new Map<string, (typeof page)[number]>()
  for (const row of page) {
    latest.set(`${row.entity}:${row.entityId}`, row)
  }

  const records = await loadFarmRecords(
    organizationId,
    [...latest.values()].map((row) => ({
      entity: row.entity as FarmEntity,
      entityId: row.entityId,
    }))
  )

  const changes = page.map((row) => ({
    seq: row.seq,
    entity: row.entity,
    entityId: row.entityId,
    operation: row.operation,
    version: row.version,
    record: records.get(`${row.entity}:${row.entityId}`) ?? null,
  }))

  const lastSeq = page.at(-1)?.seq ?? after
  return {
    changes,
    nextCursor: encodeFarmCursor(lastSeq),
    hasMore: rows.length > PULL_LIMIT,
  }
}

async function loadKbRow(entity: KbEntity, entityId: string) {
  if (entity === "species") {
    const [row] = await db.select().from(species).where(eq(species.id, entityId)).limit(1)
    return row ?? null
  }
  if (entity === "cultivar") {
    const [row] = await db.select().from(cultivar).where(eq(cultivar.id, entityId)).limit(1)
    return row ?? null
  }
  const [row] = await db.select().from(disease).where(eq(disease.id, entityId)).limit(1)
  return row ?? null
}

async function loadFarmRecords(
  organizationId: string,
  refs: { entity: FarmEntity; entityId: string }[]
) {
  const ids = (entity: FarmEntity) =>
    [...new Set(refs.filter((ref) => ref.entity === entity).map((ref) => ref.entityId))]

  const map = new Map<string, Record<string, unknown>>()
  const fieldIds = ids("field")
  if (fieldIds.length > 0) {
    const rows = await db
      .select()
      .from(field)
      .where(and(eq(field.organizationId, organizationId), inArray(field.id, fieldIds)))
    for (const row of rows) {
      map.set(`field:${row.id}`, row)
    }
  }
  const plantingIds = ids("planting")
  if (plantingIds.length > 0) {
    const rows = await db
      .select()
      .from(planting)
      .where(
        and(eq(planting.organizationId, organizationId), inArray(planting.id, plantingIds))
      )
    for (const row of rows) {
      map.set(`planting:${row.id}`, row)
    }
  }
  const observationIds = ids("observation")
  if (observationIds.length > 0) {
    const rows = await db
      .select()
      .from(observation)
      .where(
        and(
          eq(observation.organizationId, organizationId),
          inArray(observation.id, observationIds)
        )
      )
    for (const row of rows) {
      map.set(`observation:${row.id}`, row)
    }
  }
  const harvestIds = ids("harvest")
  if (harvestIds.length > 0) {
    const rows = await db
      .select()
      .from(harvest)
      .where(
        and(eq(harvest.organizationId, organizationId), inArray(harvest.id, harvestIds))
      )
    for (const row of rows) {
      map.set(`harvest:${row.id}`, row)
    }
  }
  const seedLotIds = ids("seed_lot")
  if (seedLotIds.length > 0) {
    const rows = await db
      .select()
      .from(seedLot)
      .where(
        and(eq(seedLot.organizationId, organizationId), inArray(seedLot.id, seedLotIds))
      )
    for (const row of rows) {
      map.set(`seed_lot:${row.id}`, row)
    }
  }
  return map
}

function toNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}
