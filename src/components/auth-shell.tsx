import Link from "next/link"
import { SproutIcon } from "lucide-react"
import type { ReactNode } from "react"

import { LocaleSwitcher } from "@/components/locale-switcher"

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 md:max-w-md">
        <Link
          href="/login"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <SproutIcon />
          </div>
          OGOROD
        </Link>
        {children}
        <div className="flex justify-center">
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  )
}
