import { Metadata } from 'next'
import Link from 'next/link'
export const dynamic = 'force-dynamic'
import type { TaxRegion } from '@/lib/types'
import { calculateTakeHomePay } from '@/lib/taxCalculator'
import { formatCurrency } from '@/lib/formatters'
import { generateStaticMetadata } from '@/lib/seo'
import { salaryWebApplicationSchema, faqPageSchema, breadcrumbSchema } from '@/lib/schema'
import { getSalaryTierForAmount } from '@/lib/contentModifiers'
import SalaryResultCard from '@/components/salary/SalaryResultCard'
import TaxBreakdownTable from '@/components/salary/TaxBreakdownTable'
import CalculatorForm from '@/components/salary/CalculatorForm'

export async function generateMetadata({ params }: { params: Promise<{ slug?: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!slug) return { title: 'Salary Evaluation' }
  const match = slug.match(/^(\d{3,7})-after-tax-(uk|scotland)$/)
  if (!match) return { title: 'Salary Evaluation' }

  const salary = parseInt(match[1])
  const region = match[2] as TaxRegion
  const result = calculateTakeHomePay(salary, region)
  const regionName = region === 'scotland' ? 'Scotland' : 'the UK'

  return generateStaticMetadata(
    `How Much is £${salary.toLocaleString('en-GB')} After Tax in ${regionName}?`,
    `Find out exactly how much you take home from a £${salary.toLocaleString('en-GB')} salary in ${regionName}. After tax and NI, you get £${formatCurrency(result.netAnnual)} per year.`,
    `/how-much-is-${match[1]}-after-tax-${match[2]}`,
  )
}

export default async function EvaluationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const match = slug.match(/^(\d{3,7})-after-tax-(uk|scotland)$/)

  if (!match) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy mb-4">Not Found</h1>
        <Link href="/" className="text-mint hover:text-mint-dark">Go home</Link>
      </div>
    )
  }

  const salary = parseInt(match[1])
  const region = match[2] as TaxRegion
  const takeHome = calculateTakeHomePay(salary, region)
  const regionName = region === 'scotland' ? 'Scotland' : 'the UK'
  const tier = getSalaryTierForAmount(salary)

  const questions = [
    { question: `How much is £${salary.toLocaleString('en-GB')} after tax in ${regionName}?`, answer: `You take home £${formatCurrency(takeHome.netAnnual)} per year from a £${salary.toLocaleString('en-GB')} salary in ${regionName}. That's £${formatCurrency(takeHome.netMonthly)} per month.` },
    { question: `What is the tax rate on £${salary.toLocaleString('en-GB')} in ${regionName}?`, answer: `Your effective tax rate is ${takeHome.effectiveTaxRate.toFixed(1)}%, with £${formatCurrency(takeHome.incomeTax.amount)} going to Income Tax and £${formatCurrency(takeHome.nationalInsurance.amount)} to National Insurance.` },
  ]

  const jsonLd = [
    salaryWebApplicationSchema(salary, region),
    faqPageSchema(questions),
    breadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: `£${salary.toLocaleString('en-GB')} After Tax`, href: `/how-much-is-${match[1]}-after-tax-${match[2]}` },
    ]),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd.map((s) => JSON.stringify(s)).join('\n') }} />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold text-navy mb-2">
          How Much is £{salary.toLocaleString('en-GB')} After Tax in {regionName}?
        </h1>
        <p className="text-gray-600 mb-6">{tier.introModifier}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SalaryResultCard result={takeHome} />

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-navy mb-3">Quick Answer</h3>
              <p className="text-gray-700">
                On a gross salary of <strong>£{salary.toLocaleString('en-GB')}</strong> in <strong>{regionName}</strong>, you take home{' '}
                <strong className="text-mint-dark">£{takeHome.netAnnual.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong> per year
                after <strong>£{takeHome.incomeTax.amount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong> in Income Tax
                and <strong>£{takeHome.nationalInsurance.amount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong> in National Insurance.
                That is an effective tax rate of <strong>{takeHome.effectiveTaxRate.toFixed(1)}%</strong>.
              </p>
            </div>

            <TaxBreakdownTable title="Income Tax" bands={takeHome.incomeTax.amount !== undefined ? [{ name: 'Income Tax', amount: takeHome.incomeTax.amount, percentage: takeHome.incomeTax.percentage }] : []} grossAnnual={salary} />
          </div>

          <aside className="space-y-6">
            <CalculatorForm initialSalary={String(salary)} initialRegion={region} />
          </aside>
        </div>
      </div>
    </>
  )
}
