export type SyncStatus = "pending" | "synced" | "failed" | "conflict"

export type OutboxEntity =
  | "field"
  | "planting"
  | "observation"
  | "harvest"
  | "seed_lot"

export type SyncOperation = "upsert" | "delete"

export type OutboxItem = {
  id: string
  deviceId: string
  entity: OutboxEntity
  entityId: string
  operation: SyncOperation
  expectedVersion: number
  payload: Record<string, unknown>
  attempts: number
  lastError?: string
  createdAt: string
}

export type SyncState = {
  id: "self"
  deviceId: string
  deviceName: string
  farmCursor: string | null
  kbRevision: number
}

export type SyncedRecord = {
  id: string
  organizationId: string
  syncStatus: SyncStatus
  version: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}
