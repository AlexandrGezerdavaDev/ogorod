"use client"

import { KbAdminView } from "@/components/kb-admin-view"
import { useI18n } from "@/i18n/provider"

export default function KbAdminPage() {
  const { messages: m } = useI18n()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 pb-24 md:pb-8">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          {m.pages.kb.title}
        </h1>
        <p className="text-muted-foreground">{m.pages.kb.description}</p>
      </div>
      <KbAdminView />
    </div>
  )
}
