"use client"

import { SettingsForm } from "@/components/settings-form"
import { useI18n } from "@/i18n/provider"

export default function SettingsPage() {
  const { messages: m } = useI18n()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          {m.pages.settings.title}
        </h1>
        <p className="text-muted-foreground">{m.pages.settings.description}</p>
      </div>
      <SettingsForm />
    </div>
  )
}
