import Link from "next/link"
import type { ReactNode } from "react"

import { LocaleSwitcher } from "@/components/locale-switcher"
import { OgorodLogo } from "@/components/ogorod-logo"

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 md:max-w-md">
        <Link
          href="/login"
          className="flex items-center gap-2.5 self-center font-medium"
        >
          <OgorodLogo size={28} className="size-7" />
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
