import { Metadata } from 'next'
import Link from 'next/link'
import { REGIONS } from '@/lib/types'
import { calculateTakeHomePay } from '@/lib/taxCalculator'
import { formatCurrency } from '@/lib/formatters'
import { generateStaticMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { getBlogLinks } from '@/lib/internalLinks'
import CalculatorForm from '@/components/salary/CalculatorForm'

export const metadata: Metadata = generateStaticMetadata(
  'Scotland vs UK Salary Tax Comparison 2024/2025',
  'Compare your take-home pay in Scotland vs the rest of the UK. See how much more tax you pay in Scotland with different tax bands and rates.',
  '/scotland-vs-uk-salary-tax-difference',
)

const COMPARISON_SALARIES = [25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 70000, 80000, 100000, 125000, 150000]

export default async function ComparisonPage() {
  const blogLinks = getBlogLinks()
  const comparisons = COMPARISON_SALARIES.map((salary) => {
    const ukResult = calculateTakeHomePay(salary, REGIONS.UK)
    const scotResult = calculateTakeHomePay(salary, REGIONS.SCOTLAND)
    const difference = scotResult.netAnnual - ukResult.netAnnual
    const taxUK = ukResult.incomeTax.amount + ukResult.nationalInsurance.amount
    const taxScot = scotResult.incomeTax.amount + scotResult.nationalInsurance.amount
    return { salary, uk: ukResult, scotland: scotResult, difference, taxUK, taxScot }
  })

  const jsonLd = [
    breadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Scotland vs UK Tax', href: '/scotland-vs-uk-salary-tax-difference' },
    ]),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd.map((s) => JSON.stringify(s)).join('\n') }} />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold text-navy mb-2">Scotland vs UK Salary Tax Comparison</h1>
        <p className="text-gray-600 mb-6">
          See how much more tax you pay in Scotland compared to the rest of the UK across different salary levels.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="text-left py-3 px-4 font-medium">Salary</th>
                      <th className="text-right py-3 px-4 font-medium">UK Take-Home</th>
                      <th className="text-right py-3 px-4 font-medium">Scotland Take-Home</th>
                      <th className="text-right py-3 px-4 font-medium">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((c) => (
                      <tr key={c.salary} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">
                          <Link href={`/salary/${c.salary}-uk`} className="text-navy hover:text-mint">
                            £{c.salary.toLocaleString('en-GB')}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-right">{formatCurrency(c.uk.netAnnual)}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(c.scotland.netAnnual)}</td>
                        <td className={`py-3 px-4 text-right font-semibold ${c.difference < 0 ? 'text-red-600' : 'text-mint-dark'}`}>
                          {c.difference < 0 ? '−' : ''}{formatCurrency(Math.abs(c.difference))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6">
              <h2 className="text-xl font-semibold text-navy mb-3">Key Takeaways</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Scotland has five income tax bands instead of three, with rates ranging from 19% to 48%.</li>
                <li>• The Scottish starter rate (19%) and intermediate rate (21%) create a more progressive system.</li>
                <li>• Higher earners in Scotland pay significantly more, with the top rate at 48% vs 45% in the rest of the UK.</li>
                <li>• National Insurance is the same across all UK regions.</li>
                <li>• The personal allowance taper (£1 lost per £2 over £100,000) applies equally across the UK.</li>
              </ul>
            </div>
          </div>

          <aside className="space-y-6">
            <CalculatorForm initialRegion="scotland" />

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-navy mb-3">Guides</h3>
              <ul className="space-y-2">
                {blogLinks.map((link) => (
                  <li key={link.url}>
                    <Link href={link.url} className="text-sm text-mint hover:text-mint-dark transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
