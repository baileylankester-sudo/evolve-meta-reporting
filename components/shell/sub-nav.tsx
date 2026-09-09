"use client"

import { useEffect, useState } from "react"

const SECTIONS = [
  { id: "kpis", label: "KPIs" },
  { id: "meta-vs-seek", label: "Meta vs Seek" },
  { id: "pipeline", label: "Pipeline" },
  { id: "candidates", label: "Candidates" },
  { id: "campaigns", label: "Campaigns" },
  { id: "gp-roi", label: "GP & ROI" },
]

export function SubNav() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id)

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    )
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function handleClick(id: string) {
    return (e: React.MouseEvent) => {
      e.preventDefault()
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="sticky top-[52px] z-40 flex h-10 items-center gap-6 overflow-x-auto border-b border-border bg-background px-4 sm:px-6">
      {SECTIONS.map((section) => {
        const isActive = activeId === section.id
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={handleClick(section.id)}
            className={
              "shrink-0 border-b-2 py-2.5 text-xs font-medium transition-colors duration-200 ease-[cubic-bezier(0.33,1,0.68,1)] " +
              (isActive
                ? "border-[color:var(--accent)] font-semibold text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground")
            }
          >
            {section.label}
          </a>
        )
      })}
    </nav>
  )
}
