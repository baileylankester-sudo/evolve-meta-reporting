import { SECTORS, STAGES, ENA_STAGES, type SectorKey } from "./constants"

// Deterministic pseudo-random so the dashboard renders consistent demo data.
function seededRandom(seed: number) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

const FIRST_NAMES = [
  "Olivia", "Jack", "Amelia", "Noah", "Charlotte", "Liam", "Mia", "Ethan",
  "Isla", "Lucas", "Grace", "Mason", "Ava", "Oliver", "Zoe", "Henry",
  "Ruby", "William", "Chloe", "James", "Ella", "Leo", "Sophie", "Max",
]
const LAST_NAMES = [
  "Nguyen", "Smith", "Patel", "Brown", "Taylor", "Wilson", "Chen", "Kelly",
  "Walker", "Singh", "Murphy", "Ryan", "Kim", "Anderson", "Clarke", "Byrne",
]
const CONSULTANTS = ["Sarah Chen", "James Wilson", "Priya Patel", "Tom Anderson", "Maria Garcia", "Liam O'Brien"]
const JOB_TITLES = [
  "Registered Nurse", "Support Worker", "Care Coordinator", "Personal Care Assistant",
  "Project Engineer", "Site Supervisor", "Electrician", "Scheduler",
  "Compliance Officer", "Program Manager", "Draftsperson", "Quantity Surveyor",
]

const LEAD_NOTE_POOL: { weight: number; notes: string[] }[] = [
  { weight: 25, notes: [""] },
  {
    weight: 20,
    notes: [
      "LVM, will try again tomorrow",
      "Left voicemail, no callback",
      "Won't answer calls this week",
      "Tried twice, straight to voicemail",
    ],
  },
  {
    weight: 20,
    notes: [
      "Emailed compliance docs",
      "Call back requested for Friday",
      "Added to BH, awaiting response",
      "Spoke briefly, will call back Monday",
    ],
  },
  {
    weight: 15,
    notes: [
      "Prescreened, awaiting compliance",
      "Referoo checks sent",
      "Compliant, ready for submission",
      "Prescreened - strong candidate",
    ],
  },
  {
    weight: 10,
    notes: [
      "Not suitable for this role",
      "Not looking to relocate",
      "Only interested in day shifts",
      "Not suitable - lacks required ticket",
    ],
  },
  {
    weight: 10,
    notes: ["Placed, starts next Monday", "Started on site this week", "Placed - contract signed"],
  },
]

function noteFromSeed(rand: () => number) {
  const totalWeight = LEAD_NOTE_POOL.reduce((sum, g) => sum + g.weight, 0)
  let roll = rand() * totalWeight
  for (const group of LEAD_NOTE_POOL) {
    if (roll < group.weight) return group.notes[Math.floor(rand() * group.notes.length)]
    roll -= group.weight
  }
  return ""
}

function nameFromSeed(rand: () => number) {
  const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]
  const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]
  return `${first} ${last}`
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export type ChannelMetrics = {
  spend: number
  leads: number
  cpl: number
  qualRate: number
  cplQualified: number
  placements: number
  costPerPlacement: number
  roas: number
}

export type CandidateRef = {
  id: string
  name: string
  division: string
  consultant: string
  days: number
}

export type InProgressCandidate = CandidateRef & {
  stage: string
  velocity: "fast" | "onTrack" | "slow"
}

export type PlacedCandidate = CandidateRef & {
  gp: number
  daysToPlace: number
}

export type Cohort = {
  month: string
  leadCount: number
  avgDays: number
  status: "Early" | "Active" | "Mature"
  stageProgress: { stage: string; pct: number }[]
}

export type CampaignLead = {
  name: string
  jobTitle: string
  consultant: string
  notes: string
  days: number
}

export type Campaign = {
  id: string
  name: string
  division: string
  dateRange: string
  consultant: string
  spend: number
  impressions: number
  reach: number
  leads: number
  leadsMoM: number
  cpl: number
  status: "Active" | "Paused" | "Completed"
  leadsList: CampaignLead[]
}

export type SectorAdData = {
  kpis: {
    totalSpend: number
    spendDeltaPct: number
    leadsIn: number
    leadsDeltaPct: number
    costPerLead: number
    cplDeltaPct: number
    costPerPlacement: number
    cppDeltaPct: number
  }
  contactRate: {
    rate: number
    totalLeads: number
    contactedCount: number
    uncontactedCount: number
    avgDaysToContact: number
    qualifiedCount: number
  }
  channels: { meta: ChannelMetrics; seek: ChannelMetrics }
  funnelByChannel: { stage: string; meta: number; seek: number }[]
  cohorts: Cohort[]
  uncontacted: CandidateRef[]
  inProgress: InProgressCandidate[]
  placed: PlacedCandidate[]
  campaigns: Campaign[]
  gp: { confirmed: number; pipeline: number; potential: number; placementsCount: number }
}

let seedCounter = 3

export function getSectorAdData(key: SectorKey): SectorAdData {
  seedCounter += 11
  const rand = seededRandom(seedCounter * 17 + key.length * 5)
  const sector = SECTORS[key]
  const divisions = sector.subs
  const stages = key === "ena" ? ENA_STAGES : STAGES

  const totalSpend = Math.round(15000 + rand() * 30000)
  const leadsIn = Math.round(160 + rand() * 300)
  const costPerLead = Math.round((totalSpend / leadsIn) * 100) / 100
  const placementsTotal = Math.round(leadsIn * (0.06 + rand() * 0.08))
  const costPerPlacement = Math.round(totalSpend / Math.max(1, placementsTotal))

  const spendDeltaPct = Math.round((rand() - 0.4) * 30)
  const leadsDeltaPct = Math.round((rand() - 0.4) * 40)
  const cplDeltaPct = Math.round((rand() - 0.6) * 20)
  const cppDeltaPct = Math.round((rand() - 0.6) * 20)

  const contactedCount = Math.round(leadsIn * (0.55 + rand() * 0.3))
  const uncontactedCount = leadsIn - contactedCount
  const rate = Math.round((contactedCount / leadsIn) * 100)
  const avgDaysToContact = Math.round(1 + rand() * 4)
  const qualifiedCount = Math.round(contactedCount * (0.35 + rand() * 0.3))

  // Channel comparison — Meta wins on volume, Seek wins on quality (weighted by rand for variety)
  const metaSpend = Math.round(totalSpend * (0.55 + rand() * 0.15))
  const seekSpend = totalSpend - metaSpend
  const metaLeads = Math.round(leadsIn * (0.62 + rand() * 0.12))
  const seekLeads = leadsIn - metaLeads
  const metaQualRate = Math.round(28 + rand() * 15)
  const seekQualRate = Math.round(metaQualRate + 8 + rand() * 12)
  const metaPlacements = Math.round(placementsTotal * (0.5 + rand() * 0.15))
  const seekPlacements = placementsTotal - metaPlacements

  function buildChannel(spend: number, leads: number, qualRate: number, placements: number): ChannelMetrics {
    const cpl = Math.round((spend / Math.max(1, leads)) * 100) / 100
    const qualified = Math.round(leads * (qualRate / 100))
    const cplQualified = Math.round((spend / Math.max(1, qualified)) * 100) / 100
    const cpp = Math.round(spend / Math.max(1, placements))
    const revenue = placements * (4200 + rand() * 2600)
    const roas = Math.round((revenue / spend) * 10) / 10
    return { spend, leads, cpl, qualRate, cplQualified, placements: placements, costPerPlacement: cpp, roas }
  }

  const meta = buildChannel(metaSpend, metaLeads, metaQualRate, Math.max(1, metaPlacements))
  const seek = buildChannel(seekSpend, seekLeads, seekQualRate, Math.max(1, seekPlacements))

  const funnelByChannel = stages.map((stage, i) => {
    const metaDrop = 1 - (0.28 + rand() * 0.16) * (i === 0 ? 0 : 1)
    const seekDrop = 1 - (0.22 + rand() * 0.14) * (i === 0 ? 0 : 1)
    const metaBase = i === 0 ? metaLeads : undefined
    const seekBase = i === 0 ? seekLeads : undefined
    return { stage, metaDrop, seekDrop, metaBase, seekBase }
  })
  let metaRunning = metaLeads
  let seekRunning = seekLeads
  const funnel = funnelByChannel.map((f, i) => {
    if (i > 0) {
      metaRunning = Math.max(1, Math.round(metaRunning * f.metaDrop))
      seekRunning = Math.max(1, Math.round(seekRunning * f.seekDrop))
    }
    return { stage: f.stage, meta: metaRunning, seek: seekRunning }
  })

  const cohortLabels = ["Jun", "Jul", "Aug", "Sep"]
  const cohorts: Cohort[] = cohortLabels.map((month, i) => {
    const leadCount = Math.round(30 + rand() * 60)
    const status: Cohort["status"] = i === cohortLabels.length - 1 ? "Early" : i === cohortLabels.length - 2 ? "Active" : "Mature"
    const maturity = (i + 1) / cohortLabels.length
    return {
      month,
      leadCount,
      avgDays: Math.round(8 + rand() * 20),
      status,
      stageProgress: [
        { stage: "Contacted", pct: Math.round(Math.min(100, 70 + rand() * 25) * maturity) },
        { stage: "Qualified", pct: Math.round(Math.min(100, 45 + rand() * 25) * maturity) },
        { stage: "Placed", pct: Math.round(Math.min(100, 15 + rand() * 15) * maturity) },
      ],
    }
  })

  function buildCandidateRef(): CandidateRef {
    return {
      id: `${key}-${Math.round(rand() * 1e9)}`,
      name: nameFromSeed(rand),
      division: divisions[Math.floor(rand() * divisions.length)],
      consultant: CONSULTANTS[Math.floor(rand() * CONSULTANTS.length)],
      days: 0,
    }
  }

  const uncontacted: CandidateRef[] = Array.from({ length: Math.min(9, uncontactedCount) }, () => ({
    ...buildCandidateRef(),
    days: Math.round(1 + rand() * 11),
  }))

  const midStages = stages.slice(1, -1)
  const inProgress: InProgressCandidate[] = Array.from({ length: 9 }, () => {
    const stage = midStages[Math.floor(rand() * midStages.length)]
    const velocity: InProgressCandidate["velocity"] = rand() < 0.4 ? "fast" : rand() < 0.8 ? "onTrack" : "slow"
    return { ...buildCandidateRef(), stage, days: Math.round(1 + rand() * 14), velocity }
  })

  const placed: PlacedCandidate[] = Array.from({ length: Math.min(7, placementsTotal) }, () => ({
    ...buildCandidateRef(),
    gp: Math.round(3800 + rand() * 5200),
    daysToPlace: Math.round(10 + rand() * 26),
  }))

  const campaignStatuses: Campaign["status"][] = ["Active", "Active", "Active", "Paused", "Completed", "Active", "Paused", "Completed"]
  const campaigns: Campaign[] = Array.from({ length: 8 }, (_, i) => {
    const division = divisions[i % divisions.length]
    const cSpend = Math.round(1200 + rand() * 4200)
    const cLeads = Math.round(12 + rand() * 45)
    const cpm = 18 + rand() * 12
    const impressions = Math.round((cSpend / cpm) * 1000)
    const reach = Math.round(impressions * (0.42 + rand() * 0.18))
    const startMonth = ["Jun", "Jul", "Aug", "Sep"][Math.floor(rand() * 4)]
    const leadsList: CampaignLead[] = Array.from({ length: Math.min(14, cLeads) }, () => ({
      name: nameFromSeed(rand),
      jobTitle: JOB_TITLES[Math.floor(rand() * JOB_TITLES.length)],
      consultant: CONSULTANTS[Math.floor(rand() * CONSULTANTS.length)],
      notes: noteFromSeed(rand),
      days: Math.round(rand() * 13),
    }))
    return {
      id: `${key}-campaign-${i}`,
      name: `${division} · ${["Awareness", "Retargeting", "Lookalike", "Talent pool"][i % 4]}`,
      division,
      dateRange: `${startMonth} 1 – ${startMonth} 30`,
      consultant: CONSULTANTS[i % CONSULTANTS.length],
      spend: cSpend,
      impressions,
      reach,
      leads: cLeads,
      leadsMoM: Math.round((rand() - 0.4) * 50),
      cpl: Math.round((cSpend / Math.max(1, cLeads)) * 100) / 100,
      status: campaignStatuses[i % campaignStatuses.length],
      leadsList,
    }
  })

  const confirmed = placed.reduce((sum, p) => sum + p.gp, 0)
  const pipeline = Math.round(confirmed * (0.35 + rand() * 0.25))
  const potential = Math.round(confirmed * (0.12 + rand() * 0.15))

  return {
    kpis: {
      totalSpend,
      spendDeltaPct,
      leadsIn,
      leadsDeltaPct,
      costPerLead,
      cplDeltaPct,
      costPerPlacement,
      cppDeltaPct,
    },
    contactRate: { rate, totalLeads: leadsIn, contactedCount, uncontactedCount, avgDaysToContact, qualifiedCount },
    channels: { meta, seek },
    funnelByChannel: funnel,
    cohorts,
    uncontacted,
    inProgress,
    placed,
    campaigns,
    gp: { confirmed, pipeline, potential, placementsCount: placed.length },
  }
}

export type OverviewSectorHealth = {
  key: SectorKey
  name: string
  color: string
  divisions: readonly string[]
  leadsIn: number
  spend: number
  contactRate: number
  uncontactedCount: number
}

export type OverviewUncontacted = CandidateRef & { sector: SectorKey }

export type OverviewData = {
  dateRange: string
  totalSpend: number
  spendMoM: number
  totalLeadsIn: number
  leadsMoM: number
  totalContacted: number
  totalUncontacted: number
  contactRate: number
  sectors: OverviewSectorHealth[]
  pipeline: { stage: string; count: number }[]
  topUncontacted: OverviewUncontacted[]
  gp: {
    confirmed: number
    metaRoas: number
    seekRoas: number
    costPerPlacement: number
    placementsCount: number
  }
}

const OVERVIEW_SECTOR_KEYS: SectorKey[] = ["healthcare", "mining", "ena", "dnc"]

export function getOverviewData(): OverviewData {
  const perSector = OVERVIEW_SECTOR_KEYS.map((key) => ({ key, data: getSectorAdData(key) }))

  const totalSpend = perSector.reduce((sum, s) => sum + s.data.kpis.totalSpend, 0)
  const totalLeadsIn = perSector.reduce((sum, s) => sum + s.data.kpis.leadsIn, 0)
  const totalContacted = perSector.reduce((sum, s) => sum + s.data.contactRate.contactedCount, 0)
  const totalUncontacted = perSector.reduce((sum, s) => sum + s.data.contactRate.uncontactedCount, 0)
  const contactRate = Math.round((totalContacted / totalLeadsIn) * 100)

  const spendMoM = Math.round(
    perSector.reduce((sum, s) => sum + s.data.kpis.spendDeltaPct * s.data.kpis.totalSpend, 0) / totalSpend
  )
  const leadsMoM = Math.round(
    perSector.reduce((sum, s) => sum + s.data.kpis.leadsDeltaPct * s.data.kpis.leadsIn, 0) / totalLeadsIn
  )

  const sectors: OverviewSectorHealth[] = perSector.map(({ key, data }) => ({
    key,
    name: SECTORS[key].name,
    color: SECTORS[key].color,
    divisions: SECTORS[key].subs,
    leadsIn: data.kpis.leadsIn,
    spend: data.kpis.totalSpend,
    contactRate: data.contactRate.rate,
    uncontactedCount: data.contactRate.uncontactedCount,
  }))

  const stageAt = (index: number) =>
    perSector.reduce((sum, s) => {
      const stage = s.data.funnelByChannel[index]
      return sum + (stage ? stage.meta + stage.seek : 0)
    }, 0)

  const pipeline = [
    { stage: "Leads In", count: totalLeadsIn },
    { stage: "Contacted", count: totalContacted },
    { stage: "In Progress", count: stageAt(2) },
    { stage: "Submit / Offer", count: stageAt(3) },
    { stage: "Placed", count: stageAt(4) },
  ]

  const topUncontacted: OverviewUncontacted[] = perSector
    .flatMap(({ key, data }) => data.uncontacted.map((c) => ({ ...c, sector: key })))
    .sort((a, b) => b.days - a.days)
    .slice(0, 8)

  const placementsCount = perSector.reduce((sum, s) => sum + s.data.gp.placementsCount, 0)
  const confirmed = perSector.reduce((sum, s) => sum + s.data.gp.confirmed, 0)
  const metaSpendTotal = perSector.reduce((sum, s) => sum + s.data.channels.meta.spend, 0)
  const seekSpendTotal = perSector.reduce((sum, s) => sum + s.data.channels.seek.spend, 0)
  const metaRoas =
    Math.round(
      (perSector.reduce((sum, s) => sum + s.data.channels.meta.roas * s.data.channels.meta.spend, 0) /
        metaSpendTotal) *
        10
    ) / 10
  const seekRoas =
    Math.round(
      (perSector.reduce((sum, s) => sum + s.data.channels.seek.roas * s.data.channels.seek.spend, 0) /
        seekSpendTotal) *
        10
    ) / 10

  return {
    dateRange: "Jun 1 – Sep 30, 2025",
    totalSpend,
    spendMoM,
    totalLeadsIn,
    leadsMoM,
    totalContacted,
    totalUncontacted,
    contactRate,
    sectors,
    pipeline,
    topUncontacted,
    gp: {
      confirmed,
      metaRoas,
      seekRoas,
      costPerPlacement: Math.round(totalSpend / Math.max(1, placementsCount)),
      placementsCount,
    },
  }
}

export { initials, CONSULTANTS }
