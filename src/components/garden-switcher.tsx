"use client"

import { authClient } from "@/features/auth/client"
import { OgorodLogo } from "@/components/ogorod-logo"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useI18n } from "@/i18n/provider"

export function GardenSwitcher() {
  const { messages: m } = useI18n()
  const { data: organizations } = authClient.useListOrganizations()
  const { data: activeOrganization } = authClient.useActiveOrganization()
  const gardens = organizations ?? []
  const active = activeOrganization ?? gardens[0]

  if (!active) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="pointer-events-none">
          <OgorodLogo size={32} className="size-8" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{active.name}</span>
            <span className="truncate text-xs">{m.garden.gardens}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
