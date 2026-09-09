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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3f6b45",
          color: "#f6f4ef",
          fontSize: dimension * 0.42,
          fontWeight: 700,
        }}
      >
        О
      </div>
    ),
    { width: dimension, height: dimension }
  )
}
