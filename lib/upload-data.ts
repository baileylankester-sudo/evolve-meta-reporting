export type FileSlotDefinition = {
  id: string
  label: string
  acceptDisplay: string
  acceptAttr: string
  extensions: string[]
}

export const REQUIRED_FILE_SLOTS: FileSlotDefinition[] = [
  {
    id: "meta-healthcare",
    label: "Meta Healthcare",
    acceptDisplay: ".csv",
    acceptAttr: ".csv",
    extensions: ["csv"],
  },
  {
    id: "meta-mining",
    label: "Meta Mining FM",
    acceptDisplay: ".csv",
    acceptAttr: ".csv",
    extensions: ["csv"],
  },
  {
    id: "meta-ena",
    label: "Meta ENA",
    acceptDisplay: ".csv",
    acceptAttr: ".csv",
    extensions: ["csv"],
  },
  {
    id: "meta-dnc",
    label: "Meta D&C",
    acceptDisplay: ".csv",
    acceptAttr: ".csv",
    extensions: ["csv"],
  },
  {
    id: "bullhorn",
    label: "Bullhorn Candidates",
    acceptDisplay: ".xlsx, .csv",
    acceptAttr: ".xlsx,.csv",
    extensions: ["xlsx", "csv"],
  },
  {
    id: "gp-report",
    label: "GP Report",
    acceptDisplay: ".xlsx, .csv",
    acceptAttr: ".xlsx,.csv",
    extensions: ["xlsx", "csv"],
  },
]

export const LEAD_LIST_HEADER_KEYWORDS = ["job title", "phone", "email", "source", "actions"]

const META_SLOT_STATS: Record<string, { campaigns: number; leads: number }> = {
  "meta-healthcare": { campaigns: 4, leads: 52 },
  "meta-mining": { campaigns: 3, leads: 34 },
  "meta-ena": { campaigns: 5, leads: 61 },
  "meta-dnc": { campaigns: 2, leads: 28 },
}

export function getProcessingSteps(
  uploadedSlotIds: string[],
  dynamicFiles: { id: string; fileName: string }[]
): string[] {
  const steps: string[] = []

  for (const slot of REQUIRED_FILE_SLOTS) {
    if (!uploadedSlotIds.includes(slot.id)) continue
    if (slot.id in META_SLOT_STATS) {
      const stats = META_SLOT_STATS[slot.id]
      steps.push(`${slot.label} — ${stats.campaigns} campaigns, ${stats.leads} leads`)
    } else if (slot.id === "bullhorn") {
      steps.push("Bullhorn matched — 155 candidates")
    } else if (slot.id === "gp-report") {
      steps.push("GP report — 19 placements found")
    }
  }

  for (const file of dynamicFiles) {
    steps.push(`${file.fileName} — lead list matched`)
  }

  return steps
}

export type PreviousUpload = {
  id: string
  date: string
  filesUploaded: number
  candidates: number
  campaigns: number
  uploadedBy: string
}

export const PREVIOUS_UPLOADS: PreviousUpload[] = [
  {
    id: "upload-1",
    date: "Sep 28, 2025",
    filesUploaded: 6,
    candidates: 612,
    campaigns: 32,
    uploadedBy: "Bailey Chen",
  },
  {
    id: "upload-2",
    date: "Aug 31, 2025",
    filesUploaded: 6,
    candidates: 588,
    campaigns: 30,
    uploadedBy: "Emily Osei",
  },
  {
    id: "upload-3",
    date: "Aug 3, 2025",
    filesUploaded: 5,
    candidates: 561,
    campaigns: 29,
    uploadedBy: "Bailey Chen",
  },
]
