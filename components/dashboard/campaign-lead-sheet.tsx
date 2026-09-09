"use client"

import { useMemo, useState } from "react"
import { Download, TriangleAlert, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SectorBadge } from "@/components/dashboard/badges"
import type { SectorKey } from "@/lib/constants"
import type { Campaign, CampaignLead } from "@/lib/sector-data"

const CAMPAIGN_STATUS_STYLE: Record<Campaign["status"], { bg: string; color: string }> = {
  Active: { bg: "rgba(87,219,123,0.15)", color: "var(--status-success)" },
  Paused: { bg: "rgba(253,192,109,0.15)", color: "var(--status-warning)" },
  Completed: { bg: "rgba(18,63,54,0.08)", color: "var(--muted-foreground)" },
}

type LeadStatus = "Uncontacted" | "Attempted" | "In Contact" | "Pre-Screening" | "Not Suitable" | "Placed"

const LEAD_STATUS_STYLE: Record<LeadStatus, { bg: string; color: string }> = {
  Uncontacted: { bg: "rgba(237,62,62,0.15)", color: "#ED3E3E" },
  Attempted: { bg: "rgba(253,192,109,0.15)", color: "#FDC06D" },
  "In Contact": { bg: "rgba(127,229,209,0.15)", color: "#123F36" },
  "Pre-Screening": { bg: "rgba(37,99,235,0.15)", color: "#2563EB" },
  "Not Suitable": { bg: "var(--muted)", color: "var(--muted-foreground)" },
  Placed: { bg: "rgba(87,219,123,0.15)", color: "#57DB7B" },
}

const LEAD_FILTERS: (LeadStatus | "All")[] = [
  "All",
  "Uncontacted",
  "Attempted",
  "In Contact",
  "Pre-Screening",
  "Not Suitable",
  "Placed",
]

function detectLeadStatus(notes: string): LeadStatus {
  const n = notes.toLowerCase().trim()
  if (!n) return "Uncontacted"
  if (n.includes("lvm") || n.includes("voicemail") || n.includes("won't answer")) return "Attempted"
  if (n.includes("emailed") || n.includes("call back") || n.includes("added to bh")) return "In Contact"
  if (n.includes("prescreened") || n.includes("referoo") || n.includes("compliant")) return "Pre-Screening"
  if (n.includes("not suitable") || n.includes("not looking") || n.includes("only")) return "Not Suitable"
  if (n.includes("placed") || n.includes("started")) return "Placed"
  return "Uncontacted"
}

function daysStyle(days: number): { color?: string } {
  if (days >= 8) return { color: "#ED3E3E" }
  if (days >= 4) return { color: "#FDC06D" }
  return {}
}

export function CampaignLeadSheet({
  campaign,
  sector,
  open,
  onOpenChange,
}: {
  campaign: Campaign | null
  sector: SectorKey
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [filter, setFilter] = useState<(typeof LEAD_FILTERS)[number]>("All")

  const leadsWithStatus = useMemo(() => {
    if (!campaign) return []
    return campaign.leadsList.map((lead) => ({ ...lead, status: detectLeadStatus(lead.notes) }))
  }, [campaign])

  const counts = useMemo(() => {
    const base: Record<(typeof LEAD_FILTERS)[number], number> = {
      All: leadsWithStatus.length,
      Uncontacted: 0,
      Attempted: 0,
      "In Contact": 0,
      "Pre-Screening": 0,
      "Not Suitable": 0,
      Placed: 0,
    }
    for (const lead of leadsWithStatus) base[lead.status] += 1
    return base
  }, [leadsWithStatus])

  const filtered = useMemo(() => {
    if (filter === "All") return leadsWithStatus
    return leadsWithStatus.filter((lead) => lead.status === filter)
  }, [leadsWithStatus, filter])

  if (!campaign) return null
  const statusStyle = CAMPAIGN_STATUS_STYLE[campaign.status]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="flex w-[640px]! flex-col gap-0 sm:max-w-[640px]!"
      >
        <SheetClose
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            />
          }
        >
          <X />
          <span className="sr-only">Close</span>
        </SheetClose>

        <SheetHeader className="gap-2 border-b border-border pb-4">
          <SheetTitle className="text-lg font-semibold text-foreground">{campaign.name}</SheetTitle>
          <div className="flex items-center gap-2">
            <SectorBadge sector={sector} />
            <Badge className="border-transparent" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
              {campaign.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{campaign.dateRange}</p>
        </SheetHeader>

        <div className="flex items-center gap-4 border-b border-border px-4 pb-3">
          <Stat label="Spend" value={`$${campaign.spend.toLocaleString()}`} />
          <Stat label="Impressions" value={campaign.impressions.toLocaleString()} />
          <Stat label="Reach" value={campaign.reach.toLocaleString()} />
          <Stat label="Leads" value={String(campaign.leads)} />
          <Stat label="CPL" value={`$${campaign.cpl.toFixed(0)}`} />
        </div>

        <div className="border-b border-border px-4 py-3">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as (typeof LEAD_FILTERS)[number])}>
            <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-0">
              {LEAD_FILTERS.map((f) => (
                <TabsTrigger key={f} value={f} className="gap-1.5 bg-muted px-2 py-1 text-xs data-active:bg-background">
                  {f}
                  <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                    {counts[f]}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <TooltipProvider>
          <div className="min-h-0 flex-1 overflow-y-auto px-4">
            <Table className="table-fixed">
              <colgroup>
                <col style={{ width: "128px" }} />
                <col style={{ width: "108px" }} />
                <col style={{ width: "100px" }} />
                <col style={{ width: "112px" }} />
                <col style={{ width: "44px" }} />
                <col style={{ width: "116px" }} />
              </colgroup>
              <TableHeader className="sticky top-0 z-10 bg-popover">
                <TableRow>
                  <TableHead className="truncate">Name</TableHead>
                  <TableHead className="truncate">Job Title</TableHead>
                  <TableHead className="truncate">Consultant</TableHead>
                  <TableHead className="truncate">Status</TableHead>
                  <TableHead className="truncate">Days</TableHead>
                  <TableHead className="truncate">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lead, i) => (
                  <LeadRow key={`${lead.name}-${i}`} lead={lead} status={lead.status} />
                ))}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>

        <SheetFooter className="flex-row items-center justify-between border-t border-border">
          <p className="text-xs text-muted-foreground">
            {filtered.length} of {leadsWithStatus.length} leads
          </p>
          <Button variant="outline" size="sm">
            Export CSV
            <Download />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-base font-semibold text-foreground">{value}</span>
    </div>
  )
}

function LeadRow({ lead, status }: { lead: CampaignLead; status: LeadStatus }) {
  const style = LEAD_STATUS_STYLE[status]
  const dStyle = daysStyle(lead.days)
  return (
    <TableRow>
      <TableCell className="truncate text-sm font-medium text-foreground">{lead.name}</TableCell>
      <TableCell className="truncate text-sm text-muted-foreground">{lead.jobTitle}</TableCell>
      <TableCell className="truncate text-sm text-muted-foreground">{lead.consultant}</TableCell>
      <TableCell className="overflow-hidden">
        <Badge className="max-w-full truncate border-transparent" style={{ backgroundColor: style.bg, color: style.color }}>
          {status}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center gap-1 text-xs" style={dStyle}>
          {lead.days >= 8 && <TriangleAlert className="size-3" />}
          {lead.days}d
        </span>
      </TableCell>
      <TableCell className="max-w-[120px] overflow-hidden whitespace-nowrap">
        {lead.notes ? (
          <Tooltip>
            <TooltipTrigger
              render={<span className="block truncate text-xs text-muted-foreground" />}
            >
              {lead.notes}
            </TooltipTrigger>
            <TooltipContent>{lead.notes}</TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
    </TableRow>
  )
}
