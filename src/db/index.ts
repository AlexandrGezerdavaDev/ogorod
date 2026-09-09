import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./schema"

const globalForDb = globalThis as unknown as {
  postgres?: ReturnType<typeof postgres>
}

function createClient() {
  const url =
    process.env.DATABASE_URL ?? "postgres://ogorod:ogorod@localhost:5432/ogorod"

  if (!globalForDb.postgres) {
    globalForDb.postgres = postgres(url, { max: 10 })
  }

  return globalForDb.postgres
}

export const db = drizzle(createClient(), { schema })
export type Database = typeof db
