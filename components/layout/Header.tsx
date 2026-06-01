import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-navy text-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          UK Salary Calculator
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-mint transition-colors">
            Home
          </Link>
          <Link href="/blog/tax/how-income-tax-works-uk" className="hover:text-mint transition-colors">
            Guides
          </Link>
          <Link href="/about" className="hover:text-mint transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}
