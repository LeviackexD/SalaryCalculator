import { Metadata } from 'next'
import { generateStaticMetadata } from '@/lib/seo'

export const metadata: Metadata = generateStaticMetadata(
  'Cookie Policy - UK Salary Calculator',
  'Cookie policy for UK Salary Calculator. Learn about the cookies we use, including essential and analytics cookies, and how to manage your preferences.',
  '/cookie-policy',
)

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-6">Cookie Policy</h1>
      <div className="prose prose-gray max-w-none text-gray-700 space-y-4 text-sm">
        <p><strong>Last updated:</strong> June 2024</p>

        <h2 className="text-lg font-semibold text-navy mt-6">What Are Cookies?</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and understand how you use the site.</p>

        <h2 className="text-lg font-semibold text-navy mt-6">Cookies We Use</h2>
        <p><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic features like page navigation.</p>
        <p><strong>Analytics Cookies:</strong> We use Google Analytics to understand how visitors interact with our site. This helps us improve our content and user experience. These cookies collect anonymised information about pages visited, time spent, and browser type.</p>

        <h2 className="text-lg font-semibold text-navy mt-6">Cookie List</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 font-medium">Cookie</th>
                <th className="text-left p-2 font-medium">Type</th>
                <th className="text-left p-2 font-medium">Purpose</th>
                <th className="text-left p-2 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="p-2 font-mono">_ga</td>
                <td className="p-2">Analytics</td>
                <td className="p-2">Google Analytics - user distinction</td>
                <td className="p-2">2 years</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="p-2 font-mono">_gid</td>
                <td className="p-2">Analytics</td>
                <td className="p-2">Google Analytics - session distinction</td>
                <td className="p-2">24 hours</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-semibold text-navy mt-6">Managing Cookies</h2>
        <p>You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. Instructions for common browsers:</p>
        <ul>
          <li><strong>Chrome:</strong> Settings &rarr; Privacy and security &rarr; Cookies and other site data</li>
          <li><strong>Firefox:</strong> Options &rarr; Privacy & Security &rarr; Cookies and Site Data</li>
          <li><strong>Safari:</strong> Preferences &rarr; Privacy &rarr; Cookies and website data</li>
          <li><strong>Edge:</strong> Settings &rarr; Cookies and site permissions &rarr; Cookies</li>
        </ul>

        <h2 className="text-lg font-semibold text-navy mt-6">Changes</h2>
        <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page.</p>

        <h2 className="text-lg font-semibold text-navy mt-6">Contact</h2>
        <p>If you have questions about our use of cookies, please <a href="/contact" className="text-mint hover:text-mint-dark">contact us</a>.</p>
      </div>
    </div>
  )
}
