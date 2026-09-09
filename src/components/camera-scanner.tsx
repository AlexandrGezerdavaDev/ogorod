"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CameraIcon, RefreshCwIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useI18n } from "@/i18n/provider"

type CameraState = "loading" | "ready" | "denied" | "unsupported"

export function CameraScanner() {
  const router = useRouter()
  const { messages: m } = useI18n()
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const [state, setState] = React.useState<CameraState>("loading")
  const [snapshot, setSnapshot] = React.useState<string | null>(null)

  const stopStream = React.useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  const startCamera = React.useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("unsupported")
      return
    }

    setSnapshot(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setState("ready")
    } catch {
      setState("denied")
    }
  }, [])

  React.useEffect(() => {
    const video = videoRef.current
    let cancelled = false

    if (!navigator.mediaDevices?.getUserMedia) {
      Promise.resolve().then(() => {
        if (!cancelled) {
          setState("unsupported")
        }
      })
      return () => {
        cancelled = true
      }
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      .then(async (stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (video) {
          video.srcObject = stream
          await video.play()
        }
        setState("ready")
      })
      .catch(() => {
        if (!cancelled) {
          setState("denied")
        }
      })

    return () => {
      cancelled = true
      stopStream()
    }
  }, [stopStream])

  function capture() {
    const video = videoRef.current
    if (!video) {
      return
    }

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext("2d")
    if (!context) {
      return
    }

    context.drawImage(video, 0, 0)
    setSnapshot(canvas.toDataURL("image/jpeg", 0.9))
    toast.success(m.scan.saved)
  }

  return (
    <div className="relative flex min-h-svh flex-1 flex-col bg-black text-white md:min-h-[calc(100svh-1rem)] md:overflow-hidden md:rounded-xl">
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        playsInline
        muted
        autoPlay
      />
      {snapshot && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={snapshot}
          alt={m.scan.snapshotAlt}
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex items-center justify-between p-4">
        <Button
          variant="secondary"
          size="icon"
          aria-label={m.scan.close}
          onClick={() => {
            stopStream()
            router.back()
          }}
        >
          <XIcon />
        </Button>
        <p className="text-sm font-medium">{m.scan.title}</p>
        <Button
          variant="secondary"
          size="icon"
          aria-label={m.scan.restart}
          onClick={() => {
            setState("loading")
            void startCamera()
          }}
        >
          <RefreshCwIcon />
        </Button>
      </div>

      <div className="relative z-10 mx-auto mt-10 size-56 rounded-[2rem] border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] md:size-72" />

      <div className="relative z-10 mt-auto flex flex-col items-center gap-4 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {state === "denied" && (
          <Alert variant="destructive" className="max-w-md">
            <AlertTitle>{m.scan.deniedTitle}</AlertTitle>
            <AlertDescription>{m.scan.deniedDesc}</AlertDescription>
          </Alert>
        )}
        {state === "unsupported" && (
          <Empty className="max-w-md border bg-background text-foreground">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CameraIcon />
              </EmptyMedia>
              <EmptyTitle>{m.scan.unsupportedTitle}</EmptyTitle>
              <EmptyDescription>{m.scan.unsupportedDesc}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        <Button
          size="lg"
          className="min-w-40"
          disabled={state !== "ready"}
          onClick={capture}
        >
          <CameraIcon data-icon="inline-start" />
          {m.scan.capture}
        </Button>
      </div>
    </div>
  )
}
