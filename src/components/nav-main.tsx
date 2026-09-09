"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { mainNav } from "@/lib/navigation"
import { useI18n } from "@/i18n/provider"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain() {
  const pathname = usePathname()
  const { messages: m } = useI18n()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{m.nav.label}</SidebarGroupLabel>
      <SidebarMenu>
        {mainNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={m.nav[item.key]}
              render={<Link href={item.href} />}
            >
              <item.icon />
              <span>{m.nav[item.key]}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
