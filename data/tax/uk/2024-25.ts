import type { TaxYearData } from '@/lib/types'

export const ukTaxBands2024_25: TaxYearData = {
  region: 'uk',
  taxYear: '2024-25',
  personalAllowance: 12570,
  personalAllowanceTaperThreshold: 100000,
  personalAllowanceTaperRate: 0.5,
  bands: [
    { name: 'Personal Allowance', from: 0, to: 12570, rate: 0 },
    { name: 'Basic Rate', from: 12570, to: 50270, rate: 0.2 },
    { name: 'Higher Rate', from: 50270, to: 125140, rate: 0.4 },
    { name: 'Additional Rate', from: 125140, to: Infinity, rate: 0.45 },
  ],
}

export const ukTaxBands2025_26: TaxYearData = {
  region: 'uk',
  taxYear: '2025-26',
  personalAllowance: 12570,
  personalAllowanceTaperThreshold: 100000,
  personalAllowanceTaperRate: 0.5,
  bands: [
    { name: 'Personal Allowance', from: 0, to: 12570, rate: 0 },
    { name: 'Basic Rate', from: 12570, to: 50270, rate: 0.2 },
    { name: 'Higher Rate', from: 50270, to: 125140, rate: 0.4 },
    { name: 'Additional Rate', from: 125140, to: Infinity, rate: 0.45 },
  ],
}
