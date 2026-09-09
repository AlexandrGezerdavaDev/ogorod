"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { FenceIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react"

import { useSpaces, type DisplaySpace } from "@/features/farm"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { SpaceFormSheet } from "@/components/space-form"
import { plantsHref } from "@/lib/navigation"
import { useI18n } from "@/i18n/provider"

export function NavSpaces() {
  const { isMobile } = useSidebar()
  const { messages: m } = useI18n()
  const { spaces } = useSpaces()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedId = pathname === "/plants" ? searchParams.get("space") : null
  const [addOpen, setAddOpen] = React.useState(false)
  const [editSpace, setEditSpace] = React.useState<DisplaySpace>()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{m.garden.spaces}</SidebarGroupLabel>
      <SidebarGroupAction
        type="button"
        title={m.garden.addSpace}
        onClick={() => setAddOpen(true)}
      >
        <PlusIcon />
        <span className="sr-only">{m.garden.addSpace}</span>
      </SidebarGroupAction>
      <SidebarMenu>
        {spaces.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              className="text-sidebar-foreground/70"
              onClick={() => setAddOpen(true)}
            >
              <FenceIcon />
              <span>{m.garden.spaceEmpty}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/plants" && !selectedId}
                render={<Link href={plantsHref()} />}
              >
                <FenceIcon />
                <span>{m.garden.allSpaces}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {spaces.map((space) => (
              <SidebarMenuItem key={space.id}>
                <SidebarMenuButton
                  isActive={selectedId === space.id}
                  render={<Link href={plantsHref(space.id)} />}
                >
                  <FenceIcon />
                  <span>{space.label}</span>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <SidebarMenuAction
                        showOnHover
                        className="aria-expanded:bg-muted"
                      />
                    }
                  >
                    <MoreHorizontalIcon />
                    <span className="sr-only">{m.garden.more}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-fit"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setEditSpace(space)}>
                        {m.garden.editSpace}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        render={<Link href={plantsHref(space.id)} />}
                      >
                        {m.garden.addPlant}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
          </>
        )}
      </SidebarMenu>
      <SpaceFormSheet open={addOpen} onOpenChange={setAddOpen} />
      <SpaceFormSheet
        open={Boolean(editSpace)}
        onOpenChange={(open) => {
          if (!open) {
            setEditSpace(undefined)
          }
        }}
        space={editSpace}
      />
    </SidebarGroup>
  )
}
