import { Metadata } from 'next'
import { generateStaticMetadata } from '@/lib/seo'

export const metadata: Metadata = generateStaticMetadata(
  'Privacy Policy - UK Salary Calculator',
  'Privacy policy for UK Salary Calculator. Learn how we handle your data and what information we collect when you use our salary calculator tool.',
  '/privacy',
)

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-6">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none text-gray-700 space-y-4 text-sm">
        <p><strong>Last updated:</strong> June 2024</p>

        <h2 className="text-lg font-semibold text-navy mt-6">1. Introduction</h2>
        <p>UK Salary Calculator (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.</p>

        <h2 className="text-lg font-semibold text-navy mt-6">2. Information We Collect</h2>
        <p><strong>We do not collect any personal data.</strong> Our salary calculator runs entirely in your browser. Any salary figures you enter are processed client-side and are not sent to our servers.</p>
        <p>We may collect anonymous usage data through:</p>
        <ul>
          <li>Google Analytics (anonymised IP addresses, page views, browser type)</li>
          <li>Basic server logs (pages requested, timestamp, referring site)</li>
        </ul>

        <h2 className="text-lg font-semibold text-navy mt-6">3. Cookies</h2>
        <p>We use minimal cookies required for basic functionality:</p>
        <ul>
          <li>Essential cookies for website operation</li>
          <li>Analytics cookies (Google Analytics) to understand how visitors use our site</li>
        </ul>
        <p>You can control cookie settings through your browser preferences.</p>

        <h2 className="text-lg font-semibold text-navy mt-6">4. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li>Vercel (hosting and analytics)</li>
          <li>Google Analytics (usage analysis)</li>
        </ul>
        <p>These services have their own privacy policies governing data handling.</p>

        <h2 className="text-lg font-semibold text-navy mt-6">5. Data Security</h2>
        <p>We implement appropriate security measures to protect against unauthorised access to any information we hold. Since we don&apos;t collect personal data, there is minimal risk to your privacy when using our site.</p>

        <h2 className="text-lg font-semibold text-navy mt-6">6. Your Rights</h2>
        <p>Under UK data protection law, you have rights including:</p>
        <ul>
          <li>The right to be informed about how we use your data</li>
          <li>The right to request access to any data we hold about you</li>
          <li>The right to request deletion of your data</li>
        </ul>

        <h2 className="text-lg font-semibold text-navy mt-6">7. Contact</h2>
        <p>If you have questions about this Privacy Policy, please <a href="/contact" className="text-mint hover:text-mint-dark">contact us</a>.</p>
      </div>
    </div>
  )
}
