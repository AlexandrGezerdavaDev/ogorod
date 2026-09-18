"use client"

import { useQuery } from "@tanstack/react-query"

import { localDb } from "@/features/sync/db"
import { getOrCreateDevice } from "@/features/sync/device"
import type {
  LocalCareProfile,
  LocalClassificationGroup,
  LocalClassificationValue,
  LocalCultivar,
  LocalDisease,
  LocalSpecies,
  LocalSpeciesClassification,
  LocalSpeciesDisease,
} from "@/features/sync/db"

type KbResponse = {
  revision?: number
  species: Array<{
    id: string
    scientificName?: string
    commonNameUk?: string
    commonNameEn?: string | null
  }>
  cultivars: Array<{
    id: string
    speciesId?: string
    name?: string
  }>
  diseases?: Array<{
    id: string
    nameUk?: string
    nameEn?: string | null
  }>
  classificationGroups?: Array<{
    id: string
    nameUk?: string
    nameEn?: string | null
    type?: string
  }>
  classificationValues?: Array<{
    id: string
    groupId?: string
    nameUk?: string
    nameEn?: string | null
  }>
  speciesClassifications?: Array<{
    speciesId?: string
    classificationValueId?: string
  }>
  speciesDiseases?: Array<{
    speciesId?: string
    diseaseId?: string
  }>
  careProfiles?: Array<{
    id: string
    speciesId?: string
    imageUrl?: string | null
    growing?: Record<string, Record<string, string>>
    genetics?: Record<string, Record<string, string>>
    usage?: Record<string, Record<string, string>>
  }>
}

function junctionId(left: string, right: string) {
  return `${left}::${right}`
}

export function useKbSpecies() {
  return useQuery({
    queryKey: ["kb", "species"],
    queryFn: async () => {
      const response = await fetch("/api/kb/species")
      if (!response.ok) {
        throw new Error("Не вдалося завантажити каталог рослин")
      }
      const data = (await response.json()) as KbResponse

      const species: LocalSpecies[] = data.species.map((row) => ({
        id: row.id,
        scientificName: row.scientificName ?? "",
        commonNameUk: row.commonNameUk ?? "",
        commonNameEn: row.commonNameEn,
      }))
      const cultivars: LocalCultivar[] = data.cultivars.map((row) => ({
        id: row.id,
        speciesId: row.speciesId ?? "",
        name: row.name ?? "",
      }))
      const diseases: LocalDisease[] = (data.diseases ?? []).map((row) => ({
        id: row.id,
        nameUk: row.nameUk ?? "",
        nameEn: row.nameEn,
      }))
      const classificationGroups: LocalClassificationGroup[] = (
        data.classificationGroups ?? []
      ).map((row) => ({
        id: row.id,
        nameUk: row.nameUk ?? "",
        nameEn: row.nameEn,
        type: row.type ?? "",
      }))
      const classificationValues: LocalClassificationValue[] = (
        data.classificationValues ?? []
      ).map((row) => ({
        id: row.id,
        groupId: row.groupId ?? "",
        nameUk: row.nameUk ?? "",
        nameEn: row.nameEn,
      }))
      const speciesClassifications: LocalSpeciesClassification[] = (
        data.speciesClassifications ?? []
      ).map((row) => {
        const speciesId = row.speciesId ?? ""
        const classificationValueId = row.classificationValueId ?? ""
        return {
          id: junctionId(speciesId, classificationValueId),
          speciesId,
          classificationValueId,
        }
      })
      const speciesDiseases: LocalSpeciesDisease[] = (data.speciesDiseases ?? []).map(
        (row) => {
          const speciesId = row.speciesId ?? ""
          const diseaseId = row.diseaseId ?? ""
          return {
            id: junctionId(speciesId, diseaseId),
            speciesId,
            diseaseId,
          }
        }
      )
      const careProfiles: LocalCareProfile[] = (data.careProfiles ?? []).map((row) => ({
        id: row.id,
        speciesId: row.speciesId ?? "",
        imageUrl: row.imageUrl,
        growing: row.growing ?? {},
        genetics: row.genetics ?? {},
        usage: row.usage ?? {},
      }))

      if (localDb) {
        const db = localDb
        await getOrCreateDevice()
        await db.transaction(
          "rw",
          [
            db.species,
            db.cultivar,
            db.disease,
            db.classificationGroup,
            db.classificationValue,
            db.speciesClassification,
            db.speciesDisease,
            db.careProfile,
            db.syncState,
          ],
          async () => {
            await db.species.bulkPut(species)
            await db.cultivar.bulkPut(cultivars)
            await db.disease.bulkPut(diseases)
            await db.classificationGroup.bulkPut(classificationGroups)
            await db.classificationValue.bulkPut(classificationValues)
            await db.speciesClassification.bulkPut(speciesClassifications)
            await db.speciesDisease.bulkPut(speciesDiseases)
            await db.careProfile.bulkPut(careProfiles)
            if (typeof data.revision === "number") {
              await db.syncState.update("self", { kbRevision: data.revision })
            }
          }
        )
      }

      return {
        species,
        cultivars,
        diseases,
        classificationGroups,
        classificationValues,
        speciesClassifications,
        speciesDiseases,
        careProfiles,
      }
    },
  })
}
