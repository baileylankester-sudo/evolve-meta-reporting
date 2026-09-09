"use client"

import { useEffect, useState } from "react"

import {
  AVAILABLE_USERS,
  CURRENT_USER_EVENT,
  getStoredUser,
  setStoredUser,
  type CurrentUser,
} from "@/lib/current-user"

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null)

  useEffect(() => {
    setUser(getStoredUser())
    function handleChange() {
      setUser(getStoredUser())
    }
    window.addEventListener(CURRENT_USER_EVENT, handleChange)
    window.addEventListener("storage", handleChange)
    return () => {
      window.removeEventListener(CURRENT_USER_EVENT, handleChange)
      window.removeEventListener("storage", handleChange)
    }
  }, [])

  return {
    user,
    users: AVAILABLE_USERS,
    setUser: (name: string) => setStoredUser(name),
  }
}
