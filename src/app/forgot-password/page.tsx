import type { Metadata } from "next"

import { AuthShell } from "@/components/auth-shell"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { getMessages } from "@/i18n/messages"
import { getRequestLocale } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const m = getMessages(await getRequestLocale())
  return {
    title: m.auth.metaForgotTitle,
    description: m.auth.metaForgotDesc,
  }
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  )
}
