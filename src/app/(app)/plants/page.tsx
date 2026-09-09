import { Suspense } from "react"

import { PlantsView } from "@/components/plants-view"

export default function PlantsPage() {
  return (
    <Suspense>
      <PlantsView />
    </Suspense>
  )
}
