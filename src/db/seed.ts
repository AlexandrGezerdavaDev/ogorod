import { config } from "dotenv"
import { eq } from "drizzle-orm"

config({ path: ".env" })

type SeedSpecies = {
  id: string
  scientificName: string
  commonNameUk: string
  commonNameEn: string
  category: "vegetable" | "herb" | "berry"
}

type SeedCultivar = {
  id: string
  speciesId: string
  name: string
}

const SPECIES: SeedSpecies[] = [
  {
    id: "kb_species_solanum_lycopersicum",
    scientificName: "Solanum lycopersicum",
    commonNameUk: "Помідор",
    commonNameEn: "Tomato",
    category: "vegetable",
  },
  {
    id: "kb_species_cucumis_sativus",
    scientificName: "Cucumis sativus",
    commonNameUk: "Огірок",
    commonNameEn: "Cucumber",
    category: "vegetable",
  },
  {
    id: "kb_species_capsicum_annuum",
    scientificName: "Capsicum annuum",
    commonNameUk: "Перець",
    commonNameEn: "Pepper",
    category: "vegetable",
  },
  {
    id: "kb_species_raphanus_sativus",
    scientificName: "Raphanus sativus",
    commonNameUk: "Редиска",
    commonNameEn: "Radish",
    category: "vegetable",
  },
  {
    id: "kb_species_ocimum_basilicum",
    scientificName: "Ocimum basilicum",
    commonNameUk: "Базилік",
    commonNameEn: "Basil",
    category: "herb",
  },
  {
    id: "kb_species_mentha_piperita",
    scientificName: "Mentha × piperita",
    commonNameUk: "М'ята",
    commonNameEn: "Mint",
    category: "herb",
  },
  {
    id: "kb_species_fragaria_ananassa",
    scientificName: "Fragaria × ananassa",
    commonNameUk: "Полуниця",
    commonNameEn: "Strawberry",
    category: "berry",
  },
]

const CULTIVARS: SeedCultivar[] = [
  {
    id: "kb_cultivar_bychache_sertse",
    speciesId: "kb_species_solanum_lycopersicum",
    name: "Бичаче серце",
  },
  {
    id: "kb_cultivar_kornishony",
    speciesId: "kb_species_cucumis_sativus",
    name: "Корнішони",
  },
  {
    id: "kb_cultivar_solodkyi",
    speciesId: "kb_species_capsicum_annuum",
    name: "Солодкий",
  },
  {
    id: "kb_cultivar_genuezkyi",
    speciesId: "kb_species_ocimum_basilicum",
    name: "Генуезький",
  },
  {
    id: "kb_cultivar_pertseva",
    speciesId: "kb_species_mentha_piperita",
    name: "Перцева",
  },
  {
    id: "kb_cultivar_albion",
    speciesId: "kb_species_fragaria_ananassa",
    name: "Альбіон",
  },
]

async function seed() {
  const { db } = await import("./index")
  const { appendKbChange } = await import("./change-log")
  const { cultivar, species } = await import("./schema")

  for (const item of SPECIES) {
    const [existing] = await db
      .select()
      .from(species)
      .where(eq(species.id, item.id))
      .limit(1)

    if (!existing) {
      await db.insert(species).values(item)
      await appendKbChange("species", item.id, "upsert")
      continue
    }

    const changed =
      existing.scientificName !== item.scientificName ||
      existing.commonNameUk !== item.commonNameUk ||
      (existing.commonNameEn ?? null) !== item.commonNameEn ||
      existing.category !== item.category

    if (changed) {
      await db
        .update(species)
        .set({
          scientificName: item.scientificName,
          commonNameUk: item.commonNameUk,
          commonNameEn: item.commonNameEn,
          category: item.category,
          updatedAt: new Date(),
        })
        .where(eq(species.id, item.id))
      await appendKbChange("species", item.id, "upsert")
    }
  }

  for (const item of CULTIVARS) {
    const [existing] = await db
      .select()
      .from(cultivar)
      .where(eq(cultivar.id, item.id))
      .limit(1)

    if (!existing) {
      await db.insert(cultivar).values(item)
      await appendKbChange("cultivar", item.id, "upsert")
    }
  }

  console.info(
    `KB seed complete: ${SPECIES.length} species, ${CULTIVARS.length} cultivars`
  )
  process.exit(0)
}

seed().catch((error) => {
  const cause = error instanceof Error ? error.cause : undefined
  const refused =
    (cause instanceof Error && "code" in cause && cause.code === "ECONNREFUSED") ||
    String(error).includes("ECONNREFUSED")

  if (refused) {
    console.error(`PostgreSQL не запущений. Виконайте:

  docker compose up -d postgres
  npm run db:migrate
  npm run db:seed
`)
  } else {
    console.error(error)
  }
  process.exit(1)
})
