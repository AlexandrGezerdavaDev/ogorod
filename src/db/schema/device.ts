import { index, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core"

import { user } from "./auth"

export const device = pgTable(
  "device",
  {
    id: uuid("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("device_userId_idx").on(table.userId)]
)

export const syncReceipt = pgTable(
  "sync_receipt",
  {
    deviceId: uuid("device_id")
      .notNull()
      .references(() => device.id, { onDelete: "cascade" }),
    itemId: text("item_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.deviceId, table.itemId] }),
    index("sync_receipt_deviceId_idx").on(table.deviceId),
  ]
)
