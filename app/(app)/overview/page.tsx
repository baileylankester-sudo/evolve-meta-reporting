import { PageContainer } from "@/components/shell/page-container"
import { OverviewPeriodTabs } from "@/components/dashboard/overview-period-tabs"
import { OverviewHeroRow, OverallContactRateCard } from "@/components/dashboard/overview-hero"
import { SectorHealthGrid } from "@/components/dashboard/sector-health-grid"
import { CombinedPipelineCard } from "@/components/dashboard/combined-pipeline-card"
import { TopUncontactedPanel } from "@/components/dashboard/top-uncontacted-panel"
import { GpSummaryCard } from "@/components/dashboard/gp-summary-card"
import { getOverviewData } from "@/lib/sector-data"

export default function OverviewPage() {
  const data = getOverviewData()

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance text-foreground">
              Overview
            </h1>
            <p className="text-sm text-muted-foreground">All sectors · {data.dateRange}</p>
          </div>
          <OverviewPeriodTabs />
        </div>

        <OverviewHeroRow data={data} />

        <OverallContactRateCard data={data} />

        <SectorHealthGrid sectors={data.sectors} />

        <CombinedPipelineCard pipeline={data.pipeline} />

        <div className="grid grid-cols-1 gap-3 lg:[grid-template-columns:1.6fr_1fr]">
          <TopUncontactedPanel candidates={data.topUncontacted} />
          <GpSummaryCard data={data} />
        </div>
      </div>
    </PageContainer>
  )
}
