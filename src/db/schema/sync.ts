import {
  bigserial,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

import { organization } from "./auth"

export const kbChange = pgTable(
  "kb_change",
  {
    revision: bigserial("revision", { mode: "number" }).primaryKey(),
    entity: text("entity").notNull(),
    entityId: text("entity_id").notNull(),
    operation: text("operation").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("kb_change_entityId_idx").on(table.entity, table.entityId)]
)

export const farmChange = pgTable(
  "farm_change",
  {
    seq: bigserial("seq", { mode: "number" }).primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    entity: text("entity").notNull(),
    entityId: uuid("entity_id").notNull(),
    operation: text("operation").notNull(),
    version: integer("version").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("farm_change_org_seq_idx").on(table.organizationId, table.seq),
    index("farm_change_entityId_idx").on(table.entity, table.entityId),
  ]
)
