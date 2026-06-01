import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'
import { getAllSalaries } from '@/lib/crawlControl'
import { getIndexingStatus } from '@/lib/crawlControl'

const STATIC_PAGES = [
  { url: SITE_URL, priority: 1.0, freq: 'weekly' as const },
  { url: `${SITE_URL}/scotland-vs-uk-salary-tax-difference`, priority: 0.8, freq: 'weekly' as const },
  { url: `${SITE_URL}/about`, priority: 0.3, freq: 'monthly' as const },
  { url: `${SITE_URL}/privacy`, priority: 0.2, freq: 'monthly' as const },
  { url: `${SITE_URL}/terms`, priority: 0.2, freq: 'monthly' as const },
  { url: `${SITE_URL}/contact`, priority: 0.2, freq: 'monthly' as const },
  { url: `${SITE_URL}/cookie-policy`, priority: 0.2, freq: 'monthly' as const },
  { url: `${SITE_URL}/blog`, priority: 0.8, freq: 'weekly' as const },
]

const BLOG_SLUGS = [
  'tax/how-income-tax-works-uk',
  'tax/scotland-vs-uk-tax-differences',
  'tax/understanding-national-insurance',
  'tax/what-is-the-60-tax-trap',
  'tax/tax-free-allowance-uk-explained',
  'tax/national-insurance-rate-cuts-2025-2026',
  'tax/scottish-income-tax-2025-2026',
  'salary/what-is-a-good-salary-in-the-uk',
  'salary/average-salary-uk-2025',
  'salary/minimum-wage-vs-living-wage-uk',
  'salary/graduate-salaries-uk-2025',
  'salary/how-to-calculate-hourly-rate-from-annual-salary',
  'comparison/contractor-vs-permanent-salary',
  'comparison/london-vs-rest-of-uk-salaries',
  'comparison/uk-tax-2024-25-vs-2025-26',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const salaries = getAllSalaries()

  const salaryPages: MetadataRoute.Sitemap = salaries
    .filter((s) => {
      const { index } = getIndexingStatus(s.slug)
      return index
    })
    .map((s) => ({
      url: `${SITE_URL}/salary/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: getIndexingStatus(s.slug).priority,
    }))

  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: p.url,
    lastModified: new Date(),
    changeFrequency: p.freq,
    priority: p.priority,
  }))

  return [...staticPages, ...salaryPages, ...blogPages]
}
