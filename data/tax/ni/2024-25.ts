import type { NiYearData } from '@/lib/types'

export const niBands2024_25: NiYearData = {
  region: 'uk',
  taxYear: '2024-25',
  primaryThreshold: 12570,
  upperEarningsLimit: 50270,
  bands: [
    { name: 'Below Threshold', from: 0, to: 12570, rate: 0 },
    { name: 'Main Rate', from: 12570, to: 50270, rate: 0.08 },
    { name: 'Higher Rate', from: 50270, to: Infinity, rate: 0.02 },
  ],
}

export const niBands2025_26: NiYearData = {
  region: 'uk',
  taxYear: '2025-26',
  primaryThreshold: 12570,
  upperEarningsLimit: 50270,
  bands: [
    { name: 'Below Threshold', from: 0, to: 12570, rate: 0 },
    { name: 'Main Rate', from: 12570, to: 50270, rate: 0.08 },
    { name: 'Higher Rate', from: 50270, to: Infinity, rate: 0.02 },
  ],
}
