import type { LucideIcon } from "lucide-react"
import {
  CalendarDaysIcon,
  HomeIcon,
  LeafIcon,
  ScanLineIcon,
  SproutIcon,
} from "lucide-react"

import type { Messages } from "@/i18n/messages"

export type AppRoute = "/" | "/plants" | "/scan" | "/calendar" | "/seeds" | "/settings"

export function plantsHref(spaceId?: string | null) {
  if (!spaceId) {
    return "/plants"
  }
  return `/plants?space=${encodeURIComponent(spaceId)}`
}

export type NavKey = "home" | "plants" | "scan" | "calendar" | "seeds"

export type NavItem = {
  key: NavKey
  href: AppRoute
  icon: LucideIcon
}

export const mainNav: NavItem[] = [
  { key: "home", href: "/", icon: HomeIcon },
  { key: "plants", href: "/plants", icon: LeafIcon },
  { key: "scan", href: "/scan", icon: ScanLineIcon },
  { key: "calendar", href: "/calendar", icon: CalendarDaysIcon },
  { key: "seeds", href: "/seeds", icon: SproutIcon },
]

export const pageKeys: Record<AppRoute, keyof Messages["pages"]> = {
  "/": "home",
  "/plants": "plants",
  "/scan": "scan",
  "/calendar": "calendar",
  "/seeds": "seeds",
  "/settings": "settings",
}
