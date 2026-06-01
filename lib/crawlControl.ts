export type Tier = 1 | 2 | 3

export interface SalaryEntry {
  amount: number
  region: 'uk' | 'scotland'
  slug: string
  tier: Tier
}

const TIER_1_UK = [
  15000, 18000, 20000, 22000, 25000, 27000, 30000, 32000, 35000, 37000,
  40000, 42000, 45000, 47000, 50000, 55000, 60000, 65000, 70000, 75000,
  80000, 85000, 90000, 95000, 100000, 110000, 120000, 125000, 130000, 150000,
]

const TIER_1_SCOTLAND = [
  15000, 20000, 22000, 25000, 27000, 30000, 32000, 35000, 37000,
  40000, 42000, 45000, 47000, 50000, 55000, 60000, 65000, 70000,
  75000, 80000, 85000, 90000, 100000, 110000, 125000, 150000,
]

function generateTier2(baseSalaries: number[]): number[] {
  const set = new Set(baseSalaries)
  for (const s of baseSalaries) {
    const diff = Math.round(s * 0.15)
    const step = Math.max(1000, Math.round(diff / 4000) * 1000)
    for (let i = step; i < diff; i += step) {
      if (s + i <= 150000) set.add(s + i)
    }
  }
  return Array.from(set).filter((s) => s >= 10000 && s <= 150000).sort((a, b) => a - b)
}

function generateTier3(): number[] {
  const set = new Set<number>()
  for (let i = 10000; i <= 30000; i += 250) set.add(i)
  for (let i = 30000; i <= 60000; i += 500) set.add(i)
  for (let i = 60000; i <= 100000; i += 1000) set.add(i)
  for (let i = 100000; i <= 125000; i += 2000) set.add(i)
  for (let i = 125000; i <= 150000; i += 5000) set.add(i)
  return Array.from(set).sort((a, b) => a - b)
}

const tier2Uk = generateTier2(TIER_1_UK)
const tier3All = generateTier3()

export function getPageTier(slug: string): Tier {
  const match = slug.match(/^(\d{3,7})-(uk|scotland)$/)
  if (!match) return 3
  const amount = parseInt(match[1])
  const region = match[2]

  if (region === 'uk' && TIER_1_UK.includes(amount)) return 1
  if (region === 'scotland' && TIER_1_SCOTLAND.includes(amount)) return 1

  if (tier2Uk.includes(amount) && region === 'uk') return 2

  return 3
}

function makeEntry(amount: number, region: 'uk' | 'scotland', tier: Tier): SalaryEntry {
  return { amount, region, slug: `${amount}-${region}`, tier }
}

export function getSalariesByTier(tier: Tier): SalaryEntry[] {
  const all = getAllSalaries()
  return all.filter((s) => s.tier === tier)
}

export function getTier1Slugs(): string[] {
  return [
    ...TIER_1_UK.map((s) => `${s}-uk`),
    ...TIER_1_SCOTLAND.map((s) => `${s}-scotland`),
  ]
}

export function getAllTier1And2Slugs(): string[] {
  const slugs: string[] = []
  for (const s of tier2Uk) slugs.push(`${s}-uk`)
  for (const s of TIER_1_SCOTLAND) slugs.push(`${s}-scotland`)
  const t3Uk = getUkTier3Salaries()
  for (const s of t3Uk) slugs.push(`${s}-uk`)
  return [...new Set(slugs)]
}

export function getUkTier3Salaries(): number[] {
  const tier2Set = new Set(tier2Uk)
  const tier1Set = new Set([...TIER_1_UK, ...TIER_1_SCOTLAND])
  return tier3All.filter((s) => !tier2Set.has(s) && !tier1Set.has(s))
}

export function getAllSalaries(): SalaryEntry[] {
  const entries: SalaryEntry[] = []

  for (const amount of TIER_1_UK) entries.push(makeEntry(amount, 'uk', 1))
  for (const amount of TIER_1_SCOTLAND) entries.push(makeEntry(amount, 'scotland', 1))

  for (const amount of tier2Uk) {
    if (!TIER_1_UK.includes(amount)) entries.push(makeEntry(amount, 'uk', 2))
  }

  for (const amount of tier3All) {
    if (!tier2Uk.includes(amount) && !TIER_1_UK.includes(amount)) {
      entries.push(makeEntry(amount, 'uk', 3))
    }
  }

  return entries
}

export function getIndexingStatus(slug: string): { index: boolean; priority: number; tier: Tier } {
  const tier = getPageTier(slug)
  const index = tier !== 3
  const priority = tier === 1 ? 0.9 : tier === 2 ? 0.6 : 0.3
  return { index, priority, tier }
}

export function getNoindexMeta(slug: string): Record<string, boolean> | null {
  const { index } = getIndexingStatus(slug)
  if (index) return null
  return { index: false, follow: true }
}
