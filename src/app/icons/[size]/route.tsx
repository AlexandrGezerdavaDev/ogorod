import { readFile } from "node:fs/promises"
import path from "node:path"

import { ImageResponse } from "next/og"

const ALLOWED = new Set([192, 512])

export async function GET(
  _request: Request,
  context: RouteContext<"/icons/[size]">
) {
  const { size } = await context.params
  const dimension = Number(size)

  if (!ALLOWED.has(dimension)) {
    return new Response("Not found", { status: 404 })
  }

  const logo = await readFile(
    path.join(process.cwd(), "public/brand/ogorod-logo.png")
  )
  const src = `data:image/png;base64,${logo.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FFFFFF",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={dimension} height={dimension} alt="" />
      </div>
    ),
    { width: dimension, height: dimension }
  )
}
