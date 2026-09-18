"use client"

import { SeedLotQrLabel, type SeedLotQrData } from "@/components/seed-lot-qr-label"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useI18n } from "@/i18n/provider"

export function SeedLotQrSheet({
  lot,
  open,
  onOpenChange,
}: {
  lot: SeedLotQrData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { messages: m } = useI18n()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{m.seeds.qrTitle}</SheetTitle>
          <SheetDescription>{m.seeds.qrDesc}</SheetDescription>
        </SheetHeader>
        {lot ? (
          <div className="px-4 pb-2">
            <SeedLotQrLabel lot={lot} />
          </div>
        ) : null}
        <SheetFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {m.seeds.qrDone}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
