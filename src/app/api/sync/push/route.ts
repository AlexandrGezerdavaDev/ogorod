import { NextResponse } from "next/server"
import { z } from "zod"

import { applyPushItems, ensureDevice } from "@/features/sync/server"
import { getSession } from "@/lib/session"

const itemSchema = z.object({
  id: z.string().min(1),
  entity: z.enum(["field", "planting", "observation", "harvest", "seed_lot"]),
  entityId: z.uuid(),
  operation: z.enum(["upsert", "delete"]),
  expectedVersion: z.number().int().min(0),
  payload: z.record(z.string(), z.unknown()),
})

const bodySchema = z.object({
  deviceId: z.uuid(),
  deviceName: z.string().min(1).max(120).default("Пристрій"),
  items: z.array(itemSchema),
})

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const organizationId = session.session.activeOrganizationId
  if (!organizationId) {
    return NextResponse.json({ error: "no_organization" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 })
  }

  const device = await ensureDevice({
    deviceId: parsed.data.deviceId,
    userId: session.user.id,
    name: parsed.data.deviceName,
  })
  if (!device.ok) {
    return NextResponse.json({ error: "device_owned" }, { status: 403 })
  }

  const results = await applyPushItems({
    organizationId,
    deviceId: parsed.data.deviceId,
    items: parsed.data.items,
  })

  return NextResponse.json({
    accepted: results.filter((row) => row.status === "accepted").map((row) => row.itemId),
    duplicates: results.filter((row) => row.status === "duplicate").map((row) => row.itemId),
    conflicts: results
      .filter((row) => row.status === "conflict")
      .map((row) => ({
        id: row.itemId,
        server: row.server ?? null,
      })),
  })
}
