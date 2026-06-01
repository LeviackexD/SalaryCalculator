import Link from 'next/link'
import { Metadata } from 'next'
import { getAllPosts, getCategoryCounts } from '@/data/blog'

export const metadata: Metadata = {
  title: 'UK Salary & Tax Guides',
  description: 'Expert guides on UK income tax, National Insurance, salary comparisons, and personal finance. Learn how tax bands work and optimise your take-home pay.',
  alternates: { canonical: 'https://www.uksalarycalculator.com/blog' },
}

export default function BlogIndex() {
  const posts = getAllPosts()
  const categories = getCategoryCounts()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-2">UK Salary &amp; Tax Guides</h1>
      <p className="text-gray-600 mb-6">
        Expert articles about UK income tax, National Insurance, salary comparisons, and personal finance.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-sm text-gray-500 mr-1 font-medium">Categories:</span>
        {Object.entries(categories).map(([cat, count]) => (
          <span key={cat} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full capitalize">
            {cat} ({count})
          </span>
        ))}
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-mint hover:shadow-sm transition-all">
            <Link href={`/blog/${post.slug}`}>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="uppercase tracking-wide">{post.category}</span>
                <span>&middot;</span>
                <span>{post.readingTime}</span>
              </div>
              <h2 className="text-lg font-semibold text-navy mb-2 hover:text-mint transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600">{post.description}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
