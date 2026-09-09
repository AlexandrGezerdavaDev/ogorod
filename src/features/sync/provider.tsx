"use client"

import * as React from "react"

import { startSyncEngine } from "./engine"

export function SyncProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => startSyncEngine(), [])
  return children
}
