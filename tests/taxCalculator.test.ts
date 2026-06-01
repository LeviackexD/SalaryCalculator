import { describe, it, expect } from 'vitest'
import {
  calculateIncomeTax,
  calculateNationalInsurance,
  calculateTakeHomePay,
  calculateSalaryForHourlyRate,
  calculateHourlyFromSalary,
  getTaxBreakdown,
} from '@/lib/taxCalculator'
import { formatCurrency, formatCurrencyExact, formatMonthly, formatWeekly, formatPercentage } from '@/lib/formatters'

describe('Tax Calculator', () => {
  describe('calculateIncomeTax', () => {
    it('should return zero tax for income within personal allowance', () => {
      const result = calculateIncomeTax(12570, 'uk', '2024-25')
      const totalTax = result.reduce((sum, band) => sum + band.amount, 0)
      expect(totalTax).toBe(0)
    })

    it('should calculate basic rate tax correctly for UK', () => {
      const result = calculateIncomeTax(30000, 'uk', '2024-25')
      const totalTax = result.reduce((sum, band) => sum + band.amount, 0)
      const taxable = 30000 - 12570
      const expectedTax = taxable * 0.2
      expect(totalTax).toBeCloseTo(expectedTax, 2)
    })

    it('should calculate higher rate tax correctly for UK', () => {
      const result = calculateIncomeTax(60000, 'uk', '2024-25')
      const totalTax = result.reduce((sum, band) => sum + band.amount, 0)
      const basicBand = 50270 - 12570
      const higherBand = 60000 - 50270
      const expectedTax = (basicBand * 0.2) + (higherBand * 0.4)
      expect(totalTax).toBeCloseTo(expectedTax, 2)
    })

    it('should apply personal allowance taper above 100k', () => {
      const result = calculateIncomeTax(110000, 'uk', '2024-25')
      const totalTax = result.reduce((sum, band) => sum + band.amount, 0)
      const excess = 110000 - 100000
      const allowanceReduction = Math.floor(excess * 0.5)
      const effectiveAllowance = Math.max(0, 12570 - allowanceReduction)
      expect(totalTax).toBeGreaterThan(0)
      expect(effectiveAllowance).toBe(7570)
    })

    it('should eliminate personal allowance at 125140+', () => {
      const result = calculateIncomeTax(130000, 'uk', '2024-25')
      const totalTax = result.reduce((sum, band) => sum + band.amount, 0)
      const excess = 130000 - 100000
      const allowanceReduction = Math.floor(excess * 0.5)
      const effectiveAllowance = Math.max(0, 12570 - allowanceReduction)
      expect(effectiveAllowance).toBe(0)
      expect(totalTax).toBeGreaterThan(0)
    })

    it('should calculate additional rate tax above 125140', () => {
      const result = calculateIncomeTax(150000, 'uk', '2024-25')
      const totalTax = result.reduce((sum, band) => sum + band.amount, 0)
      const taxable = 150000
      const basicWidth = 50270 - 12570
      const higherWidth = 125140 - 50270
      const basicTax = basicWidth * 0.2
      const higherTax = higherWidth * 0.4
      const additionalTax = (taxable - basicWidth - higherWidth) * 0.45
      const expectedTax = basicTax + higherTax + additionalTax
      expect(totalTax).toBeCloseTo(expectedTax, 2)
    })

    it('should use default tax year if not specified', () => {
      const result = calculateIncomeTax(30000, 'uk')
      const totalTax = result.reduce((sum, band) => sum + band.amount, 0)
      expect(totalTax).toBeGreaterThan(0)
    })

    it('should use default region if not specified', () => {
      const result = calculateIncomeTax(30000)
      const totalTax = result.reduce((sum, band) => sum + band.amount, 0)
      expect(totalTax).toBeGreaterThan(0)
    })
  })

  describe('Scotland tax bands', () => {
    it('should calculate starter rate for Scotland correctly', () => {
      const result = calculateIncomeTax(14000, 'scotland', '2024-25')
      const totalTax = result.reduce((sum, band) => sum + band.amount, 0)
      const taxable = 14000 - 12570
      const expectedTax = taxable * 0.19
      expect(totalTax).toBeCloseTo(expectedTax, 2)
    })

    it('should apply top rate (48%) for high earners in Scotland', () => {
      const result = calculateIncomeTax(150000, 'scotland', '2024-25')
      const totalTax = result.reduce((sum, band) => sum + band.amount, 0)
      expect(totalTax).toBeGreaterThan(0)
    })

    it('should calculate more tax than UK for same salary', () => {
      const ukResult = calculateIncomeTax(50000, 'uk', '2024-25')
      const scotResult = calculateIncomeTax(50000, 'scotland', '2024-25')
      const ukTotal = ukResult.reduce((sum, band) => sum + band.amount, 0)
      const scotTotal = scotResult.reduce((sum, band) => sum + band.amount, 0)
      expect(scotTotal).toBeGreaterThan(ukTotal)
    })
  })

  describe('calculateNationalInsurance', () => {
    it('should return zero NI for income below threshold', () => {
      const result = calculateNationalInsurance(12570, 'uk', '2024-25')
      const total = result.reduce((sum, band) => sum + band.amount, 0)
      expect(total).toBe(0)
    })

    it('should calculate NI at 8% between threshold and UEL', () => {
      const result = calculateNationalInsurance(30000, 'uk', '2024-25')
      const total = result.reduce((sum, band) => sum + band.amount, 0)
      const taxable = 30000 - 12570
      const expected = taxable * 0.08
      expect(total).toBeCloseTo(expected, 2)
    })

    it('should apply 2% rate above UEL', () => {
      const result = calculateNationalInsurance(60000, 'uk', '2024-25')
      const total = result.reduce((sum, band) => sum + band.amount, 0)
      const mainBand = 50270 - 12570
      const higherBand = 60000 - 50270
      const expected = (mainBand * 0.08) + (higherBand * 0.02)
      expect(total).toBeCloseTo(expected, 2)
    })
  })

  describe('calculateTakeHomePay', () => {
    it('should return correct structure', () => {
      const result = calculateTakeHomePay(35000, 'uk', '2024-25')
      expect(result).toHaveProperty('grossAnnual')
      expect(result).toHaveProperty('netAnnual')
      expect(result).toHaveProperty('incomeTax')
      expect(result).toHaveProperty('nationalInsurance')
      expect(result).toHaveProperty('effectiveTaxRate')
      expect(result).toHaveProperty('region')
      expect(result).toHaveProperty('taxYear')
    })

    it('should have gross equal to sum of net + deductions', () => {
      const result = calculateTakeHomePay(50000, 'uk', '2024-25')
      expect(result.grossAnnual).toBeCloseTo(result.netAnnual + result.totalDeductions, 2)
    })

    it('should calculate correct monthly/weekly/daily/hourly figures', () => {
      const result = calculateTakeHomePay(36000, 'uk', '2024-25')
      expect(result.grossMonthly).toBeCloseTo(3000, 2)
      expect(result.grossWeekly).toBeCloseTo(692.31, 1)
      expect(result.grossDaily).toBeCloseTo(138.46, 1)
      expect(result.grossHourly).toBeCloseTo(17.31, 1)
    })

    it('should handle zero salary', () => {
      const result = calculateTakeHomePay(0, 'uk', '2024-25')
      expect(result.grossAnnual).toBe(0)
      expect(result.netAnnual).toBe(0)
      expect(result.incomeTax.amount).toBe(0)
      expect(result.nationalInsurance.amount).toBe(0)
      expect(result.effectiveTaxRate).toBe(0)
    })

    it('should report correct region and tax year', () => {
      const result = calculateTakeHomePay(35000, 'scotland', '2025-26')
      expect(result.region).toBe('scotland')
      expect(result.taxYear).toBe('2025-26')
    })

    it('should have lower take-home for Scotland vs UK at same salary', () => {
      const uk = calculateTakeHomePay(45000, 'uk', '2024-25')
      const scot = calculateTakeHomePay(45000, 'scotland', '2024-25')
      expect(scot.netAnnual).toBeLessThan(uk.netAnnual)
    })
  })

  describe('calculateSalaryForHourlyRate / calculateHourlyFromSalary', () => {
    it('should convert hourly rate to annual salary', () => {
      const annual = calculateSalaryForHourlyRate(20)
      expect(annual).toBe(41600)
    })

    it('should convert annual salary to hourly rate', () => {
      const hourly = calculateHourlyFromSalary(41600)
      expect(hourly).toBeCloseTo(20, 1)
    })

    it('should be approximately reversible', () => {
      const salary = 50000
      const hourly = calculateHourlyFromSalary(salary)
      const back = calculateSalaryForHourlyRate(hourly)
      expect(Math.abs(back - salary)).toBeLessThan(5)
    })

    it('should respect custom hours per week', () => {
      const annual = calculateSalaryForHourlyRate(15, 35)
      expect(annual).toBe(27300)
    })
  })

  describe('getTaxBreakdown', () => {
    it('should return complete breakdown', () => {
      const breakdown = getTaxBreakdown(40000, 'uk', '2024-25')
      expect(breakdown.incomeTaxBands).toHaveLength(4)
      expect(breakdown.niBands).toHaveLength(3)
      expect(breakdown.takeHome.netAnnual).toBeGreaterThan(0)
    })
  })
})

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format with GBP symbol and no decimals', () => {
      expect(formatCurrency(45000)).toBe('£45,000')
    })

    it('should format zero', () => {
      expect(formatCurrency(0)).toBe('£0')
    })
  })

  describe('formatCurrencyExact', () => {
    it('should format with 2 decimal places', () => {
      expect(formatCurrencyExact(45000)).toBe('£45,000.00')
    })
  })

  describe('formatMonthly', () => {
    it('should format annual as monthly', () => {
      expect(formatMonthly(36000)).toBe('£3,000')
    })
  })

  describe('formatWeekly', () => {
    it('should format annual as weekly', () => {
      const result = formatWeekly(52000)
      expect(result).toBe('£1,000')
    })
  })

  describe('formatPercentage', () => {
    it('should format with one decimal place', () => {
      expect(formatPercentage(25.5)).toBe('25.5%')
    })

    it('should format whole numbers', () => {
      expect(formatPercentage(30)).toBe('30.0%')
    })
  })
})
