"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { isSafeRedirect } from "@/features/auth/constants"
import { authClient } from "@/features/auth/client"
import { authErrorMessage } from "@/features/auth/errors"
import { useI18n } from "@/i18n/provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

export function LoginForm({
  className,
  from,
  ...props
}: React.ComponentProps<"div"> & { from?: string }) {
  const router = useRouter()
  const { messages: m } = useI18n()
  const [error, setError] = React.useState<string>()
  const [pending, setPending] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)
    setPending(true)

    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "")
    const password = String(form.get("password") ?? "")

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    })

    setPending(false)

    if (signInError) {
      setError(authErrorMessage(signInError, m.auth.errors, m.auth.errors.invalid))
      return
    }

    const { data: sessionData } = await authClient.getSession()
    if (!sessionData?.session.activeOrganizationId) {
      const { data: organizations } = await authClient.organization.list()
      const gardenId = organizations?.[0]?.id
      if (gardenId) {
        await authClient.organization.setActive({ organizationId: gardenId })
      }
    }

    const next = isSafeRedirect(from) ? from! : "/"
    router.push(next)
    router.refresh()
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{m.auth.loginTitle}</CardTitle>
          <CardDescription>{m.auth.loginDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">{m.auth.email}</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="olena@ogorod.app"
                  autoComplete="email"
                  required
                  className="h-11 md:h-9"
                />
              </Field>
              <Field>
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel htmlFor="password">{m.auth.password}</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm underline-offset-4 hover:underline"
                  >
                    {m.auth.forgot}
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={8}
                  className="h-11 md:h-9"
                />
              </Field>
              {error ? (
                <Field data-invalid>
                  <FieldError>{error}</FieldError>
                </Field>
              ) : null}
              <Field>
                <Button type="submit" size="lg" className="w-full" disabled={pending}>
                  {pending ? <Spinner data-icon="inline-start" /> : null}
                  {m.auth.signIn}
                </Button>
                <FieldDescription className="text-center">
                  {m.auth.noAccount} <Link href="/signup">{m.auth.create}</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        {m.auth.terms}
      </FieldDescription>
    </div>
  )
}
