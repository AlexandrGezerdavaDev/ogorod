import {
  index,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

export const classificationGroupTypes = [
  "botanical",
  "agricultural_use",
  "used_part",
  "life_cycle",
  "cultivation",
] as const

export type ClassificationGroupType = (typeof classificationGroupTypes)[number]

export const species = pgTable("species", {
  id: text("id").primaryKey(),
  scientificName: text("scientific_name").notNull().unique(),
  commonNameUk: text("common_name_uk").notNull(),
  commonNameEn: text("common_name_en"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const cultivar = pgTable(
  "cultivar",
  {
    id: text("id").primaryKey(),
    speciesId: text("species_id")
      .notNull()
      .references(() => species.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("cultivar_speciesId_idx").on(table.speciesId)]
)

export const disease = pgTable("disease", {
  id: text("id").primaryKey(),
  nameUk: text("name_uk").notNull(),
  nameEn: text("name_en"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const classificationGroup = pgTable(
  "classification_group",
  {
    id: text("id").primaryKey(),
    nameUk: text("name_uk").notNull(),
    nameEn: text("name_en"),
    type: text("type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("classification_group_type_idx").on(table.type)]
)

export const classificationValue = pgTable(
  "classification_value",
  {
    id: text("id").primaryKey(),
    groupId: text("group_id")
      .notNull()
      .references(() => classificationGroup.id, { onDelete: "cascade" }),
    nameUk: text("name_uk").notNull(),
    nameEn: text("name_en"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("classification_value_groupId_idx").on(table.groupId)]
)

export const speciesClassification = pgTable(
  "species_classification",
  {
    speciesId: text("species_id")
      .notNull()
      .references(() => species.id, { onDelete: "cascade" }),
    classificationValueId: text("classification_value_id")
      .notNull()
      .references(() => classificationValue.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.speciesId, table.classificationValueId],
    }),
    index("species_classification_valueId_idx").on(table.classificationValueId),
  ]
)

export const speciesDisease = pgTable(
  "species_disease",
  {
    speciesId: text("species_id")
      .notNull()
      .references(() => species.id, { onDelete: "cascade" }),
    diseaseId: text("disease_id")
      .notNull()
      .references(() => disease.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.speciesId, table.diseaseId] }),
    index("species_disease_diseaseId_idx").on(table.diseaseId),
  ]
)

/** Agronomic care content for a species (1:1). Localized maps: { uk, en, ru }. */
export const careProfile = pgTable("care_profile", {
  id: text("id").primaryKey(),
  speciesId: text("species_id")
    .notNull()
    .references(() => species.id, { onDelete: "cascade" })
    .unique(),
  imageUrl: text("image_url"),
  growing: jsonb("growing").$type<Record<string, Record<string, string>>>().notNull(),
  genetics: jsonb("genetics").$type<Record<string, Record<string, string>>>().notNull(),
  usage: jsonb("usage").$type<Record<string, Record<string, string>>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})
