"use client"

import { usePathname, useRouter } from "next/navigation"
import { ChevronsUpDownIcon, PlusIcon, SproutIcon } from "lucide-react"

import { authClient } from "@/features/auth/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useI18n } from "@/i18n/provider"

export function GardenSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const { isMobile } = useSidebar()
  const { messages: m } = useI18n()
  const { data: organizations } = authClient.useListOrganizations()
  const { data: activeOrganization } = authClient.useActiveOrganization()
  const gardens = organizations ?? []
  const active = activeOrganization ?? gardens[0]

  if (!active) {
    return null
  }

  async function selectGarden(organizationId: string) {
    if (organizationId === active.id) {
      return
    }
    await authClient.organization.setActive({ organizationId })
    if (pathname === "/plants") {
      router.replace("/plants")
    }
    router.refresh()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <SproutIcon />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{active.name}</span>
              <span className="truncate text-xs">{m.garden.gardens}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>{m.garden.gardens}</DropdownMenuLabel>
              {gardens.map((garden, index) => (
                <DropdownMenuItem
                  key={garden.id}
                  onClick={() => void selectGarden(garden.id)}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <SproutIcon />
                  </div>
                  {garden.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <PlusIcon />
                </div>
                {m.garden.addGarden}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
