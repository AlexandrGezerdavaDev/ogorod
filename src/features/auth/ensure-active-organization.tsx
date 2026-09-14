"use client"

import * as React from "react"

import { authClient } from "@/features/auth/client"

/** Ensures the session has an active garden when the user already has organizations. */
export function EnsureActiveOrganization() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const { data: organizations, isPending: orgsPending } =
    authClient.useListOrganizations()
  const fixing = React.useRef(false)

  React.useEffect(() => {
    if (sessionPending || orgsPending || fixing.current) {
      return
    }

    const activeId = session?.session.activeOrganizationId
    const first = organizations?.[0]
    if (!session || !first || activeId) {
      return
    }

    fixing.current = true
    void authClient.organization
      .setActive({ organizationId: first.id })
      .then(() => authClient.getSession())
      .finally(() => {
        fixing.current = false
      })
  }, [organizations, orgsPending, session, sessionPending])

  return null
}
