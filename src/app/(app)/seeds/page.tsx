import { Suspense } from "react"

import { SeedsView } from "@/components/seeds-view"

export default function SeedsPage() {
  return (
    <Suspense>
      <SeedsView />
    </Suspense>
  )
}
