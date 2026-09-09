"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { pageKeys, type AppRoute } from "@/lib/navigation"
import { Separator } from "@/components/ui/separator"
import { HeaderAccountMenu } from "@/components/account-menu"
import { useI18n } from "@/i18n/provider"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AppHeader() {
  const pathname = usePathname()
  const { messages: m } = useI18n()
  const route = pathname in pageKeys ? (pathname as AppRoute) : "/"
  const meta = m.pages[pageKeys[route]]

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:border-b-0">
      <div className="flex min-w-0 flex-1 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 hidden data-vertical:h-4 data-vertical:self-auto md:block"
        />
        <p className="truncate font-heading text-base font-medium md:hidden">
          OGOROD
        </p>
        <Breadcrumb className="hidden min-w-0 md:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>OGOROD</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{meta.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="px-4 md:hidden">
        <HeaderAccountMenu />
      </div>
    </header>
  )
}
