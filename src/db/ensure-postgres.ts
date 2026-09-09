import { config } from "dotenv"
import postgres from "postgres"

config({ path: ".env" })

const url =
  process.env.DATABASE_URL ?? "postgres://ogorod:ogorod@localhost:5432/ogorod"

async function main() {
  const sql = postgres(url, { max: 1, connect_timeout: 3 })
  try {
    await sql`select 1`
  } catch (error) {
    const refused =
      error instanceof Error &&
      (error.message.includes("ECONNREFUSED") ||
        ("code" in error && error.code === "ECONNREFUSED"))

    if (refused) {
      console.error(`PostgreSQL не запущений (${url.replace(/:[^:@/]*@/, ":***@")}).

Спочатку підніміть Docker і базу:

  sudo systemctl start docker   # якщо демон не запущений
  docker compose up -d postgres
  npm run db:migrate
  npm run db:seed
`)
      process.exit(1)
    }

    throw error
  } finally {
    await sql.end({ timeout: 1 })
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
