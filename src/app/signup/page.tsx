import type { Metadata } from "next"

import { AuthShell } from "@/components/auth-shell"
import { SignupForm } from "@/components/signup-form"
import { getMessages } from "@/i18n/messages"
import { getRequestLocale } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const m = getMessages(await getRequestLocale())
  return {
    title: m.auth.metaSignupTitle,
    description: m.auth.metaSignupDesc,
  }
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams

  return (
    <AuthShell>
      <SignupForm from={from} />
    </AuthShell>
  )
}
