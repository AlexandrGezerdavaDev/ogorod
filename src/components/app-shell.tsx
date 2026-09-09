"use client"

import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SyncProvider } from "@/features/sync/provider"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isScan = pathname === "/scan"

  return (
    <SyncProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {!isScan && <AppHeader />}
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col",
              isScan ? "p-0" : "gap-4 p-4 pt-0 pb-24 md:pb-4"
            )}
          >
            {children}
          </div>
        </SidebarInset>
        {!isScan && <BottomNav />}
      </SidebarProvider>
    </SyncProvider>
  )
}
