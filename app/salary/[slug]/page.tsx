import { Metadata } from 'next'
import Link from 'next/link'
import type { TaxRegion } from '@/lib/types'
import { calculateTakeHomePay, getTaxBreakdown } from '@/lib/taxCalculator'
import { formatCurrency } from '@/lib/formatters'
import { generateSalaryMetadata } from '@/lib/seo'
import { salaryWebApplicationSchema, faqPageSchema, breadcrumbSchema } from '@/lib/schema'
import { getSalaryTierForAmount } from '@/lib/contentModifiers'
import { getRelatedSalaries, getIntentLinks, getBlogLinks } from '@/lib/internalLinks'
import { getIndexingStatus, getAllTier1And2Slugs } from '@/lib/crawlControl'
import SalaryResultCard from '@/components/salary/SalaryResultCard'
import TaxBreakdownTable from '@/components/salary/TaxBreakdownTable'
import CalculatorForm from '@/components/salary/CalculatorForm'

export async function generateStaticParams() {
  const slugs = getAllTier1And2Slugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const match = slug.match(/^(\d{3,7})-(uk|scotland)$/)
  if (!match) return { title: 'Salary Calculator' }

  const salary = parseInt(match[1])
  const region = match[2] as TaxRegion
  const result = calculateTakeHomePay(salary, region)
  const { index } = getIndexingStatus(slug)

  const metaBase = generateSalaryMetadata({
    slug,
    salary,
    region,
    taxYear: result.taxYear,
    netAnnual: result.netAnnual,
    effectiveTaxRate: result.effectiveTaxRate,
  })

  const meta: Metadata = {
    ...metaBase,
    ...(!index ? { robots: { index: false, follow: true } } : {}),
  }

  return meta
}

export default async function SalaryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const match = slug.match(/^(\d{3,7})-(uk|scotland)$/)

  if (!match) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy mb-4">Invalid Salary</h1>
        <p className="text-gray-600">Please enter a valid salary amount.</p>
        <Link href="/" className="text-mint hover:text-mint-dark mt-4 inline-block">Try again</Link>
      </div>
    )
  }

  const salary = parseInt(match[1])
  const region = match[2] as TaxRegion
  const breakdown = getTaxBreakdown(salary, region)
  const { takeHome, incomeTaxBands, niBands } = breakdown
  const tier = getSalaryTierForAmount(salary)
  const relatedSalaries = getRelatedSalaries(salary, region)
  const intentLinks = getIntentLinks(slug)
  const blogLinks = getBlogLinks()
  const regionName = region === 'scotland' ? 'Scotland' : 'the UK'

  const faqQuestions = [
    { question: `How much is £${salary.toLocaleString('en-GB')} after tax in ${regionName}?`, answer: `After Income Tax and National Insurance, you take home £${Math.round(takeHome.netAnnual).toLocaleString('en-GB')} per year from a £${salary.toLocaleString('en-GB')} salary. Your effective tax rate is ${takeHome.effectiveTaxRate.toFixed(1)}%.` },
    { question: `What is the monthly take-home pay for £${salary.toLocaleString('en-GB')} in ${regionName}?`, answer: `Your monthly take-home pay is £${Math.round(takeHome.netMonthly).toLocaleString('en-GB')} after tax and NI.` },
    { question: `What is the hourly rate for a £${salary.toLocaleString('en-GB')} salary?`, answer: `Based on a standard 40-hour work week, a £${salary.toLocaleString('en-GB')} salary equates to approximately £${Math.round(takeHome.grossHourly).toLocaleString('en-GB')} per hour gross, or £${Math.round(takeHome.netHourly).toLocaleString('en-GB')} per hour after tax.` },
    { question: `How much National Insurance do I pay on £${salary.toLocaleString('en-GB')} in ${regionName}?`, answer: `On a £${salary.toLocaleString('en-GB')} salary, you pay £${Math.round(takeHome.nationalInsurance.amount).toLocaleString('en-GB')} in National Insurance contributions per year (${takeHome.nationalInsurance.percentage.toFixed(1)}% of your gross income).` },
  ]

  const jsonLd = [
    salaryWebApplicationSchema(salary, region),
    faqPageSchema(faqQuestions),
    breadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: `${formatCurrency(salary)} Salary`, href: `/salary/${slug}` },
    ]),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd.map((s) => JSON.stringify(s)).join('\n') }} />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold text-navy mb-2">
          Take-Home Pay for £{formatCurrency(salary)} in {region === 'scotland' ? 'Scotland' : 'the UK'}
        </h1>
        <p className="text-gray-600 mb-6">
          {tier.introModifier}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <SalaryResultCard result={takeHome} />
            <TaxBreakdownTable title="Income Tax" bands={incomeTaxBands} grossAnnual={salary} />
            <TaxBreakdownTable title="National Insurance" bands={niBands} grossAnnual={salary} />

            <div className="bg-mint-light rounded-xl p-6 border border-mint/30">
              <h3 className="text-base font-semibold text-navy mb-2">Tax Year {takeHome.taxYear}</h3>
              <p className="text-sm text-gray-700">{tier.lifestyleNote}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-navy mb-3">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqQuestions.map((faq) => (
                  <div key={faq.question}>
                    <h4 className="font-medium text-navy text-sm mb-1">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <CalculatorForm initialSalary={String(salary)} initialRegion={region} />

            {intentLinks.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-navy mb-3">Related Pages</h3>
                <ul className="space-y-2">
                  {intentLinks.map((link) => (
                    <li key={link.url}>
                      <Link href={link.url} className="text-sm text-mint hover:text-mint-dark transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relatedSalaries.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-navy mb-3">Related Salaries</h3>
                <ul className="space-y-2">
                  {relatedSalaries.map((r) => (
                    <li key={r.url}>
                      <Link href={r.url} className="text-sm text-mint hover:text-mint-dark transition-colors">
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-navy mb-3">Guides</h3>
              <ul className="space-y-2">
                {blogLinks.slice(0, 3).map((link) => (
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
