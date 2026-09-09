"use client"

import * as React from "react"

export function PwaRegister() {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      return
    }

    if (!("serviceWorker" in navigator)) {
      return
    }

    void navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" })
  }, [])

  return null
}
