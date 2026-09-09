import { PageHeader } from "@/components/shell/page-header"
import { PageContainer } from "@/components/shell/page-container"
import { SubNav } from "@/components/shell/sub-nav"
import { KpiStrip } from "@/components/dashboard/kpi-strip"
import { ChannelComparison } from "@/components/dashboard/channel-comparison"
import { PipelineFunnelCard, CohortProgressCard } from "@/components/dashboard/pipeline-section"
import { UncontactedPanel, InProgressPanel, PlacedPanel } from "@/components/dashboard/candidate-panels"
import { CampaignsSection } from "@/components/dashboard/campaigns-section"
import { GpRoiSection } from "@/components/dashboard/gp-roi-section"
import { SECTORS, STAGES, ENA_STAGES, type SectorKey } from "@/lib/constants"
import { getSectorAdData } from "@/lib/sector-data"

export function SectorPage({ sector }: { sector: SectorKey }) {
  const sectorMeta = SECTORS[sector]
  const stages = sector === "ena" ? ENA_STAGES : STAGES
  const data = getSectorAdData(sector)

  return (
    <div className="flex flex-1 flex-col">
      <SubNav />
      <PageContainer>
        <div className="flex flex-col gap-10">
          <PageHeader
            title={sectorMeta.name}
            description={`Meta & Seek ad performance across ${sectorMeta.subs.length} division${sectorMeta.subs.length > 1 ? "s" : ""}`}
          />

          <section id="kpis" className="flex flex-col gap-4 scroll-mt-[100px]">
            <KpiStrip data={data} color={sectorMeta.color} />
          </section>

          <section id="meta-vs-seek" className="flex flex-col gap-4 scroll-mt-[100px]">
            <h2 className="font-heading text-base font-semibold">Meta vs Seek</h2>
            <ChannelComparison meta={data.channels.meta} seek={data.channels.seek} />
          </section>

          <section id="pipeline" className="flex flex-col gap-4 scroll-mt-[100px]">
            <h2 className="font-heading text-base font-semibold">Pipeline</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <PipelineFunnelCard funnelByChannel={data.funnelByChannel} />
              <CohortProgressCard cohorts={data.cohorts} color={sectorMeta.color} />
            </div>
          </section>

          <section id="candidates" className="flex flex-col gap-4 scroll-mt-[100px]">
            <h2 className="font-heading text-base font-semibold">Candidates</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <UncontactedPanel candidates={data.uncontacted} total={data.contactRate.uncontactedCount} />
              <InProgressPanel candidates={data.inProgress} stages={stages} accent={sectorMeta.color} />
              <PlacedPanel candidates={data.placed} />
            </div>
          </section>

          <section id="campaigns" className="flex flex-col gap-4 scroll-mt-[100px]">
            <h2 className="font-heading text-base font-semibold">Campaigns</h2>
            <CampaignsSection campaigns={data.campaigns} color={sectorMeta.color} sector={sector} />
          </section>

          <section id="gp-roi" className="flex flex-col gap-4 scroll-mt-[100px]">
            <h2 className="font-heading text-base font-semibold">GP & ROI</h2>
            <GpRoiSection data={data} color={sectorMeta.color} />
          </section>
        </div>
      </PageContainer>
    </div>
  )
}
