import { HomeView } from "@/components/home-view"
import { getSession } from "@/lib/session"

function greetingName(fullName: string | undefined) {
  const first = fullName?.trim().split(/\s+/)[0]
  return first || null
}

export default async function HomePage() {
  const session = await getSession()
  return <HomeView name={greetingName(session?.user.name)} />
}
