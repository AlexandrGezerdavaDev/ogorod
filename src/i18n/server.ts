import { cookies, headers } from "next/headers"

import {
  localeCookie,
  localeFromAcceptLanguage,
  parseLocale,
  type Locale,
} from "./config"
import { getMessages, type Messages } from "./messages"

export async function getRequestLocale(): Promise<Locale> {
  const jar = await cookies()
  const fromCookie = jar.get(localeCookie)?.value
  if (fromCookie === "uk" || fromCookie === "en" || fromCookie === "ru") {
    return fromCookie
  }
  const accept = (await headers()).get("accept-language")
  return parseLocale(localeFromAcceptLanguage(accept))
}

export async function getRequestMessages(): Promise<Messages> {
  return getMessages(await getRequestLocale())
}
