import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllSlugs, getPostBySlug } from '@/data/blog'
import { generateBlogMetadata } from '@/lib/seo'
import { articleSchema, breadcrumbSchema } from '@/lib/schema'
import { getCategoryCounts, getPostsByCategory } from '@/data/blog'

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map((slug) => ({ slug: slug.split('/') }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params
  const slugStr = slug.join('/')
  const post = getPostBySlug(slugStr)
  if (!post) return { title: 'Post Not Found' }

  return generateBlogMetadata({
    slug: slugStr,
    title: post.title,
    description: post.description,
    publishedTime: post.publishedTime,
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const slugStr = slug.join('/')
  const post = getPostBySlug(slugStr)

  if (!post) notFound()

  const relatedPosts = getPostsByCategory(post.category).filter((p) => p.slug !== slugStr).slice(0, 3)
  const categories = getCategoryCounts()

  const jsonLd = [
    articleSchema(post.title, post.description, `/blog/${slugStr}`, post.publishedTime),
    breadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Blog', href: '/blog' },
      { name: post.title, href: `/blog/${slugStr}` },
    ]),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd.map((s) => JSON.stringify(s)).join('\n') }} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3">
            <div className="mb-6">
              <Link href="/blog" className="text-sm text-mint hover:text-mint-dark mb-4 inline-block">&larr; Back to guides</Link>
              <h1 className="text-3xl font-bold text-navy mb-3">{post.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="uppercase tracking-wide text-xs bg-gray-100 px-2 py-0.5 rounded">{post.category}</span>
                <span>{post.readingTime}</span>
                <span>{post.publishedTime}</span>
              </div>
            </div>

            <div
              className="prose prose-gray max-w-none prose-headings:text-navy prose-a:text-mint prose-a:no-underline hover:prose-a:underline prose-strong:text-navy text-gray-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-navy mb-3">Categories</h3>
                <div className="space-y-2">
                  {Object.entries(categories).map(([cat, count]) => (
                    <div key={cat} className="flex items-center justify-between text-sm">
                      <span className="capitalize text-gray-600">{cat}</span>
                      <span className="text-gray-400 text-xs">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-navy mb-3">Related Guides</h3>
                  <ul className="space-y-2">
                    {relatedPosts.map((rp) => (
                      <li key={rp.slug}>
                        <Link href={`/blog/${rp.slug}`} className="text-sm text-mint hover:text-mint-dark">
                          {rp.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-navy text-white rounded-xl p-4">
                <h3 className="text-sm font-semibold mb-2">Calculate Your Tax</h3>
                <p className="text-xs text-gray-300 mb-3">See exactly how much you take home after tax and NI.</p>
                <Link href="/" className="text-xs bg-mint text-white px-3 py-1.5 rounded-lg inline-block hover:bg-mint-dark transition-colors">
                  Use Calculator
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
