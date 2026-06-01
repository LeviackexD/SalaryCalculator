import Link from 'next/link'
import { calculateTakeHomePay } from '@/lib/taxCalculator'
import { formatCurrency } from '@/lib/formatters'
import { generateHomepageMetadata } from '@/lib/seo'
import { breadcrumbSchema, organizationSchema } from '@/lib/schema'
import CalculatorForm from '@/components/salary/CalculatorForm'

export const metadata = generateHomepageMetadata()

const QUICK_SALARIES = [25000, 30000, 35000, 40000, 45000, 50000, 60000, 75000, 100000]

export default function HomePage() {
  const jsonLd = [
    organizationSchema(),
    breadcrumbSchema([{ name: 'Home', href: '/' }]),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd.map((s) => JSON.stringify(s)).join('\n') }} />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy mb-4">
            UK Salary Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your take-home pay after Income Tax and National Insurance.
            Includes Scottish tax bands for accurate Scotland calculations.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-navy mb-4">Try It Now</h2>
              <CalculatorForm />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-navy text-white rounded-xl p-6">
              <h3 className="font-semibold mb-2">UK Tax Year 2024/2025</h3>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• Personal Allowance: £12,570</li>
                <li>• Basic Rate: 20%</li>
                <li>• Higher Rate: 40%</li>
                <li>• Additional Rate: 45%</li>
                <li>• Scottish rates: 19%–48%</li>
              </ul>
            </div>
            <div className="bg-mint-light rounded-xl p-6 border border-mint/30">
              <h3 className="font-semibold text-navy mb-2">Scotland Calculated</h3>
              <p className="text-sm text-gray-700">
                Our calculator supports Scotland&apos;s five tax bands — starter, basic, intermediate, higher, advanced, and top rates.
              </p>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy mb-4 text-center">Popular Salary Calculations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {QUICK_SALARIES.map((salary) => {
              const uk = calculateTakeHomePay(salary, 'uk')
              return (
                <Link
                  key={salary}
                  href={`/salary/${salary}-uk`}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:border-mint hover:shadow-sm transition-all text-center"
                >
                  <div className="text-lg font-bold text-navy">£{salary.toLocaleString('en-GB')}</div>
                  <div className="text-xs text-gray-500 mt-1">Take home</div>
                  <div className="text-sm font-semibold text-mint-dark">{formatCurrency(uk.netAnnual)}</div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-navy mb-3">Start Your Calculation</h2>
            <p className="text-sm text-gray-600 mb-4">
              Use our calculator above to check any salary, or browse popular calculations below.
            </p>
            <div className="space-y-2 text-sm">
              <Link href="/salary/35000-uk" className="block text-mint hover:text-mint-dark">£35,000 after tax UK</Link>
              <Link href="/salary/50000-uk" className="block text-mint hover:text-mint-dark">£50,000 after tax UK</Link>
              <Link href="/salary/100000-uk" className="block text-mint hover:text-mint-dark">£100,000 after tax UK</Link>
              <Link href="/scotland-vs-uk-salary-tax-difference" className="block text-mint hover:text-mint-dark">Scotland vs UK comparison</Link>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-navy mb-3">How It Works</h2>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-mint font-bold">1.</span>
                Enter your annual salary (before tax)
              </li>
              <li className="flex gap-2">
                <span className="text-mint font-bold">2.</span>
                Select your region — UK or Scotland
              </li>
              <li className="flex gap-2">
                <span className="text-mint font-bold">3.</span>
                Instantly see your take-home pay, tax breakdown, and NI
              </li>
              <li className="flex gap-2">
                <span className="text-mint font-bold">4.</span>
                Check monthly, weekly, daily, and hourly figures
              </li>
            </ol>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-navy mb-4 text-center">Free Salary &amp; Tax Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GuideCard title="How Income Tax Works in the UK" href="/blog/tax/how-income-tax-works-uk" desc="Complete guide to UK income tax bands, rates, and allowances." />
            <GuideCard title="NI Rate Cuts 2025/2026" href="/blog/tax/national-insurance-rate-cuts-2025-2026" desc="How the 8% to 6% NI cut affects your take-home pay." />
            <GuideCard title="Scotland vs UK Tax Differences" href="/blog/tax/scotland-vs-uk-tax-differences" desc="How Scotland's six tax bands compare to the rest of the UK." />
            <GuideCard title="Graduate Salaries UK 2025" href="/blog/salary/graduate-salaries-uk-2025" desc="Starting salaries by sector and region for new graduates." />
          </div>
        </section>
      </div>
    </>
  )
}

function GuideCard({ title, href, desc }: { title: string; href: string; desc: string }) {
  return (
    <Link href={href} className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-mint hover:shadow-sm transition-all">
      <h3 className="font-semibold text-navy mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </Link>
  )
}
