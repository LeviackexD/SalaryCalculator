export interface TaxBand {
  name: string
  from: number
  to: number
  rate: number
}

export interface TaxYearData {
  region: TaxRegion
  taxYear: TaxYear
  personalAllowance: number
  personalAllowanceTaperThreshold: number
  personalAllowanceTaperRate: number
  bands: TaxBand[]
}

export interface NiYearData {
  region: TaxRegion
  taxYear: TaxYear
  primaryThreshold: number
  upperEarningsLimit: number
  bands: TaxBand[]
}

export interface TaxResult {
  name: string
  amount: number
  percentage: number
}

export interface TakeHomePayResult {
  grossAnnual: number
  grossMonthly: number
  grossWeekly: number
  grossDaily: number
  grossHourly: number
  incomeTax: TaxResult
  nationalInsurance: TaxResult
  totalDeductions: number
  netAnnual: number
  netMonthly: number
  netWeekly: number
  netDaily: number
  netHourly: number
  effectiveTaxRate: number
  region: TaxRegion
  taxYear: TaxYear
}

export const REGIONS = { UK: 'uk', SCOTLAND: 'scotland' } as const

export type TaxRegion = (typeof REGIONS)[keyof typeof REGIONS]

export const TAX_YEARS = ['2024-25', '2025-26'] as const

export type TaxYear = (typeof TAX_YEARS)[number]

export const REGION_LABELS: Record<TaxRegion, string> = {
  uk: 'United Kingdom (England, Wales, Northern Ireland)',
  scotland: 'Scotland',
}

export const REGION_SHORT_LABELS: Record<TaxRegion, string> = {
  uk: 'UK',
  scotland: 'Scotland',
}

export const DEFAULT_REGION: TaxRegion = 'uk'
export const DEFAULT_TAX_YEAR: TaxYear = '2024-25'
