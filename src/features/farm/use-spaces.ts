"use client"

import { useMemo } from "react"
import { useLiveQuery } from "dexie-react-hooks"

import { authClient } from "@/features/auth/client"
import { localizeBed } from "@/i18n/localize"
import { useI18n } from "@/i18n/provider"
import { localDb } from "@/features/sync/db"

export type DisplaySpace = {
  id: string
  name: string
  label: string
}

export function useSpaces() {
  const { messages: m } = useI18n()
  const { data: session } = authClient.useSession()
  const organizationId = session?.session.activeOrganizationId
  const rows = useLiveQuery(
    () => (localDb ? localDb.fields.toArray() : []),
    []
  )

  const spaces = useMemo(() => {
    if (!organizationId) {
      return []
    }
    const display: DisplaySpace[] = (rows ?? [])
      .filter(
        (field) => !field.deletedAt && field.organizationId === organizationId
      )
      .map((field) => ({
        id: field.id,
        name: field.name,
        label: localizeBed(m, field.name),
      }))

    return display.sort((left, right) =>
      left.label.localeCompare(right.label, undefined, { sensitivity: "base" })
    )
  }, [m, organizationId, rows])

  return {
    spaces,
    isPending: rows === undefined,
  }
}
