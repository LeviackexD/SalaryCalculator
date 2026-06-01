import { Metadata } from 'next'
import { generateStaticMetadata } from '@/lib/seo'

export const metadata: Metadata = generateStaticMetadata(
  'About UK Salary Calculator',
  'Learn about UK Salary Calculator — a free tool for calculating your take-home pay after tax and National Insurance in the UK and Scotland.',
  '/about',
)

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-6">About UK Salary Calculator</h1>
      <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
        <p>
          UK Salary Calculator is a free online tool that helps you calculate your take-home pay after
          Income Tax and National Insurance. We support both UK (England, Wales, Northern Ireland)
          and Scottish tax bands, giving you accurate calculations regardless of where you live.
        </p>
        <p>
          Our calculator is designed to be simple, fast, and accurate. Just enter your salary and
          region, and you&apos;ll instantly see your net annual, monthly, and weekly pay, along
          with a full breakdown of your tax and National Insurance contributions.
        </p>
        <h2 className="text-xl font-semibold text-navy mt-8">Why We Built This</h2>
        <p>
          Many salary calculators are outdated, inaccurate for Scottish tax bands, or cluttered with
          ads. We built this tool to provide a clean, accurate, and free alternative that works for
          everyone in the UK.
        </p>
        <h2 className="text-xl font-semibold text-navy mt-8">How It Works</h2>
        <p>
          Our calculator uses the official HMRC tax bands and National Insurance rates for the
          current tax year. We update the rates annually when new tax bands are announced in the
          Budget. For Scottish taxpayers, we use the separate Scottish tax bands set by the Scottish
          Parliament.
        </p>
        <h2 className="text-xl font-semibold text-navy mt-8">Accuracy</h2>
        <p>
          While we strive for accuracy, our calculator provides estimates only. Your actual tax and
          NI may differ based on your specific circumstances, including pension contributions,
          student loan repayments, benefits, and other factors. Always consult HMRC or a qualified
          tax adviser for official calculations.
        </p>
        <h2 className="text-xl font-semibold text-navy mt-8">Contact</h2>
        <p>
          Have questions or feedback? Visit our <a href="/contact" className="text-mint hover:text-mint-dark">contact page</a> to get in touch.
        </p>
      </div>
    </div>
  )
}
