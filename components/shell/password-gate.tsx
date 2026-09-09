"use client"

import { useEffect, useState, type FormEvent } from "react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EvolveLogo } from "@/components/shell/evolve-logo"

const ACCESS_CODE = "evolve2024"
const STORAGE_KEY = "evolve-meta-reporting-auth"

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    setAuthed(window.localStorage.getItem(STORAGE_KEY) === "true")
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (code === ACCESS_CODE) {
      window.localStorage.setItem(STORAGE_KEY, "true")
      setAuthed(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  if (authed === null) {
    return null
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
        <Dialog open modal>
          <DialogContent
            showCloseButton={false}
            className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl p-8 text-center"
          >
            <DialogTitle className="sr-only">Sign in to Meta Reporting</DialogTitle>
            <EvolveLogo />
            <h1 className="font-heading text-lg font-semibold text-foreground">
              Meta Reporting
            </h1>
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
              <Input
                type="password"
                placeholder="Enter access code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  if (error) setError(false)
                }}
                aria-invalid={error}
                autoFocus
              />
              {error ? (
                <Badge variant="destructive" className="w-fit">
                  Incorrect code
                </Badge>
              ) : null}
              <Button
                type="submit"
                className="w-full bg-[#123F36] text-[#E3FFFA] hover:bg-[#123F36]/90"
              >
                Sign in
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return <>{children}</>
}
