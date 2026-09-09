"use client"

import * as React from "react"
import { Suspense } from "react"

import { GardenSwitcher } from "@/components/garden-switcher"
import { NavSpaces } from "@/components/nav-spaces"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <GardenSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <Suspense fallback={null}>
          <NavSpaces />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
