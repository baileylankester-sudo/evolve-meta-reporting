"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { EvolveLogo } from "@/components/shell/evolve-logo"
import { UserSwitcher } from "@/components/shell/user-switcher"
import { useCurrentUser } from "@/hooks/use-current-user"

const NAV_TABS = [
  { value: "overview", label: "Overview", href: "/overview" },
  { value: "healthcare", label: "Healthcare", href: "/healthcare" },
  { value: "mining", label: "Mining FM", href: "/mining" },
  { value: "ena", label: "ENA", href: "/ena" },
  { value: "dnc", label: "Design & Construct", href: "/dnc" },
]

const lastUpdated = new Date().toLocaleDateString("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useCurrentUser()

  const activeValue =
    NAV_TABS.find((tab) => pathname.startsWith(tab.href))?.value ?? "overview"

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[52px] items-center justify-between gap-4 border-b border-[rgba(18,63,54,0.1)] bg-card px-4 shadow-[0_1px_0_rgba(18,63,54,0.06)] sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Link href="/overview" className="flex items-center">
          <EvolveLogo />
        </Link>
        <Separator orientation="vertical" className="h-5" />
        <span className="hidden text-xs text-muted-foreground sm:inline">
          Meta Reporting
        </span>
      </div>

      <Tabs
        value={activeValue}
        onValueChange={(value) => {
          const tab = NAV_TABS.find((t) => t.value === value)
          if (tab) router.push(tab.href)
        }}
        className="hidden md:flex"
      >
        <TabsList className="gap-0.5 rounded-full bg-[rgba(18,63,54,0.06)] p-1">
          {NAV_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-full px-3.5 text-[#123F36]/60 transition-all duration-200 ease-[cubic-bezier(0.33,1,0.68,1)] hover:bg-[rgba(18,63,54,0.08)] hover:text-[#123F36] data-active:bg-[#123F36] data-active:text-[#E3FFFA] data-active:shadow-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-muted-foreground lg:inline">
          Last updated: {lastUpdated}
        </span>
        {user?.isAdmin ? (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/upload" />}
          >
            Upload data
          </Button>
        ) : null}
        <UserSwitcher />
      </div>
    </header>
  )
}
