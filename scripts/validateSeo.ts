import { getAllSalaries, getIndexingStatus } from '@/lib/crawlControl'
import { generateSalaryMetadata, generateHomepageMetadata, generateStaticMetadata } from '@/lib/seo'
import { calculateTakeHomePay } from '@/lib/taxCalculator'
import { getAllSlugs } from '@/data/blog'
import { getPageIntent } from '@/lib/intentMapping'
import type { TaxRegion } from '@/lib/types'

interface ValidationError {
  page: string
  issue: string
}

const errors: ValidationError[] = []

function check(condition: boolean, page: string, issue: string) {
  if (!condition) errors.push({ page, issue })
}

function validateSalarySlug(slug: string) {
  const match = slug.match(/^(\d{3,7})-(uk|scotland)$/)
  if (!match) {
    check(false, slug, `Invalid salary slug format: ${slug}`)
    return
  }

  const salary = parseInt(match[1])
  const region = match[2] as TaxRegion
  const { index, priority, tier } = getIndexingStatus(slug)
  const result = calculateTakeHomePay(salary, region)
  const meta = generateSalaryMetadata({
    slug,
    salary,
    region,
    taxYear: result.taxYear,
    netAnnual: result.netAnnual,
    effectiveTaxRate: result.effectiveTaxRate,
  })

  check(meta.title.length > 10, slug, 'Title too short')
  check(meta.title.length <= 70, slug, `Title too long (${meta.title.length} chars)`)
  check(meta.description.length > 50, slug, 'Description too short')
  check(meta.description.length <= 165, slug, `Description too long (${meta.description.length} chars)`)
  check(meta.alternates.canonical.includes(slug), slug, 'Canonical URL missing slug')
  check(meta.openGraph.type === 'website', slug, 'OG type should be website')
  check(meta.openGraph.locale === 'en_GB', slug, 'OG locale should be en_GB')

  if (!index) {
    check(tier === 3, slug, `Non-indexable but tier is ${tier}, expected 3`)
    check(priority === 0.3, slug, `Non-indexable priority should be 0.3, got ${priority}`)
  } else {
    check(tier === 1 || tier === 2, slug, `Indexable but tier is ${tier}, expected 1 or 2`)
    check(priority === (tier === 1 ? 0.9 : 0.6), slug, `Priority mismatch for tier ${tier}: ${priority}`)
  }
}

function validateBlogSlug(slug: string) {
  const intent = getPageIntent(`blog/${slug}`)
  check(intent.intent === 'informational', `blog/${slug}`, `Blog intent should be informational, got ${intent.intent}`)
}

function validateStaticPages() {
  const homeMeta = generateHomepageMetadata()
  check(homeMeta.title.length > 5, 'homepage', 'Homepage title too short')
  check(homeMeta.description.length > 50, 'homepage', 'Homepage description too short')
  check(homeMeta.alternates.canonical.includes('uksalarycalculator.com'), 'homepage', 'Homepage canonical should contain domain')
}

function validateTierIndexing() {
  const all = getAllSalaries()
  const tier1Indexable = all.filter((s) => s.tier === 1 && getIndexingStatus(s.slug).index)
  const tier2Indexable = all.filter((s) => s.tier === 2 && getIndexingStatus(s.slug).index)
  const tier3Noindex = all.filter((s) => s.tier === 3 && !getIndexingStatus(s.slug).index)

  check(tier1Indexable.length === all.filter((s) => s.tier === 1).length, 'crawl-control', `Not all Tier 1 pages are indexable`)
  check(tier2Indexable.length === all.filter((s) => s.tier === 2).length, 'crawl-control', `Not all Tier 2 pages are indexable`)
  check(tier3Noindex.length === all.filter((s) => s.tier === 3).length, 'crawl-control', `Not all Tier 3 pages are noindex`)
}

function validateMetadataPage(page: string, title: string, description: string) {
  check(title.length > 5, page, 'Title too short')
  check(title.length <= 70, page, `Title too long (${title.length} chars)`)
  check(description.length > 50, page, 'Description too short')
  check(description.length <= 165, page, `Description too long (${description.length} chars)`)
}

const STATIC_PAGES = [
  { path: '/about', meta: generateStaticMetadata('About', 'Learn about UK Salary Calculator and how our free tax calculator works.', '/about') },
  { path: '/privacy', meta: generateStaticMetadata('Privacy Policy', 'Privacy policy for UK Salary Calculator. Learn how we handle your data and cookies.', '/privacy') },
  { path: '/terms', meta: generateStaticMetadata('Terms of Use', 'Terms and conditions for using UK Salary Calculator. Free salary and tax calculation tool.', '/terms') },
  { path: '/contact', meta: generateStaticMetadata('Contact Us', 'Get in touch with the UK Salary Calculator team. Questions, feedback, or support requests.', '/contact') },
  { path: '/cookie-policy', meta: generateStaticMetadata('Cookie Policy', 'Cookie policy for UK Salary Calculator. Learn about cookies and how we use them.', '/cookie-policy') },
]

export function runSeoValidation(): ValidationError[] {
  errors.length = 0

  const allSalaries = getAllSalaries()
  const salarySlugs = allSalaries.map((s) => s.slug)
  const blogSlugs = getAllSlugs()

  for (const slug of salarySlugs) {
    validateSalarySlug(slug)
  }

  for (const slug of blogSlugs) {
    validateBlogSlug(slug)
  }

  validateStaticPages()

  for (const page of STATIC_PAGES) {
    validateMetadataPage(page.path, page.meta.title, page.meta.description)
  }

  validateTierIndexing()

  return errors
}

if (process.argv[1]?.endsWith('validateSeo.ts') || process.argv[1]?.endsWith('validateSeo.js')) {
  const found = runSeoValidation()
  if (found.length === 0) {
    console.log('✅ SEO validation passed: all pages valid')
    process.exit(0)
  } else {
    console.error(`❌ SEO validation failed: ${found.length} issue(s) found\n`)
    for (const err of found) {
      console.error(`  [${err.page}] ${err.issue}`)
    }
    process.exit(1)
  }
}
