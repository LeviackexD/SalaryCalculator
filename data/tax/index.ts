import type { TaxRegion, TaxYear, TaxYearData, NiYearData } from '@/lib/types'
import { ukTaxBands2024_25, ukTaxBands2025_26 } from './uk/2024-25'
import { scotlandTaxBands2024_25, scotlandTaxBands2025_26 } from './scotland/2024-25'
import { niBands2024_25, niBands2025_26 } from './ni/2024-25'

const taxDataRegistry: Record<string, TaxYearData> = {
  'uk-2024-25': ukTaxBands2024_25,
  'uk-2025-26': ukTaxBands2025_26,
  'scotland-2024-25': scotlandTaxBands2024_25,
  'scotland-2025-26': scotlandTaxBands2025_26,
}

const niDataRegistry: Record<string, NiYearData> = {
  'uk-2024-25': niBands2024_25,
  'uk-2025-26': niBands2025_26,
  'scotland-2024-25': niBands2024_25,
  'scotland-2025-26': niBands2025_26,
}

export function getTaxData(region: TaxRegion, taxYear: TaxYear): TaxYearData {
  const key = `${region}-${taxYear}`
  const data = taxDataRegistry[key]
  if (!data) {
    throw new Error(`No tax data found for ${region} in tax year ${taxYear}`)
  }
  return data
}

export function getNiData(region: TaxRegion, taxYear: TaxYear): NiYearData {
  const key = `${region}-${taxYear}`
  const data = niDataRegistry[key]
  if (!data) {
    throw new Error(`No NI data found for ${region} in tax year ${taxYear}`)
  }
  return data
}

export * from './uk/2024-25'
export * from './scotland/2024-25'
export * from './ni/2024-25'
