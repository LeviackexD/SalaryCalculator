import type { TaxRegion, TaxYear, TakeHomePayResult, TaxResult } from '@/lib/types'
import { DEFAULT_REGION, DEFAULT_TAX_YEAR } from '@/lib/types'
import { getTaxData, getNiData } from '@/data/tax'

function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100
}

function calculateBandedTax(
  grossAnnualSalary: number,
  bands: { name: string; from: number; to: number; rate: number }[],
): TaxResult[] {
  const results: TaxResult[] = []
  let remainingIncome = grossAnnualSalary

  for (const band of bands) {
    const bandWidth = band.to - band.from
    if (bandWidth <= 0 || remainingIncome <= 0) {
      results.push({ name: band.name, amount: 0, percentage: 0 })
      continue
    }

    const taxableInBand = Math.min(remainingIncome, bandWidth)
    const taxAmount = roundCurrency(taxableInBand * band.rate)

    results.push({
      name: band.name,
      amount: taxAmount,
      percentage: grossAnnualSalary > 0 ? (taxAmount / grossAnnualSalary) * 100 : 0,
    })

    remainingIncome -= taxableInBand
  }

  return results
}

export function calculateIncomeTax(
  grossAnnualSalary: number,
  region: TaxRegion = DEFAULT_REGION,
  taxYear: TaxYear = DEFAULT_TAX_YEAR,
): TaxResult[] {
  const data = getTaxData(region, taxYear)

  let effectiveAllowance = data.personalAllowance
  if (grossAnnualSalary > data.personalAllowanceTaperThreshold) {
    const excess = grossAnnualSalary - data.personalAllowanceTaperThreshold
    const reduction = Math.floor(excess * data.personalAllowanceTaperRate)
    effectiveAllowance = Math.max(0, effectiveAllowance - reduction)
  }

  const totalTaxable = grossAnnualSalary - effectiveAllowance

  if (totalTaxable <= 0) {
    return data.bands.map((b) => ({ name: b.name, amount: 0, percentage: 0 }))
  }

  const remainingBands = data.bands.slice(1)
  const taxableBands = remainingBands.map((b) => ({
    name: b.name,
    from: Math.max(0, b.from - effectiveAllowance),
    to: Math.max(0, b.to - effectiveAllowance),
    rate: b.rate,
  }))

  const paResult: TaxResult = { name: data.bands[0].name, amount: 0, percentage: 0 }
  const bandResults = calculateBandedTax(totalTaxable, taxableBands)

  return [paResult, ...bandResults]
}

export function calculateNationalInsurance(
  grossAnnualSalary: number,
  region: TaxRegion = DEFAULT_REGION,
  taxYear: TaxYear = DEFAULT_TAX_YEAR,
): TaxResult[] {
  const data = getNiData(region, taxYear)
  return calculateBandedTax(grossAnnualSalary, data.bands)
}

function toMonthly(annual: number): number {
  return roundCurrency(annual / 12)
}

function toWeekly(annual: number): number {
  return roundCurrency(annual / 52)
}

function toDaily(annual: number): number {
  return roundCurrency(annual / 260)
}

function toHourly(annual: number): number {
  return roundCurrency(annual / (260 * 8))
}

export function calculateTakeHomePay(
  grossAnnualSalary: number,
  region: TaxRegion = DEFAULT_REGION,
  taxYear: TaxYear = DEFAULT_TAX_YEAR,
): TakeHomePayResult {
  const incomeTaxBands = calculateIncomeTax(grossAnnualSalary, region, taxYear)
  const niBands = calculateNationalInsurance(grossAnnualSalary, region, taxYear)

  const totalIncomeTax = roundCurrency(incomeTaxBands.reduce((sum, band) => sum + band.amount, 0))
  const totalNi = roundCurrency(niBands.reduce((sum, band) => sum + band.amount, 0))
  const totalDeductions = roundCurrency(totalIncomeTax + totalNi)
  const netAnnual = roundCurrency(grossAnnualSalary - totalDeductions)

  const totalIncomeTaxResult: TaxResult = {
    name: 'Income Tax',
    amount: totalIncomeTax,
    percentage: grossAnnualSalary > 0 ? (totalIncomeTax / grossAnnualSalary) * 100 : 0,
  }

  const totalNiResult: TaxResult = {
    name: 'National Insurance',
    amount: totalNi,
    percentage: grossAnnualSalary > 0 ? (totalNi / grossAnnualSalary) * 100 : 0,
  }

  return {
    grossAnnual: grossAnnualSalary,
    grossMonthly: toMonthly(grossAnnualSalary),
    grossWeekly: toWeekly(grossAnnualSalary),
    grossDaily: toDaily(grossAnnualSalary),
    grossHourly: toHourly(grossAnnualSalary),
    incomeTax: totalIncomeTaxResult,
    nationalInsurance: totalNiResult,
    totalDeductions,
    netAnnual,
    netMonthly: toMonthly(netAnnual),
    netWeekly: toWeekly(netAnnual),
    netDaily: toDaily(netAnnual),
    netHourly: toHourly(netAnnual),
    effectiveTaxRate: grossAnnualSalary > 0 ? roundCurrency((totalDeductions / grossAnnualSalary) * 100) : 0,
    region,
    taxYear,
  }
}

export function calculateSalaryForHourlyRate(hourlyRate: number, hoursPerWeek: number = 40): number {
  return roundCurrency(hourlyRate * hoursPerWeek * 52)
}

export function calculateHourlyFromSalary(annualSalary: number, hoursPerWeek: number = 40): number {
  return roundCurrency(annualSalary / (hoursPerWeek * 52))
}

export function getTaxBreakdown(grossAnnualSalary: number, region: TaxRegion = DEFAULT_REGION, taxYear: TaxYear = DEFAULT_TAX_YEAR) {
  const incomeTaxBands = calculateIncomeTax(grossAnnualSalary, region, taxYear)
  const niBands = calculateNationalInsurance(grossAnnualSalary, region, taxYear)
  const takeHome = calculateTakeHomePay(grossAnnualSalary, region, taxYear)

  return {
    incomeTaxBands,
    niBands,
    takeHome,
  }
}
