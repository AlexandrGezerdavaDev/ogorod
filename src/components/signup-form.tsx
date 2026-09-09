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

export function SignupForm({
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

    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const email = String(form.get("email") ?? "")
    const password = String(form.get("password") ?? "")
    const confirm = String(form.get("confirm") ?? "")

    if (password !== confirm) {
      setError(m.auth.passwordsMismatch)
      return
    }

    setPending(true)

    const { error: signUpError } = await authClient.signUp.email({
      name,
      email,
      password,
    })

    if (signUpError) {
      setPending(false)
      setError(authErrorMessage(signUpError, m.auth.errors, m.auth.errors.fallback))
      return
    }

    await authClient.organization.create({
      name: m.auth.defaultGarden,
      slug: `farm-${crypto.randomUUID().slice(0, 8)}`,
    })

    setPending(false)
    const next = isSafeRedirect(from) ? from! : "/"
    router.push(next)
    router.refresh()
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{m.auth.signupTitle}</CardTitle>
          <CardDescription>{m.auth.signupDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">{m.auth.name}</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={m.auth.namePlaceholder}
                  autoComplete="name"
                  required
                  minLength={2}
                  className="h-11 md:h-9"
                />
              </Field>
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
                <FieldLabel htmlFor="password">{m.auth.password}</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="h-11 md:h-9"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm">{m.auth.confirm}</FieldLabel>
                <Input
                  id="confirm"
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
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
                  {m.auth.signUp}
                </Button>
                <FieldDescription className="text-center">
                  {m.auth.hasAccount} <Link href="/login">{m.auth.signIn}</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        {m.auth.signupTerms}
      </FieldDescription>
    </div>
  )
}
