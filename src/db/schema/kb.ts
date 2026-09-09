import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const species = pgTable(
  "species",
  {
    id: text("id").primaryKey(),
    scientificName: text("scientific_name").notNull().unique(),
    commonNameUk: text("common_name_uk").notNull(),
    commonNameEn: text("common_name_en"),
    category: text("category").default("vegetable").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("species_category_idx").on(table.category)]
)

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

export const disease = pgTable(
  "disease",
  {
    id: text("id").primaryKey(),
    nameUk: text("name_uk").notNull(),
    nameEn: text("name_en"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  }
)
