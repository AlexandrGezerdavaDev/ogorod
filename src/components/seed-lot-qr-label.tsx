"use client"

import { useRef } from "react"
import { PrinterIcon } from "lucide-react"
import QRCode from "react-qr-code"

import { printSeedLotLabel, seedLotQrValue } from "@/lib/seed-lot-qr"
import { useI18n } from "@/i18n/provider"
import { Button } from "@/components/ui/button"

export type SeedLotQrData = {
  id: string
  title: string
  meta: string
}

export function SeedLotQrLabel({ lot }: { lot: SeedLotQrData }) {
  const { messages: m } = useI18n()
  const svgWrapRef = useRef<HTMLDivElement>(null)
  const value = seedLotQrValue(lot.id)

  function onPrint() {
    const svg = svgWrapRef.current?.querySelector("svg")
    if (!svg) {
      return
    }
    printSeedLotLabel({
      svg: svg.outerHTML,
      brand: m.seeds.qrBrand,
      title: lot.title,
      meta: lot.meta,
    })
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={svgWrapRef}
        className="rounded-xl bg-white p-4"
      >
        <QRCode
          value={value}
          size={196}
          level="M"
          bgColor="#FFFFFF"
          fgColor="#111111"
          title={m.seeds.qrAria}
        />
      </div>
      <div className="text-center">
        <p className="font-heading text-base font-medium">{lot.title}</p>
        <p className="text-sm text-muted-foreground">{lot.meta}</p>
      </div>
      <Button type="button" className="w-full" onClick={onPrint}>
        <PrinterIcon data-icon="inline-start" />
        {m.seeds.qrPrint}
      </Button>
    </div>
  )
}
