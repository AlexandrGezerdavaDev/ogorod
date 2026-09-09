import { max } from "drizzle-orm"

import { db } from "./index"
import { farmChange, kbChange } from "./schema"

export async function appendKbChange(
  entity: "species" | "cultivar" | "disease",
  entityId: string,
  operation: "upsert" | "delete"
) {
  const [row] = await db
    .insert(kbChange)
    .values({ entity, entityId, operation })
    .returning({ revision: kbChange.revision })
  return row?.revision ?? 0
}

export async function currentKbRevision() {
  const [row] = await db.select({ value: max(kbChange.revision) }).from(kbChange)
  return row?.value ?? 0
}

export async function appendFarmChange(input: {
  organizationId: string
  entity: "field" | "planting" | "observation" | "harvest" | "seed_lot"
  entityId: string
  operation: "upsert" | "delete"
  version: number
}) {
  const [row] = await db
    .insert(farmChange)
    .values(input)
    .returning({ seq: farmChange.seq })
  return row?.seq ?? 0
}
