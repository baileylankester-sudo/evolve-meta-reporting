"use client"

import { useState } from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PERIODS = [
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
  { value: "all", label: "All time" },
]

export function OverviewPeriodTabs() {
  const [period, setPeriod] = useState("90d")

  return (
    <Tabs value={period} onValueChange={(value) => setPeriod(value as string)}>
      <TabsList>
        {PERIODS.map((p) => (
          <TabsTrigger key={p.value} value={p.value} className="px-3">
            {p.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
