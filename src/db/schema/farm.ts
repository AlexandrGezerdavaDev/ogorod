import {
  doublePrecision,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

import { organization } from "./auth"
import { cultivar, species } from "./kb"

const syncColumns = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  version: integer("version").notNull().default(1),
}

export const field = pgTable(
  "field",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    ...syncColumns,
  },
  (table) => [index("field_organizationId_idx").on(table.organizationId)]
)

export const planting = pgTable(
  "planting",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    fieldId: uuid("field_id")
      .notNull()
      .references(() => field.id, { onDelete: "cascade" }),
    cultivarId: text("cultivar_id").references(() => cultivar.id, {
      onDelete: "restrict",
    }),
    speciesId: text("species_id").references(() => species.id, {
      onDelete: "restrict",
    }),
    nickname: text("nickname"),
    plantedAt: timestamp("planted_at", { withTimezone: true }),
    ...syncColumns,
  },
  (table) => [
    index("planting_organizationId_idx").on(table.organizationId),
    index("planting_fieldId_idx").on(table.fieldId),
    index("planting_cultivarId_idx").on(table.cultivarId),
    index("planting_speciesId_idx").on(table.speciesId),
  ]
)

export const observation = pgTable(
  "observation",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    plantingId: uuid("planting_id")
      .notNull()
      .references(() => planting.id, { onDelete: "cascade" }),
    note: text("note"),
    photoKey: text("photo_key"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    observedAt: timestamp("observed_at", { withTimezone: true }).defaultNow().notNull(),
    ...syncColumns,
  },
  (table) => [
    index("observation_organizationId_idx").on(table.organizationId),
    index("observation_plantingId_idx").on(table.plantingId),
  ]
)

export const harvest = pgTable(
  "harvest",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    plantingId: uuid("planting_id")
      .notNull()
      .references(() => planting.id, { onDelete: "cascade" }),
    quantity: doublePrecision("quantity"),
    unit: text("unit"),
    harvestedAt: timestamp("harvested_at", { withTimezone: true }).defaultNow().notNull(),
    note: text("note"),
    ...syncColumns,
  },
  (table) => [
    index("harvest_organizationId_idx").on(table.organizationId),
    index("harvest_plantingId_idx").on(table.plantingId),
  ]
)

export const seedLot = pgTable(
  "seed_lot",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    speciesId: text("species_id").references(() => species.id, {
      onDelete: "restrict",
    }),
    cultivarId: text("cultivar_id").references(() => cultivar.id, {
      onDelete: "restrict",
    }),
    name: text("name").notNull(),
    quantity: doublePrecision("quantity").notNull(),
    unit: text("unit").notNull().default("шт"),
    packedAt: timestamp("packed_at", { withTimezone: true }),
    ...syncColumns,
  },
  (table) => [
    index("seed_lot_organizationId_idx").on(table.organizationId),
    index("seed_lot_cultivarId_idx").on(table.cultivarId),
    index("seed_lot_speciesId_idx").on(table.speciesId),
  ]
)
