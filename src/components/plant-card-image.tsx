"use client"

import { useEffect, useState } from "react"
import { LeafIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function PlantCardImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden bg-muted",
        "aspect-[16/10] h-40 w-full max-h-44",
        "md:aspect-auto md:h-auto md:max-h-none md:w-36 md:min-h-[10.5rem] lg:w-40"
      )}
    >
      {src && !failed ? (
        // Catalog mock URLs (public/plants); plain img keeps the mock free of next/image remote config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <LeafIcon className="size-10" />
        </div>
      )}
    </div>
  )
}
