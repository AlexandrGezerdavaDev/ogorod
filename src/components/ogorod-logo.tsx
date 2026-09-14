import Image from "next/image"

import { cn } from "@/lib/utils"

export function OgorodLogo({
  className,
  size = 32,
  alt = "OGOROD",
}: {
  className?: string
  size?: number
  alt?: string
}) {
  return (
    <Image
      src="/brand/ogorod-logo.png"
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-[22%] bg-white object-contain", className)}
      priority
    />
  )
}
