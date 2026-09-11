import Dexie, { type EntityTable } from "dexie"

import type { LocalWeather } from "@/features/weather/types"
import type { OutboxItem, SyncState, SyncStatus } from "./types"

export type LocalSpecies = {
  id: string
  scientificName: string
  commonNameUk: string
  commonNameEn?: string | null
  category?: string | null
}

export type LocalCultivar = {
  id: string
  speciesId: string
  name: string
}

export type LocalDisease = {
  id: string
  nameUk: string
  nameEn?: string | null
}

export type LocalField = {
  id: string
  organizationId: string
  name: string
  version: number
  syncStatus: SyncStatus
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type LocalPlanting = {
  id: string
  organizationId: string
  fieldId: string
  speciesId?: string | null
  cultivarId?: string | null
  nickname?: string | null
  plantedAt?: string | null
  quantity: number
  version: number
  syncStatus: SyncStatus
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type LocalObservation = {
  id: string
  organizationId: string
  plantingId: string
  note?: string | null
  photoKey?: string | null
  latitude?: number | null
  longitude?: number | null
  observedAt: string
  version: number
  syncStatus: SyncStatus
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type LocalHarvest = {
  id: string
  organizationId: string
  plantingId: string
  quantity?: number | null
  unit?: string | null
  note?: string | null
  harvestedAt: string
  version: number
  syncStatus: SyncStatus
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type LocalSeedLot = {
  id: string
  organizationId: string
  speciesId?: string | null
  cultivarId?: string | null
  name: string
  quantity: number
  unit: string
  packedAt?: string | null
  version: number
  syncStatus: SyncStatus
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export class OgorodDB extends Dexie {
  species!: EntityTable<LocalSpecies, "id">
  cultivar!: EntityTable<LocalCultivar, "id">
  disease!: EntityTable<LocalDisease, "id">
  fields!: EntityTable<LocalField, "id">
  plantings!: EntityTable<LocalPlanting, "id">
  observations!: EntityTable<LocalObservation, "id">
  harvests!: EntityTable<LocalHarvest, "id">
  seedLots!: EntityTable<LocalSeedLot, "id">
  outbox!: EntityTable<OutboxItem, "id">
  syncState!: EntityTable<SyncState, "id">
  weather!: EntityTable<LocalWeather, "id">

  constructor() {
    super("ogorod")
    this.version(1).stores({
      species: "id, scientificName",
      cultivar: "id, speciesId",
      fields: "id, organizationId, syncStatus",
      plantings: "id, organizationId, fieldId, cultivarId, syncStatus",
      observations: "id, organizationId, plantingId, syncStatus",
      outbox: "id, entity, entityId, createdAt",
    })
    this.version(2).stores({
      species: "id, scientificName",
      cultivar: "id, speciesId",
      disease: "id",
      fields: "id, organizationId, syncStatus, version",
      plantings: "id, organizationId, fieldId, cultivarId, syncStatus, version",
      observations: "id, organizationId, plantingId, syncStatus, version",
      harvests: "id, organizationId, plantingId, syncStatus, version",
      outbox: "id, deviceId, entity, entityId, createdAt",
      syncState: "id, deviceId",
    })
    this.version(3).stores({
      species: "id, scientificName",
      cultivar: "id, speciesId",
      disease: "id",
      fields: "id, organizationId, syncStatus, version",
      plantings: "id, organizationId, fieldId, cultivarId, syncStatus, version",
      observations: "id, organizationId, plantingId, syncStatus, version",
      harvests: "id, organizationId, plantingId, syncStatus, version",
      seedLots: "id, organizationId, cultivarId, syncStatus, version",
      outbox: "id, deviceId, entity, entityId, createdAt",
      syncState: "id, deviceId",
    })
    this.version(4).stores({
      species: "id, scientificName, category",
      cultivar: "id, speciesId",
      disease: "id",
      fields: "id, organizationId, syncStatus, version",
      plantings: "id, organizationId, fieldId, cultivarId, syncStatus, version",
      observations: "id, organizationId, plantingId, syncStatus, version",
      harvests: "id, organizationId, plantingId, syncStatus, version",
      seedLots: "id, organizationId, cultivarId, syncStatus, version",
      outbox: "id, deviceId, entity, entityId, createdAt",
      syncState: "id, deviceId",
    })
    this.version(5).stores({
      species: "id, scientificName, category",
      cultivar: "id, speciesId",
      disease: "id",
      fields: "id, organizationId, syncStatus, version",
      plantings: "id, organizationId, fieldId, cultivarId, syncStatus, version",
      observations: "id, organizationId, plantingId, syncStatus, version",
      harvests: "id, organizationId, plantingId, syncStatus, version",
      seedLots: "id, organizationId, cultivarId, syncStatus, version",
      outbox: "id, deviceId, entity, entityId, createdAt",
      syncState: "id, deviceId",
      weather: "id",
    })
    this.version(6)
      .stores({
        species: "id, scientificName, category",
        cultivar: "id, speciesId",
        disease: "id",
        fields: "id, organizationId, syncStatus, version",
        plantings: "id, organizationId, fieldId, cultivarId, syncStatus, version",
        observations: "id, organizationId, plantingId, syncStatus, version",
        harvests: "id, organizationId, plantingId, syncStatus, version",
        seedLots: "id, organizationId, speciesId, cultivarId, syncStatus, version",
        outbox: "id, deviceId, entity, entityId, createdAt",
        syncState: "id, deviceId",
        weather: "id",
      })
      .upgrade(async (tx) => {
        const rows = await tx.table("seedLots").toArray()
        for (const row of rows) {
          const current = row as {
            id: string
            name?: string
            cultivarId?: string | null
            speciesId?: string | null
          }
          if (current.name?.trim()) {
            continue
          }
          let name = current.cultivarId?.trim() || "—"
          let speciesId = current.speciesId ?? null
          if (current.cultivarId) {
            const cultivar = (await tx
              .table("cultivar")
              .get(current.cultivarId)) as
              | { name?: string; speciesId?: string }
              | undefined
            if (cultivar?.name) {
              name = cultivar.name
            }
            if (cultivar?.speciesId) {
              speciesId = cultivar.speciesId
            }
          }
          await tx.table("seedLots").update(current.id, { name, speciesId })
        }
      })
    this.version(7).stores({
      species: "id, scientificName, category",
      cultivar: "id, speciesId",
      disease: "id",
      fields: "id, organizationId, syncStatus, version",
      plantings: "id, organizationId, fieldId, speciesId, cultivarId, syncStatus, version",
      observations: "id, organizationId, plantingId, syncStatus, version",
      harvests: "id, organizationId, plantingId, syncStatus, version",
      seedLots: "id, organizationId, speciesId, cultivarId, syncStatus, version",
      outbox: "id, deviceId, entity, entityId, createdAt",
      syncState: "id, deviceId",
      weather: "id",
    })
  }
}

function createLocalDb() {
  if (typeof window === "undefined") {
    return null
  }
  return new OgorodDB()
}

export const localDb = createLocalDb()
