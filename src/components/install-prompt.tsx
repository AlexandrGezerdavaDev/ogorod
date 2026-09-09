"use client"

import * as React from "react"
import { CheckIcon, DownloadIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/provider"
import { useSyncStatus } from "@/features/sync/use-sync-status"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function subscribeInstall(onChange: () => void) {
  window.addEventListener("appinstalled", onChange)
  const media = window.matchMedia("(display-mode: standalone)")
  media.addEventListener("change", onChange)
  return () => {
    window.removeEventListener("appinstalled", onChange)
    media.removeEventListener("change", onChange)
  }
}

function readInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      Boolean((navigator as { standalone?: boolean }).standalone))
  )
}

export function InstallPrompt() {
  const { messages: m } = useI18n()
  const { lastSyncedAt, pending, online } = useSyncStatus()
  const isClient = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const installed = React.useSyncExternalStore(
    subscribeInstall,
    readInstalled,
    () => false
  )
  const [deferredPrompt, setDeferredPrompt] =
    React.useState<BeforeInstallPromptEvent | null>(null)
  const [notify, setNotify] = React.useState<NotificationPermission | "unsupported">(
    "unsupported"
  )

  React.useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", onPrompt)
    window.addEventListener("appinstalled", onInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt)
      window.removeEventListener("appinstalled", onInstalled)
    }
  }, [])

  const offlineReady = isClient && Boolean(navigator.serviceWorker?.controller)
  const background =
    isClient &&
    typeof ServiceWorkerRegistration !== "undefined" &&
    "sync" in ServiceWorkerRegistration.prototype
  const permission =
    !isClient || typeof Notification === "undefined"
      ? "unsupported"
      : notify === "unsupported"
        ? Notification.permission
        : notify
  const synced = Boolean(lastSyncedAt) && pending === 0 && online

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.install.title}</CardTitle>
        <CardDescription>{m.install.desc}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <StatusLine ok={installed} okLabel={m.install.installed} failLabel={m.install.notInstalled} />
          <StatusLine
            ok={offlineReady}
            okLabel={m.install.offlineReady}
            failLabel={m.install.offlineWait}
          />
          <StatusLine
            ok={permission === "granted"}
            okLabel={m.install.notifyAllowed}
            failLabel={
              permission === "denied" ? m.install.notifyDenied : m.install.notifyDefault
            }
          />
          <StatusLine
            ok={background}
            okLabel={m.install.backgroundOn}
            failLabel={m.install.backgroundOff}
          />
          <StatusLine ok={synced} okLabel={m.install.synced} failLabel={m.install.notSynced} />
        </div>
        <div className="flex flex-wrap gap-2">
          {!installed ? (
            <Button
              disabled={!deferredPrompt}
              onClick={async () => {
                if (!deferredPrompt) {
                  toast(m.install.toast)
                  return
                }
                await deferredPrompt.prompt()
                setDeferredPrompt(null)
              }}
            >
              <DownloadIcon data-icon="inline-start" />
              {deferredPrompt ? m.install.install : m.install.browser}
            </Button>
          ) : null}
          {permission === "default" ? (
            <Button
              variant="outline"
              onClick={async () => {
                const next = await Notification.requestPermission()
                setNotify(next)
              }}
            >
              {m.install.requestNotify}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function StatusLine({
  ok,
  okLabel,
  failLabel,
}: {
  ok: boolean
  okLabel: string
  failLabel: string
}) {
  return (
    <p className="flex items-center gap-2 text-sm">
      {ok ? (
        <CheckIcon className="size-4 text-primary" />
      ) : (
        <XIcon className="size-4 text-muted-foreground" />
      )}
      <span className={ok ? undefined : "text-muted-foreground"}>
        {ok ? okLabel : failLabel}
      </span>
    </p>
  )
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}
