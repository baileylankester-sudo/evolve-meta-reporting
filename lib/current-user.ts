export type CurrentUser = {
  name: string
  initials: string
  isAdmin: boolean
}

export const AVAILABLE_USERS: CurrentUser[] = [
  { name: "Bailey Chen", initials: "BC", isAdmin: true },
  { name: "Emily Osei", initials: "EO", isAdmin: true },
  { name: "Jordan Lee", initials: "JL", isAdmin: false },
]

export const CURRENT_USER_STORAGE_KEY = "evolve-current-user"
export const CURRENT_USER_EVENT = "evolve-current-user-change"

export function getStoredUser(): CurrentUser {
  if (typeof window === "undefined") return AVAILABLE_USERS[0]
  const stored = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY)
  return AVAILABLE_USERS.find((user) => user.name === stored) ?? AVAILABLE_USERS[0]
}

export function setStoredUser(name: string) {
  window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, name)
  window.dispatchEvent(new Event(CURRENT_USER_EVENT))
}
