"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScanLineIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { mainNav } from "@/lib/navigation"
import { useI18n } from "@/i18n/provider"

const sideItems = mainNav.filter((item) => item.href !== "/scan")
const leftItems = sideItems.slice(0, 2)
const rightItems = sideItems.slice(2)

export function BottomNav() {
  const pathname = usePathname()
  const { messages: m } = useI18n()

  return (
    <nav
      aria-label={m.nav.bottom}
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="grid h-16 grid-cols-5 items-end px-1">
        {leftItems.map((item) => (
          <li key={item.href}>
            <NavLink
              href={item.href}
              title={m.nav[item.key]}
              icon={item.icon}
              active={pathname === item.href}
            />
          </li>
        ))}
        <li className="flex justify-center">
          <Link
            href="/scan"
            aria-label={m.nav.scanAria}
            className={cn(
              "-mt-6 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background transition-transform active:scale-95",
              pathname === "/scan" && "ring-ring/40"
            )}
          >
            <ScanLineIcon className="size-6" />
          </Link>
        </li>
        {rightItems.map((item) => (
          <li key={item.href}>
            <NavLink
              href={item.href}
              title={m.nav[item.key]}
              icon={item.icon}
              active={pathname === item.href}
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}

function NavLink({
  href,
  title,
  icon: Icon,
  active,
}: {
  href: string
  title: string
  icon: (typeof mainNav)[number]["icon"]
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium",
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      <Icon className="size-5" />
      <span>{title}</span>
    </Link>
  )
}
