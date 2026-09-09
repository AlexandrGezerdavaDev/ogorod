"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOutIcon, Settings2Icon } from "lucide-react"

import { authClient } from "@/features/auth/client"
import { useI18n } from "@/i18n/provider"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function useAccount() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const name = session?.user.name ?? "OGOROD"
  const email = session?.user.email ?? ""
  const image = session?.user.image ?? ""
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)

  function signOut() {
    void authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/login")
          router.refresh()
        },
      },
    })
  }

  return { name, email, image, initials, signOut }
}

export function AccountMenuLabel({
  name,
  email,
  image,
  initials,
}: {
  name: string
  email: string
  image: string
  initials: string
}) {
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar>
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{name}</span>
            <span className="truncate text-xs">{email}</span>
          </div>
        </div>
      </DropdownMenuLabel>
    </DropdownMenuGroup>
  )
}

export function AccountMenuItems({ onSignOut }: { onSignOut: () => void }) {
  const { messages: m } = useI18n()
  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem render={<Link href="/settings" />}>
          <Settings2Icon />
          {m.account.settings}
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem onClick={onSignOut}>
          <LogOutIcon />
          {m.account.logout}
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  )
}

export function HeaderAccountMenu() {
  const { name, email, image, initials, signOut } = useAccount()
  const { messages: m } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" aria-label={m.account.aria} />}
      >
        <Avatar size="sm">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <AccountMenuLabel
          name={name}
          email={email}
          image={image}
          initials={initials}
        />
        <DropdownMenuSeparator />
        <AccountMenuItems onSignOut={signOut} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
