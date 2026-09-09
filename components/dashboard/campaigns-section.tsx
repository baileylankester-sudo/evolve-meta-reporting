"use client"

import { useMemo, useState } from "react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Command, CommandInput } from "@/components/ui/command"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CampaignLeadSheet } from "@/components/dashboard/campaign-lead-sheet"
import type { SectorKey } from "@/lib/constants"
import { initials, type Campaign } from "@/lib/sector-data"

const STATUS_STYLE: Record<Campaign["status"], { bg: string; color: string }> = {
  Active: { bg: "rgba(87,219,123,0.15)", color: "var(--status-success)" },
  Paused: { bg: "rgba(253,192,109,0.15)", color: "var(--status-warning)" },
  Completed: { bg: "rgba(18,63,54,0.08)", color: "var(--muted-foreground)" },
}

const FILTERS = ["All", "Active", "Paused", "Completed"] as const

export function CampaignsSection({
  campaigns,
  color,
  sector,
}: {
  campaigns: Campaign[]
  color: string
  sector: SectorKey
}) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All")
  const [selected, setSelected] = useState<Campaign | null>(null)

  const counts = useMemo(() => {
    return {
      All: campaigns.length,
      Active: campaigns.filter((c) => c.status === "Active").length,
      Paused: campaigns.filter((c) => c.status === "Paused").length,
      Completed: campaigns.filter((c) => c.status === "Completed").length,
    }
  }, [campaigns])

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      if (filter !== "All" && c.status !== filter) return false
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [campaigns, filter, search])

  return (
    <Card>
      <CardHeader className="flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="font-heading text-base">Campaigns</CardTitle>
        <div className="flex flex-wrap items-center gap-3">
          <Command className="w-[240px] rounded-lg border border-border bg-transparent p-0">
            <CommandInput placeholder="Search campaigns…" value={search} onValueChange={setSearch} className="text-sm" />
          </Command>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as (typeof FILTERS)[number])}>
            <TabsList>
              {FILTERS.map((f) => (
                <TabsTrigger key={f} value={f} className="gap-1.5">
                  {f}
                  <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                    {counts[f]}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[2fr]">Campaign</TableHead>
              <TableHead>Consultant</TableHead>
              <TableHead className="w-[80px]">Spend</TableHead>
              <TableHead className="w-[80px]">Leads</TableHead>
              <TableHead className="w-[80px]">CPL</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((campaign) => {
              const statusStyle = STATUS_STYLE[campaign.status]
              const momPositive = campaign.leadsMoM >= 0
              return (
                <TableRow key={campaign.id}>
                  <TableCell className="whitespace-normal">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback style={{ backgroundColor: `${color}26`, color }}>
                          {initials(campaign.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{campaign.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {campaign.division} · {campaign.dateRange}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{campaign.consultant}</TableCell>
                  <TableCell className="text-sm font-medium">${campaign.spend.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">{campaign.leads}</span>
                      <span
                        className="inline-flex items-center gap-0.5 text-xs font-medium"
                        style={{ color: momPositive ? "var(--status-success)" : "var(--status-danger)" }}
                      >
                        {momPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                        {Math.abs(campaign.leadsMoM)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">${campaign.cpl.toFixed(0)}</TableCell>
                  <TableCell>
                    <Badge className="border-transparent" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelected(campaign)}>
                      View {campaign.leads} leads
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>

      <CampaignLeadSheet
        campaign={selected}
        sector={sector}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </Card>
  )
}
