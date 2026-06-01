import { Metadata } from 'next'
import { generateStaticMetadata } from '@/lib/seo'

export const metadata: Metadata = generateStaticMetadata(
  'Terms of Use - UK Salary Calculator',
  'Terms and conditions for using UK Salary Calculator. Understand the terms governing your use of our salary and tax calculation tools.',
  '/terms',
)

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-6">Terms of Use</h1>
      <div className="prose prose-gray max-w-none text-gray-700 space-y-4 text-sm">
        <p><strong>Last updated:</strong> June 2024</p>

        <h2 className="text-lg font-semibold text-navy mt-6">1. Acceptance of Terms</h2>
        <p>By using UK Salary Calculator, you agree to these terms of use. If you do not agree, please do not use our website.</p>

        <h2 className="text-lg font-semibold text-navy mt-6">2. Service Description</h2>
        <p>UK Salary Calculator provides free online tools for estimating take-home pay after tax and National Insurance. All calculations are estimates and should not be considered as financial advice.</p>

        <h2 className="text-lg font-semibold text-navy mt-6">3. Accuracy of Information</h2>
        <p>While we strive to keep tax bands and rates up to date, we make no warranties about the accuracy, completeness, or timeliness of the information provided. Tax laws and rates may change, and individual circumstances vary. Always verify with HMRC or a qualified tax professional.</p>

        <h2 className="text-lg font-semibold text-navy mt-6">4. No Financial Advice</h2>
        <p>UK Salary Calculator does not provide financial, legal, or tax advice. Our calculators are for informational and educational purposes only. You should consult a qualified professional for advice tailored to your specific situation.</p>

        <h2 className="text-lg font-semibold text-navy mt-6">5. Intellectual Property</h2>
        <p>All content on this website, including text, graphics, and tools, is the property of UK Salary Calculator unless otherwise stated. You may not reproduce, distribute, or modify our content without permission.</p>

        <h2 className="text-lg font-semibold text-navy mt-6">6. Limitation of Liability</h2>
        <p>UK Salary Calculator shall not be liable for any damages arising from your use of or inability to use our website or tools. We provide our services &quot;as is&quot; without any warranty.</p>

        <h2 className="text-lg font-semibold text-navy mt-6">7. Changes to Terms</h2>
        <p>We reserve the right to update these terms at any time. Changes will be posted on this page with an updated date.</p>

        <h2 className="text-lg font-semibold text-navy mt-6">8. Contact</h2>
        <p>For questions about these terms, please <a href="/contact" className="text-mint hover:text-mint-dark">contact us</a>.</p>
      </div>
    </div>
  )
}
