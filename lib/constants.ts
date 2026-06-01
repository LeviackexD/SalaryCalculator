import { REGIONS, TAX_YEARS, REGION_LABELS, REGION_SHORT_LABELS } from './types'
import type { TaxRegion, TaxYear } from './types'

export const SITE_NAME = 'UK Salary Calculator'
export const SITE_DESCRIPTION = 'Calculate your take-home pay after tax and National Insurance for UK and Scotland. Free salary calculator with detailed tax breakdown.'
export const SITE_URL = 'https://www.uksalarycalculator.com'
export const SITE_TWITTER_HANDLE = '@uksalarycalc'

export const WORK_HOURS_PER_WEEK = 40
export const WORK_WEEKS_PER_YEAR = 52
export const WORK_DAYS_PER_YEAR = 260
export const WORK_HOURS_PER_YEAR = WORK_HOURS_PER_WEEK * WORK_WEEKS_PER_YEAR

export const HOURS_PER_DAY = 8
export const DAYS_PER_WEEK = 5

export const TAX_YEAR_LABELS: Record<TaxYear, string> = {
  '2024-25': '2024/2025',
  '2025-26': '2025/2026',
}

export { REGIONS, TAX_YEARS, REGION_LABELS, REGION_SHORT_LABELS }
export type { TaxRegion, TaxYear }
