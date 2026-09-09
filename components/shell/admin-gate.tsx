"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { useCurrentUser } from "@/hooks/use-current-user"

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user } = useCurrentUser()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (user && !user.isAdmin) {
      setRedirecting(true)
      router.replace("/overview")
    }
  }, [user, router])

  if (!user || redirecting) {
    return null
  }

  return <>{children}</>
}
