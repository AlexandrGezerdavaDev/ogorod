import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

import { appendKbChange, type KbChangeEntity } from "@/db/change-log"
import { db } from "@/db"
import {
  careProfile,
  classificationValue,
  cultivar,
  disease,
  species,
  speciesClassification,
  speciesDisease,
} from "@/db/schema"
import { getSession } from "@/lib/session"

type ManageBody = {
  entity: KbChangeEntity
  operation: "upsert" | "delete"
  payload: Record<string, unknown>
}

function str(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function junctionId(left: string, right: string) {
  return `${left}::${right}`
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let body: ManageBody
  try {
    body = (await request.json()) as ManageBody
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const { entity, operation, payload } = body
  if (!entity || (operation !== "upsert" && operation !== "delete")) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 })
  }

  try {
    const entityId = await applyManage(entity, operation, payload)
    await appendKbChange(entity, entityId, operation)
    return NextResponse.json({ ok: true, entityId })
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

async function applyManage(
  entity: KbChangeEntity,
  operation: "upsert" | "delete",
  payload: Record<string, unknown>
) {
  if (entity === "species") {
    const id = str(payload.id)
    if (!id) throw new Error("id_required")
    if (operation === "delete") {
      await db.delete(species).where(eq(species.id, id))
      return id
    }
    const scientificName = str(payload.scientificName)
    const commonNameUk = str(payload.commonNameUk)
    if (!scientificName || !commonNameUk) throw new Error("fields_required")
    const commonNameEn = str(payload.commonNameEn) || null
    const [existing] = await db.select().from(species).where(eq(species.id, id)).limit(1)
    if (existing) {
      await db
        .update(species)
        .set({
          scientificName,
          commonNameUk,
          commonNameEn,
          updatedAt: new Date(),
        })
        .where(eq(species.id, id))
    } else {
      await db.insert(species).values({
        id,
        scientificName,
        commonNameUk,
        commonNameEn,
      })
    }
    return id
  }

  if (entity === "cultivar") {
    const id = str(payload.id)
    if (!id) throw new Error("id_required")
    if (operation === "delete") {
      await db.delete(cultivar).where(eq(cultivar.id, id))
      return id
    }
    const speciesId = str(payload.speciesId)
    const name = str(payload.name)
    if (!speciesId || !name) throw new Error("fields_required")
    const [existing] = await db.select().from(cultivar).where(eq(cultivar.id, id)).limit(1)
    if (existing) {
      await db
        .update(cultivar)
        .set({ speciesId, name, updatedAt: new Date() })
        .where(eq(cultivar.id, id))
    } else {
      await db.insert(cultivar).values({ id, speciesId, name })
    }
    return id
  }

  if (entity === "disease") {
    const id = str(payload.id)
    if (!id) throw new Error("id_required")
    if (operation === "delete") {
      await db.delete(disease).where(eq(disease.id, id))
      return id
    }
    const nameUk = str(payload.nameUk)
    if (!nameUk) throw new Error("fields_required")
    const nameEn = str(payload.nameEn) || null
    const [existing] = await db.select().from(disease).where(eq(disease.id, id)).limit(1)
    if (existing) {
      await db
        .update(disease)
        .set({ nameUk, nameEn, updatedAt: new Date() })
        .where(eq(disease.id, id))
    } else {
      await db.insert(disease).values({ id, nameUk, nameEn })
    }
    return id
  }

  if (entity === "classification_value") {
    const id = str(payload.id)
    if (!id) throw new Error("id_required")
    if (operation === "delete") {
      await db.delete(classificationValue).where(eq(classificationValue.id, id))
      return id
    }
    const groupId = str(payload.groupId)
    const nameUk = str(payload.nameUk)
    if (!groupId || !nameUk) throw new Error("fields_required")
    const nameEn = str(payload.nameEn) || null
    const [existing] = await db
      .select()
      .from(classificationValue)
      .where(eq(classificationValue.id, id))
      .limit(1)
    if (existing) {
      await db
        .update(classificationValue)
        .set({ groupId, nameUk, nameEn, updatedAt: new Date() })
        .where(eq(classificationValue.id, id))
    } else {
      await db.insert(classificationValue).values({ id, groupId, nameUk, nameEn })
    }
    return id
  }

  if (entity === "species_classification") {
    const speciesId = str(payload.speciesId)
    const classificationValueId = str(payload.classificationValueId)
    if (!speciesId || !classificationValueId) throw new Error("fields_required")
    const id = junctionId(speciesId, classificationValueId)
    if (operation === "delete") {
      await db
        .delete(speciesClassification)
        .where(
          and(
            eq(speciesClassification.speciesId, speciesId),
            eq(speciesClassification.classificationValueId, classificationValueId)
          )
        )
      return id
    }
    const rows = await db
      .select()
      .from(speciesClassification)
      .where(eq(speciesClassification.speciesId, speciesId))
    if (!rows.some((row) => row.classificationValueId === classificationValueId)) {
      await db.insert(speciesClassification).values({
        speciesId,
        classificationValueId,
      })
    }
    return id
  }

  if (entity === "species_disease") {
    const speciesId = str(payload.speciesId)
    const diseaseId = str(payload.diseaseId)
    if (!speciesId || !diseaseId) throw new Error("fields_required")
    const id = junctionId(speciesId, diseaseId)
    if (operation === "delete") {
      await db
        .delete(speciesDisease)
        .where(
          and(
            eq(speciesDisease.speciesId, speciesId),
            eq(speciesDisease.diseaseId, diseaseId)
          )
        )
      return id
    }
    const rows = await db
      .select()
      .from(speciesDisease)
      .where(eq(speciesDisease.speciesId, speciesId))
    if (!rows.some((row) => row.diseaseId === diseaseId)) {
      await db.insert(speciesDisease).values({ speciesId, diseaseId })
    }
    return id
  }

  if (entity === "care_profile") {
    const id = str(payload.id)
    const speciesId = str(payload.speciesId)
    if (!id || !speciesId) throw new Error("fields_required")
    if (operation === "delete") {
      await db.delete(careProfile).where(eq(careProfile.id, id))
      return id
    }
    const imageUrl = str(payload.imageUrl) || null
    const growing =
      (payload.growing as Record<string, Record<string, string>> | undefined) ?? {}
    const genetics =
      (payload.genetics as Record<string, Record<string, string>> | undefined) ?? {}
    const usage =
      (payload.usage as Record<string, Record<string, string>> | undefined) ?? {}
    const [existing] = await db
      .select()
      .from(careProfile)
      .where(eq(careProfile.id, id))
      .limit(1)
    if (existing) {
      await db
        .update(careProfile)
        .set({
          speciesId,
          imageUrl,
          growing: Object.keys(growing).length > 0 ? growing : existing.growing,
          genetics: Object.keys(genetics).length > 0 ? genetics : existing.genetics,
          usage: Object.keys(usage).length > 0 ? usage : existing.usage,
          updatedAt: new Date(),
        })
        .where(eq(careProfile.id, id))
    } else {
      await db.insert(careProfile).values({
        id,
        speciesId,
        imageUrl,
        growing,
        genetics,
        usage,
      })
    }
    return id
  }

  throw new Error("unsupported_entity")
}
