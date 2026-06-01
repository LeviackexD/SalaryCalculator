import { formatCurrency, formatMonthly, formatWeekly } from '@/lib/formatters'
import type { TakeHomePayResult } from '@/lib/types'

interface SalaryResultCardProps {
  result: TakeHomePayResult
}

export default function SalaryResultCard({ result }: SalaryResultCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-navy mb-4">Your Take-Home Pay</h2>
      <div className="grid grid-cols-2 gap-4">
        <ResultItem label="Annual Net" value={formatCurrency(result.netAnnual)} highlight />
        <ResultItem label="Annual Gross" value={formatCurrency(result.grossAnnual)} />
        <ResultItem label="Monthly Net" value={result.netMonthly >= 0 ? formatMonthly(result.netAnnual) : '—'} />
        <ResultItem label="Monthly Gross" value={result.grossMonthly >= 0 ? formatMonthly(result.grossAnnual) : '—'} />
        <ResultItem label="Weekly Net" value={result.netWeekly >= 0 ? formatWeekly(result.netAnnual) : '—'} />
        <ResultItem label="Weekly Gross" value={result.grossWeekly >= 0 ? formatWeekly(result.grossAnnual) : '—'} />
      </div>
    </div>
  )
}

function ResultItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-lg font-bold ${highlight ? 'text-mint-dark' : 'text-navy'}`}>{value}</p>
    </div>
  )
}
