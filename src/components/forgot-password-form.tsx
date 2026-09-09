"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { authClient } from "@/features/auth/client"
import { useI18n } from "@/i18n/provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { messages: m } = useI18n()
  const [error, setError] = React.useState<string>()
  const [sent, setSent] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)
    setPending(true)

    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "")

    const { error: resetError } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/login",
    })

    setPending(false)

    if (resetError) {
      setError(m.auth.errors.resetFailed)
      return
    }

    setSent(true)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{m.auth.forgotTitle}</CardTitle>
          <CardDescription>{m.auth.forgotDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <Alert>
              <AlertTitle>{m.auth.sentTitle}</AlertTitle>
              <AlertDescription>{m.auth.sentDesc}</AlertDescription>
            </Alert>
          ) : (
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
                {error ? (
                  <Field data-invalid>
                    <FieldError>{error}</FieldError>
                  </Field>
                ) : null}
                <Field>
                  <Button type="submit" size="lg" className="w-full" disabled={pending}>
                    {pending ? <Spinner data-icon="inline-start" /> : null}
                    {m.auth.send}
                  </Button>
                  <FieldDescription className="text-center">
                    {m.auth.remembered} <Link href="/login">{m.auth.signIn}</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
