import type { TaxResult } from '@/lib/types'
import { formatCurrency, formatPercentage } from '@/lib/formatters'

interface TaxBreakdownTableProps {
  title: string
  bands: TaxResult[]
  grossAnnual: number
}

export default function TaxBreakdownTable({ title, bands, grossAnnual }: TaxBreakdownTableProps) {
  const totalAmount = bands.reduce((sum, b) => sum + b.amount, 0)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-navy mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-medium text-gray-500">Band</th>
              <th className="text-right py-2 font-medium text-gray-500">Amount</th>
              <th className="text-right py-2 font-medium text-gray-500">% of Gross</th>
            </tr>
          </thead>
          <tbody>
            {bands
              .filter((b) => b.amount > 0 || b.name === 'Personal Allowance')
              .map((band) => (
                <tr key={band.name} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 text-navy">{band.name}</td>
                  <td className="py-2 text-right font-medium">{formatCurrency(band.amount)}</td>
                  <td className="py-2 text-right text-gray-500">{formatPercentage(grossAnnual > 0 ? (band.amount / grossAnnual) * 100 : 0)}</td>
                </tr>
              ))}
            <tr className="border-t border-gray-300 font-semibold">
              <td className="py-2 text-navy">Total {title}</td>
              <td className="py-2 text-right">{formatCurrency(totalAmount)}</td>
              <td className="py-2 text-right">{formatPercentage(grossAnnual > 0 ? (totalAmount / grossAnnual) * 100 : 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
