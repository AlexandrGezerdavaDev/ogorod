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
        "aspect-[4/3] w-full",
        "md:aspect-square md:m-3 md:size-24 md:w-24 md:self-start md:rounded-2xl",
        "lg:size-28 lg:w-28"
      )}
    >
      {src && !failed ? (
        // Catalog mock URLs (public/plants); plain img keeps the mock free of next/image remote config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="size-full object-cover transition-transform duration-500 group-hover/card:scale-[1.04]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <LeafIcon className="size-8 md:size-7" />
        </div>
      )}
    </div>
  )
}
