import type { TaxYearData } from '@/lib/types'

export const scotlandTaxBands2024_25: TaxYearData = {
  region: 'scotland',
  taxYear: '2024-25',
  personalAllowance: 12570,
  personalAllowanceTaperThreshold: 100000,
  personalAllowanceTaperRate: 0.5,
  bands: [
    { name: 'Personal Allowance', from: 0, to: 12570, rate: 0 },
    { name: 'Starter Rate', from: 12570, to: 14876, rate: 0.19 },
    { name: 'Basic Rate', from: 14876, to: 26561, rate: 0.2 },
    { name: 'Intermediate Rate', from: 26561, to: 43662, rate: 0.21 },
    { name: 'Higher Rate', from: 43662, to: 75000, rate: 0.42 },
    { name: 'Advanced Rate', from: 75000, to: 125140, rate: 0.45 },
    { name: 'Top Rate', from: 125140, to: Infinity, rate: 0.48 },
  ],
}

export const scotlandTaxBands2025_26: TaxYearData = {
  region: 'scotland',
  taxYear: '2025-26',
  personalAllowance: 12570,
  personalAllowanceTaperThreshold: 100000,
  personalAllowanceTaperRate: 0.5,
  bands: [
    { name: 'Personal Allowance', from: 0, to: 12570, rate: 0 },
    { name: 'Starter Rate', from: 12570, to: 14876, rate: 0.19 },
    { name: 'Basic Rate', from: 14876, to: 26561, rate: 0.2 },
    { name: 'Intermediate Rate', from: 26561, to: 43662, rate: 0.21 },
    { name: 'Higher Rate', from: 43662, to: 75000, rate: 0.42 },
    { name: 'Advanced Rate', from: 75000, to: 125140, rate: 0.45 },
    { name: 'Top Rate', from: 125140, to: Infinity, rate: 0.48 },
  ],
}
