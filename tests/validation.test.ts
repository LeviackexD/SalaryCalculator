import { describe, it, expect } from 'vitest'
import { getAllSalaries } from '@/lib/crawlControl'
import { generateSalaryMetadata, generateHomepageMetadata, generateStaticMetadata } from '@/lib/seo'
import { calculateTakeHomePay } from '@/lib/taxCalculator'
import { getAllSlugs } from '@/data/blog'

describe('SEO Validation', () => {
  describe('Salary page metadata', () => {
    const allSalaries = getAllSalaries()

    it('should have no duplicate slugs', () => {
      const slugs = allSalaries.map((s) => s.slug)
      expect(new Set(slugs).size).toBe(slugs.length)
    })

    it('should generate valid metadata for every salary entry', () => {
      for (const entry of allSalaries) {
        const result = calculateTakeHomePay(entry.amount, entry.region)
        const meta = generateSalaryMetadata({
          slug: entry.slug,
          salary: entry.amount,
          region: entry.region,
          taxYear: result.taxYear,
          netAnnual: result.netAnnual,
          effectiveTaxRate: result.effectiveTaxRate,
        })

        expect(meta.title.length).toBeGreaterThan(10)
        expect(meta.title.length).toBeLessThanOrEqual(70)
        expect(meta.description.length).toBeGreaterThan(50)
        expect(meta.description.length).toBeLessThanOrEqual(165)
        expect(meta.alternates.canonical).toContain(entry.slug)
        expect(meta.openGraph.locale).toBe('en_GB')
        expect(meta.openGraph.type).toBe('website')
      }
    })
  })

  describe('Blog page metadata', () => {
    const slugs = getAllSlugs()

    it('should have unique blog slugs', () => {
      expect(new Set(slugs).size).toBe(slugs.length)
    })

    it('should have at least 15 blog posts', () => {
      expect(slugs.length).toBeGreaterThanOrEqual(15)
    })

    it('should have categories in slugs', () => {
      for (const slug of slugs) {
        expect(slug).toMatch(/^(tax|salary|comparison)\//)
      }
    })
  })

  describe('Static page metadata', () => {
    const pages = [
      { path: '/about', title: 'About' },
      { path: '/privacy', title: 'Privacy Policy' },
      { path: '/terms', title: 'Terms of Use' },
      { path: '/contact', title: 'Contact Us' },
      { path: '/cookie-policy', title: 'Cookie Policy' },
    ]

    for (const page of pages) {
      it(`should generate valid metadata for ${page.path}`, () => {
        const meta = generateStaticMetadata(page.title, `Description for ${page.path}`, page.path)
        expect(meta.title).toBe(page.title)
        expect(meta.alternates.canonical).toContain(page.path)
        expect(meta.description.length).toBeGreaterThan(0)
      })
    }
  })

  describe('Homepage metadata', () => {
    it('should generate valid homepage metadata', () => {
      const meta = generateHomepageMetadata()
      expect(meta.title.length).toBeGreaterThan(5)
      expect(meta.description.length).toBeGreaterThan(50)
      expect(meta.alternates.canonical).toContain('uksalarycalculator.com')
      expect(meta.openGraph.type).toBe('website')
    })
  })

  describe('Tier indexing consistency', () => {
    const all = getAllSalaries()
    const t1 = all.filter((s) => s.tier === 1)
    const t2 = all.filter((s) => s.tier === 2)
    const t3 = all.filter((s) => s.tier === 3)

    it('should have all Tier 1 salaries >= 10000', () => {
      for (const entry of t1) {
        expect(entry.amount).toBeGreaterThanOrEqual(10000)
      }
    })

    it('should have all salaries <= 150000', () => {
      for (const entry of all) {
        expect(entry.amount).toBeLessThanOrEqual(150000)
      }
    })

    it('should have no overlapping salaries between tiers', () => {
      const t1Amounts = new Set(t1.map((s) => s.amount))
      const t2Amounts = new Set(t2.map((s) => s.amount))
      const t3Amounts = new Set(t3.map((s) => s.amount))

      for (const amount of t1Amounts) {
        expect(t2Amounts.has(amount)).toBe(false)
        expect(t3Amounts.has(amount)).toBe(false)
      }
      for (const amount of t2Amounts) {
        expect(t3Amounts.has(amount)).toBe(false)
      }
    })

    it('should have correct total page count', () => {
      expect(all.length).toBe(228)
    })
  })

  describe('Content quality', () => {
    it('should have no placeholder content in blog posts', async () => {
      const { getAllPosts } = await import('@/data/blog')
      const posts = getAllPosts()
      for (const post of posts) {
        expect(post.content.length).toBeGreaterThan(500)
        expect(post.content).not.toContain('Lorem ipsum')
      }
    })
  })
})
