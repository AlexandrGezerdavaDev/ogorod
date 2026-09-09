import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { searchPlaces } from "@/features/geo/open-meteo"
import { getSession } from "@/lib/session"

const querySchema = z.object({
  q: z.string().trim().min(1).max(80),
  lang: z.enum(["uk", "en", "ru"]).optional(),
})

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const parsed = querySchema.safeParse({
    q: request.nextUrl.searchParams.get("q") ?? "",
    lang: request.nextUrl.searchParams.get("lang") ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_query" }, { status: 400 })
  }

  if (parsed.data.q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const results = await searchPlaces(parsed.data.q, parsed.data.lang ?? "uk")
    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ error: "geocoding_failed" }, { status: 502 })
  }
}
