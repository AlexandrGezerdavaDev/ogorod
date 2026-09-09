import type { CareTask, Plant, SeedLot } from "@/lib/garden-data"
import type { Messages } from "@/i18n/messages"

type PlantId = keyof Messages["demo"]["plants"]
type BedId = keyof Messages["demo"]["beds"]
type TaskId = keyof Messages["demo"]["tasks"]
type GardenId = keyof Messages["demo"]["gardens"]

export function localizePlant(m: Messages, plant: Plant) {
  const copy = m.demo.plants[plant.id as PlantId]
  const bed = m.demo.beds[plant.bed as BedId]
  return {
    name: copy?.name ?? plant.name,
    variety: copy?.variety ?? plant.variety,
    nextCare: copy?.nextCare ?? plant.nextCare,
    planted: copy?.planted ?? plant.planted,
    bed: bed ?? plant.bed,
  }
}

export function localizeTask(m: Messages, task: CareTask) {
  const copy = m.demo.tasks[task.id as TaskId]
  return {
    title: copy?.title ?? task.title,
    plant: copy?.plant ?? task.plant,
  }
}

export function localizeSeedLot(m: Messages, lot: SeedLot) {
  return {
    speciesName: m.demo.tomato,
    cultivarName: m.demo.oxheart,
    unit: lot.unit === "г" ? m.seeds.unitG : m.seeds.unitPcs,
  }
}

export function localizeGarden(
  m: Messages,
  garden: { id: string; name: string; plan: string }
) {
  const names = m.demo.gardenNames as Record<string, string>
  const plans = m.demo.gardens as Record<string, string>
  return {
    name: garden.id === "ogorod" ? garden.name : (names[garden.id] ?? garden.name),
    plan: plans[garden.id as GardenId] ?? garden.plan,
  }
}

export function localizeBed(m: Messages, bedId: string) {
  return m.demo.beds[bedId as BedId] ?? bedId
}
