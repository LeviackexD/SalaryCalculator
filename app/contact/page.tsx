import { Metadata } from 'next'
import { generateStaticMetadata } from '@/lib/seo'

export const metadata: Metadata = generateStaticMetadata(
  'Contact - UK Salary Calculator',
  'Get in touch with the UK Salary Calculator team. Send us your questions, feedback, or suggestions about our salary and tax calculation tools.',
  '/contact',
)

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-6">Contact Us</h1>
      <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
        <p>
          Have a question, suggestion, or feedback about UK Salary Calculator? We&apos;d love to hear from you.
        </p>
        <p>
          Please email us at: <a href="mailto:hello@uksalarycalculator.com" className="text-mint hover:text-mint-dark">hello@uksalarycalculator.com</a>
        </p>
        <p className="text-sm text-gray-500 mt-8">
          We aim to respond to all enquiries within 2-3 business days. Please note that we cannot provide
          personalised tax advice — for specific tax questions, please consult HMRC or a qualified tax professional.
        </p>
      </div>
    </div>
  )
}
