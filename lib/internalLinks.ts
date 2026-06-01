import type { TaxRegion } from './types'
import { REGIONS, REGION_SHORT_LABELS } from './types'

export interface RelatedSalary {
  amount: number
  label: string
  url: string
  region: TaxRegion
}

export interface IntentLink {
  label: string
  url: string
  intent: 'related' | 'cross-region' | 'comparison' | 'info'
}

const COMMON_SALARIES_UK = [
  15000, 18000, 20000, 22000, 25000, 27000, 30000, 32000, 35000, 37000,
  40000, 42000, 45000, 47000, 50000, 55000, 60000, 65000, 70000, 75000,
  80000, 85000, 90000, 95000, 100000, 110000, 120000, 125000, 130000, 150000,
]

const COMMON_SALARIES_SCOTLAND = [
  15000, 18000, 20000, 22000, 25000, 27000, 30000, 32000, 35000, 37000,
  40000, 42000, 45000, 47000, 50000, 55000, 60000, 65000, 70000, 75000,
  80000, 85000, 90000, 95000, 100000, 110000, 125000, 150000,
]

const STEPS = [5000, 10000, 15000]

export function getRelatedSalaries(salary: number, region: TaxRegion): RelatedSalary[] {
  const sourceList = region === REGIONS.SCOTLAND ? COMMON_SALARIES_SCOTLAND : COMMON_SALARIES_UK
  const related: RelatedSalary[] = []

  for (const step of STEPS) {
    const lower = salary - step
    const higher = salary + step

    if (lower > 0 && sourceList.includes(lower)) {
      related.push({
        amount: lower,
        label: `£${lower.toLocaleString('en-GB')}`,
        url: `/salary/${lower}-${region}`,
        region,
      })
    }

    if (sourceList.includes(higher) && !related.some((r) => r.amount === higher)) {
      related.push({
        amount: higher,
        label: `£${higher.toLocaleString('en-GB')}`,
        url: `/salary/${higher}-${region}`,
        region,
      })
    }
  }

  return related.slice(0, 5)
}

export function getCrossRegionSalaryUrl(salary: number, fromRegion: TaxRegion): string {
  const targetRegion = fromRegion === REGIONS.UK ? REGIONS.SCOTLAND : REGIONS.UK
  return `/salary/${salary}-${targetRegion}`
}

export function getCrossRegionLabel(salary: number, fromRegion: TaxRegion): string {
  const targetRegion = fromRegion === REGIONS.UK ? REGIONS.SCOTLAND : REGIONS.UK
  return `See what you'd take home in ${REGION_SHORT_LABELS[targetRegion]}`
}

export function getCompareUrl(): string {
  return '/scotland-vs-uk-salary-tax-difference'
}

export function getHourlyUrl(salary: number, region: TaxRegion): string {
  const hourly = Math.round(salary / (260 * 8) * 100) / 100
  return `/hourly/${hourly}-${region}`
}

export function getEvaluationUrl(salary: number, region: TaxRegion): string {
  return `/how-much-is-${salary}-after-tax-${region}`
}

export function getIntentLinks(slug: string): IntentLink[] {
  const links: IntentLink[] = []

  const salaryMatch = slug.match(/^(\d{3,7})-(uk|scotland)$/)
  if (salaryMatch) {
    const amount = parseInt(salaryMatch[1])
    const region = salaryMatch[2] as TaxRegion

    links.push({
      label: getCrossRegionLabel(amount, region),
      url: getCrossRegionSalaryUrl(amount, region),
      intent: 'cross-region',
    })

    links.push({
      label: 'Compare UK vs Scotland tax',
      url: getCompareUrl(),
      intent: 'comparison',
    })

    if (amount <= 150000) {
      links.push({
        label: `What is £${amount.toLocaleString('en-GB')} as an hourly rate?`,
        url: getHourlyUrl(amount, region),
        intent: 'related',
      })
    }

    links.push({
      label: `How much is £${amount.toLocaleString('en-GB')} after tax?`,
      url: getEvaluationUrl(amount, region),
      intent: 'info',
    })
  }

  return links
}

export function getBlogLinks(): IntentLink[] {
  return [
    { label: 'How Income Tax Works in the UK', url: '/blog/tax/how-income-tax-works-uk', intent: 'info' },
    { label: 'Scotland vs UK Tax: What\'s the Difference?', url: '/blog/tax/scotland-vs-uk-tax-differences', intent: 'info' },
    { label: 'NI Rate Cuts 2025/2026', url: '/blog/tax/national-insurance-rate-cuts-2025-2026', intent: 'info' },
    { label: 'Scottish Income Tax 2025/2026', url: '/blog/tax/scottish-income-tax-2025-2026', intent: 'info' },
    { label: 'Graduate Salaries UK 2025', url: '/blog/salary/graduate-salaries-uk-2025', intent: 'info' },
    { label: 'UK Tax 2024/25 vs 2025/26', url: '/blog/comparison/uk-tax-2024-25-vs-2025-26', intent: 'info' },
  ]
}
