import { PasswordGate } from "@/components/shell/password-gate"
import { TopNav } from "@/components/shell/top-nav"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PasswordGate>
      <div className="min-h-screen bg-[#FCFCFC]">
        <TopNav />
        <main className="pt-[52px]">{children}</main>
      </div>
    </PasswordGate>
  )
}
