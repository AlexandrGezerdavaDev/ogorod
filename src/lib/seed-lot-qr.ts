export const SEED_LOT_QUERY_PARAM = "lot"

export function seedLotQrValue(lotId: string) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")
  const origin =
    configured ||
    (typeof window !== "undefined" ? window.location.origin : "")
  return `${origin}/seeds?${SEED_LOT_QUERY_PARAM}=${encodeURIComponent(lotId)}`
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function withSvgNamespace(svg: string) {
  if (svg.includes("xmlns=")) {
    return svg
  }
  return svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')
}

export function printSeedLotLabel(input: {
  svg: string
  brand: string
  title: string
  meta: string
}) {
  const frame = document.createElement("iframe")
  frame.setAttribute("aria-hidden", "true")
  frame.style.position = "fixed"
  frame.style.right = "0"
  frame.style.bottom = "0"
  frame.style.width = "0"
  frame.style.height = "0"
  frame.style.border = "0"
  document.body.appendChild(frame)

  const win = frame.contentWindow
  const doc = frame.contentDocument
  if (!win || !doc) {
    frame.remove()
    return
  }

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(input.brand)}</title>
<style>
  @page { margin: 12mm; }
  body {
    margin: 0;
    color: #111;
    font-family: system-ui, sans-serif;
    text-align: center;
  }
  .label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 8mm;
  }
  .brand {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.28em;
  }
  svg { width: 48mm; height: 48mm; }
  .title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
  .meta {
    margin: 0;
    font-size: 13px;
  }
</style>
</head>
<body>
  <div class="label">
    <p class="brand">${escapeHtml(input.brand)}</p>
    ${withSvgNamespace(input.svg)}
    <p class="title">${escapeHtml(input.title)}</p>
    <p class="meta">${escapeHtml(input.meta)}</p>
  </div>
</body>
</html>`

  const cleanup = () => {
    win.removeEventListener("afterprint", cleanup)
    frame.remove()
  }
  win.addEventListener("afterprint", cleanup)
  doc.open()
  doc.write(html)
  doc.close()
  win.focus()
  win.print()
  window.setTimeout(cleanup, 60_000)
}
