import { NextResponse } from "next/server"
import { z } from "zod"

import { currentKbRevision } from "@/db/change-log"
import { ensureDevice, pullFarmSince, pullKbSince } from "@/features/sync/server"
import { getSession } from "@/lib/session"

const querySchema = z.object({
  cursor: z.string().optional(),
  kbRevision: z.coerce.number().int().min(0).optional(),
  deviceId: z.uuid().optional(),
  deviceName: z.string().min(1).max(120).optional(),
})

export async function GET(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const parsed = querySchema.safeParse({
    cursor: url.searchParams.get("cursor") ?? undefined,
    kbRevision: url.searchParams.get("kbRevision") ?? undefined,
    deviceId: url.searchParams.get("deviceId") ?? undefined,
    deviceName: url.searchParams.get("deviceName") ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_query" }, { status: 400 })
  }

  if (parsed.data.deviceId) {
    const device = await ensureDevice({
      deviceId: parsed.data.deviceId,
      userId: session.user.id,
      name: parsed.data.deviceName ?? "Пристрій",
    })
    if (!device.ok) {
      return NextResponse.json({ error: "device_owned" }, { status: 403 })
    }
  }

  const kb = await pullKbSince(parsed.data.kbRevision ?? 0)
  const kbRevision = kb.changes.length > 0 ? kb.revision : await currentKbRevision()

  const organizationId = session.session.activeOrganizationId
  if (!organizationId) {
    return NextResponse.json({
      kb: { revision: kbRevision, changes: kb.changes },
      changes: [],
      nextCursor: parsed.data.cursor ?? null,
      hasMore: false,
    })
  }

  const farm = await pullFarmSince(organizationId, parsed.data.cursor ?? null)
  return NextResponse.json({
    kb: { revision: kbRevision, changes: kb.changes },
    changes: farm.changes,
    nextCursor: farm.nextCursor,
    hasMore: farm.hasMore,
  })
}
