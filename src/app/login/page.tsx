import type { Metadata } from "next"

import { AuthShell } from "@/components/auth-shell"
import { LoginForm } from "@/components/login-form"
import { getMessages } from "@/i18n/messages"
import { getRequestLocale } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const m = getMessages(await getRequestLocale())
  return {
    title: m.auth.metaLoginTitle,
    description: m.auth.metaLoginDesc,
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams

  return (
    <AuthShell>
      <LoginForm from={from} />
    </AuthShell>
  )
}
