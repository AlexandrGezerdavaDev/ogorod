const MAX_EDGE = 960
const JPEG_QUALITY = 0.72
const MAX_DATA_URL_CHARS = 450_000

export async function compressImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("invalid_type")
  }

  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext("2d")
    if (!context) {
      throw new Error("no_canvas")
    }
    context.drawImage(bitmap, 0, 0, width, height)
    const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY)
    if (dataUrl.length > MAX_DATA_URL_CHARS) {
      throw new Error("too_large")
    }
    return dataUrl
  } finally {
    bitmap.close()
  }
}
