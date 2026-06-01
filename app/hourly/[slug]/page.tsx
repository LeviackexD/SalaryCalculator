import { Metadata } from 'next'
import Link from 'next/link'
import type { TaxRegion } from '@/lib/types'
import { calculateTakeHomePay, calculateSalaryForHourlyRate } from '@/lib/taxCalculator'
import { formatCurrency } from '@/lib/formatters'
import { generateHourlyMetadata } from '@/lib/seo'
import { howToSchema, breadcrumbSchema } from '@/lib/schema'
import SalaryResultCard from '@/components/salary/SalaryResultCard'
import CalculatorForm from '@/components/salary/CalculatorForm'

const COMMON_HOURLY_RATES = [10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 25, 27, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90, 100]

export async function generateStaticParams() {
  const params = COMMON_HOURLY_RATES.flatMap((rate) => [
    { slug: `${rate}-uk` },
    { slug: `${rate}-scotland` },
  ])
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const match = slug.match(/^(\d{1,3}(?:\.\d{1,2})?)-(uk|scotland)$/)
  if (!match) return { title: 'Hourly Rate Calculator' }

  const rate = parseFloat(match[1])
  const region = match[2] as TaxRegion

  return generateHourlyMetadata(rate, region, '2024-25')
}

export default async function HourlyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const match = slug.match(/^(\d{1,3}(?:\.\d{1,2})?)-(uk|scotland)$/)

  if (!match) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy mb-4">Invalid Hourly Rate</h1>
        <p className="text-gray-600">Please enter a valid hourly rate.</p>
        <Link href="/" className="text-mint hover:text-mint-dark mt-4 inline-block">Try again</Link>
      </div>
    )
  }

  const rate = parseFloat(match[1])
  const region = match[2] as TaxRegion
  const annualSalary = calculateSalaryForHourlyRate(rate)
  const takeHome = calculateTakeHomePay(annualSalary, region)
  const regionName = region === 'scotland' ? 'Scotland' : 'the UK'

  const howToSteps = [
    { name: 'Enter your hourly rate', text: `You earn £${rate} per hour.` },
    { name: 'Annual salary calculated', text: `At 40 hours per week, this equals £${formatCurrency(annualSalary)} per year.` },
    { name: 'View your take-home pay', text: `After tax and NI, you take home £${formatCurrency(takeHome.netAnnual)} per year in ${regionName}.` },
  ]

  const jsonLd = [
    howToSchema(howToSteps),
    breadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: `£${rate}/hour`, href: `/hourly/${slug}` },
    ]),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd.map((s) => JSON.stringify(s)).join('\n') }} />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold text-navy mb-2">
          £{rate} Per Hour After Tax in {regionName}
        </h1>
        <p className="text-gray-600 mb-6">
          If you earn £{rate} per hour, your annual salary is approximately {formatCurrency(annualSalary)}.
          Here is your take-home pay after tax and National Insurance.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <SalaryResultCard result={takeHome} />

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-navy mb-3">Calculation Steps</h3>
              <ol className="space-y-3">
                {howToSteps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-mint text-white text-xs flex items-center justify-center font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="font-medium text-navy text-sm">{step.name}</h4>
                      <p className="text-sm text-gray-600">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="space-y-6">
            <CalculatorForm initialSalary={String(Math.round(annualSalary))} initialRegion={region} />
          </aside>
        </div>
      </div>
    </>
  )
}
