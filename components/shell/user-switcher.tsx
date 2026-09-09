"use client"

import { ShieldCheck } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "@/hooks/use-current-user"

export function UserSwitcher() {
  const { user, users, setUser } = useCurrentUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <Avatar>
          <AvatarFallback className="bg-[#CFF5EE] text-[#123F36]">
            {user?.initials ?? "··"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
          {users.map((candidate) => (
            <DropdownMenuItem
              key={candidate.name}
              onClick={() => setUser(candidate.name)}
              className="justify-between"
            >
              <span className="flex items-center gap-1.5">
                {candidate.name}
                {candidate.isAdmin ? (
                  <ShieldCheck className="size-3.5 text-[color:var(--status-success)]" />
                ) : null}
              </span>
              {user?.name === candidate.name ? (
                <span className="size-1.5 rounded-full bg-primary" />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <p className="px-1.5 py-1 text-xs text-muted-foreground">
          Only admins can access Upload data.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
