import { NextResponse } from "next/server"

import { currentKbRevision } from "@/db/change-log"
import { db } from "@/db"
import {
  careProfile,
  classificationGroup,
  classificationValue,
  cultivar,
  disease,
  species,
  speciesClassification,
  speciesDisease,
} from "@/db/schema"
import { getSession } from "@/lib/session"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const [
    speciesRows,
    cultivarRows,
    diseaseRows,
    groupRows,
    valueRows,
    speciesClassificationRows,
    speciesDiseaseRows,
    careProfileRows,
    revision,
  ] = await Promise.all([
    db.select().from(species),
    db.select().from(cultivar),
    db.select().from(disease),
    db.select().from(classificationGroup),
    db.select().from(classificationValue),
    db.select().from(speciesClassification),
    db.select().from(speciesDisease),
    db.select().from(careProfile),
    currentKbRevision(),
  ])

  return NextResponse.json({
    revision,
    species: speciesRows,
    cultivars: cultivarRows,
    diseases: diseaseRows,
    classificationGroups: groupRows,
    classificationValues: valueRows,
    speciesClassifications: speciesClassificationRows,
    speciesDiseases: speciesDiseaseRows,
    careProfiles: careProfileRows,
  })
}
