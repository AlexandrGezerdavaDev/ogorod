import { NextResponse } from "next/server"

import { currentKbRevision } from "@/db/change-log"
import { db } from "@/db"
import { cultivar, species } from "@/db/schema"
import { getSession } from "@/lib/session"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const [speciesRows, cultivarRows, revision] = await Promise.all([
    db.select().from(species),
    db.select().from(cultivar),
    currentKbRevision(),
  ])

  return NextResponse.json({
    revision,
    species: speciesRows,
    cultivars: cultivarRows,
  })
}
