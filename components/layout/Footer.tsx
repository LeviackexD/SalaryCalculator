import Link from 'next/link'

const footerLinks = [
  {
    label: 'Calculators',
    links: [
      { href: '/salary/35000-uk', label: '£35,000 Salary' },
      { href: '/salary/50000-uk', label: '£50,000 Salary' },
      { href: '/salary/25000-uk', label: '£25,000 Salary' },
      { href: '/salary/100000-uk', label: '£100,000 Salary' },
    ],
  },
  {
    label: 'Scotland',
    links: [
      { href: '/salary/35000-scotland', label: '£35,000 Scotland' },
      { href: '/salary/50000-scotland', label: '£50,000 Scotland' },
      { href: '/scotland-vs-uk-salary-tax-difference', label: 'Scotland vs UK Tax' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { href: '/blog/tax/how-income-tax-works-uk', label: 'How Tax Works' },
      { href: '/blog/tax/understanding-national-insurance', label: 'NI Guide' },
      { href: '/about', label: 'About' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-gray-400 mt-16">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {footerLinks.map((group) => (
            <div key={group.label}>
              <h4 className="text-white font-semibold mb-3 text-sm">{group.label}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-mint transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-xs text-center">
          <p>&copy; {new Date().getFullYear()} UK Salary Calculator. All rights reserved.</p>
          <p className="mt-1">
            This site provides estimates only. Always consult HMRC or a qualified tax adviser for official tax calculations.
          </p>
        </div>
      </div>
    </footer>
  )
}
