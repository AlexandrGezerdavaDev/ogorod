type AuthClientError = {
  code?: string
  status?: number
  message?: string
}

type AuthErrorCopy = {
  db: string
  exists: string
  invalid: string
  short: string
}

export function authErrorMessage(
  error: AuthClientError | null | undefined,
  copy: AuthErrorCopy,
  fallback: string
) {
  if (!error) {
    return fallback
  }

  if (error.status === 500 || error.status === 503) {
    return copy.db
  }

  if (
    error.code === "USER_ALREADY_EXISTS" ||
    error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
  ) {
    return copy.exists
  }

  if (error.code === "INVALID_EMAIL_OR_PASSWORD" || error.status === 401) {
    return copy.invalid
  }

  if (error.code === "PASSWORD_TOO_SHORT") {
    return copy.short
  }

  return fallback
}
