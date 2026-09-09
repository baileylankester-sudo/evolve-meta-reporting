export const SECTORS = {
  healthcare: {
    name: 'Healthcare',
    color: '#E8631A',
    subs: ['R&R', 'Aged Care', 'Allied Health'],
  },
  mining: { name: 'Mining FM', color: '#059669', subs: ['Mining FM'] },
  ena: { name: 'ENA', color: '#2563EB', subs: ['Scheduling'] },
  dnc: { name: 'Design & Construct', color: '#7C3AED', subs: ['D&C'] },
} as const

export type SectorKey = keyof typeof SECTORS

export const STAGES = [
  'Contacted',
  'Pre-Screen',
  'Compliance',
  'Submit / Offer',
  'Placed',
] as const

export const ENA_STAGES = [
  'Contacted',
  'Compliance',
  'Shift Offered',
  'Shift Filled',
  'Active on Books',
] as const

export const TRAFFIC_LIGHT = {
  strong: { min: 60, color: '#57DB7B', label: 'Strong' },
  watch: { min: 35, color: '#FDC06D', label: 'Watch' },
  action: { min: 0, color: '#ED3E3E', label: 'Action needed' },
} as const

export function getTrafficLight(score: number): (typeof TRAFFIC_LIGHT)[keyof typeof TRAFFIC_LIGHT] {
  if (score >= TRAFFIC_LIGHT.strong.min) return TRAFFIC_LIGHT.strong
  if (score >= TRAFFIC_LIGHT.watch.min) return TRAFFIC_LIGHT.watch
  return TRAFFIC_LIGHT.action
}
