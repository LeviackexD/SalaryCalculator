import { describe, it, expect } from 'vitest'
import { getPageIntent } from '@/lib/intentMapping'
import { getSalaryTier, getSalaryTierForAmount } from '@/lib/contentModifiers'
import { getRelatedSalaries, getCrossRegionSalaryUrl, getCrossRegionLabel, getIntentLinks, getBlogLinks } from '@/lib/internalLinks'
import {
  generateSalaryMetadata,
  generateHomepageMetadata,
  generateBlogMetadata,
  generateStaticMetadata,
} from '@/lib/seo'
import {
  salaryWebApplicationSchema,
  faqPageSchema,
  breadcrumbSchema,
  organizationSchema,
  articleSchema,
  howToSchema,
} from '@/lib/schema'

describe('Intent Mapping', () => {
  it('should detect transactional intent for salary slug', () => {
    const intent = getPageIntent('35000-uk')
    expect(intent.intent).toBe('transactional')
    expect(intent.primaryKeyword).toContain('35000')
    expect(intent.primaryKeyword).toContain('uk')
  })

  it('should detect transactional intent for Scotland salary', () => {
    const intent = getPageIntent('35000-scotland')
    expect(intent.intent).toBe('transactional')
    expect(intent.primaryKeyword).toContain('scotland')
  })

  it('should detect transactional intent for hourly slug', () => {
    const intent = getPageIntent('20-uk')
    expect(intent.intent).toBe('transactional')
    expect(intent.primaryKeyword).toContain('per hour')
  })

  it('should detect evaluation intent', () => {
    const intent = getPageIntent('how-much-is-50000-after-tax-uk')
    expect(intent.intent).toBe('evaluation')
    expect(intent.primaryKeyword).toContain('50000')
  })

  it('should detect comparison intent', () => {
    const intent = getPageIntent('scotland-vs-uk-salary-tax-difference')
    expect(intent.intent).toBe('comparison')
  })

  it('should detect informational intent for blog', () => {
    const intent = getPageIntent('blog/tax/how-income-tax-works-uk')
    expect(intent.intent).toBe('informational')
  })

  it('should fallback to informational for unknown slug', () => {
    const intent = getPageIntent('some-random-page')
    expect(intent.intent).toBe('informational')
  })
})

describe('Content Modifiers', () => {
  it('should return low tier for salary <= 20000', () => {
    expect(getSalaryTier(15000)).toBe('low')
    expect(getSalaryTier(20000)).toBe('low')
  })

  it('should return mid tier for salary 20001-55000', () => {
    expect(getSalaryTier(25000)).toBe('mid')
    expect(getSalaryTier(55000)).toBe('mid')
  })

  it('should return high tier for salary 55001-100000', () => {
    expect(getSalaryTier(60000)).toBe('high')
    expect(getSalaryTier(100000)).toBe('high')
  })

  it('should return premium tier for salary > 100000', () => {
    expect(getSalaryTier(125000)).toBe('premium')
    expect(getSalaryTier(150000)).toBe('premium')
  })

  it('should return modifiers for each tier', () => {
    const low = getSalaryTierForAmount(15000)
    expect(low.lifestyleNote).toContain('benefits')

    const premium = getSalaryTierForAmount(150000)
    expect(premium.lifestyleNote).toContain('additional-rate')
  })
})

describe('Internal Links', () => {
  it('should return related salaries for UK', () => {
    const links = getRelatedSalaries(35000, 'uk')
    expect(links.length).toBeGreaterThan(0)
    links.forEach((link) => {
      expect(link.url).toContain('/salary/')
      expect(link.region).toBe('uk')
    })
  })

  it('should return related salaries for Scotland', () => {
    const links = getRelatedSalaries(35000, 'scotland')
    expect(links.length).toBeGreaterThan(0)
    links.forEach((link) => {
      expect(link.url).toContain('/salary/')
      expect(link.region).toBe('scotland')
    })
  })

  it('should generate cross-region URL', () => {
    const url = getCrossRegionSalaryUrl(35000, 'uk')
    expect(url).toBe('/salary/35000-scotland')
  })

  it('should generate cross-region label', () => {
    const label = getCrossRegionLabel(35000, 'uk')
    expect(label).toContain('Scotland')
  })

  it('should return intent links for salary slug', () => {
    const links = getIntentLinks('35000-uk')
    expect(links.length).toBeGreaterThanOrEqual(3)
    expect(links.some((l) => l.intent === 'cross-region')).toBe(true)
    expect(links.some((l) => l.intent === 'comparison')).toBe(true)
    expect(links.some((l) => l.intent === 'related')).toBe(true)
  })

  it('should return blog links', () => {
    const links = getBlogLinks()
    expect(links.length).toBeGreaterThanOrEqual(4)
    expect(links[0].url).toContain('/blog/')
  })
})

describe('SEO Metadata', () => {
  it('should generate salary metadata', () => {
    const meta = generateSalaryMetadata({
      slug: '35000-uk',
      salary: 35000,
      region: 'uk',
      taxYear: '2024-25',
      netAnnual: 27364,
      effectiveTaxRate: 21.8,
    })
    expect(meta.title).toContain('£35,000')
    expect(meta.title).toContain('UK')
    expect(meta.description).toContain('£27,364')
    expect(meta.alternates.canonical).toContain('/salary/35000-uk')
    expect(meta.openGraph.type).toBe('website')
  })

  it('should generate homepage metadata', () => {
    const meta = generateHomepageMetadata()
    expect(meta.title).toBeDefined()
    expect(meta.description).toContain('salary calculator')
    expect(meta.openGraph.type).toBe('website')
  })

  it('should generate blog metadata', () => {
    const meta = generateBlogMetadata({
      slug: 'tax/how-income-tax-works-uk',
      title: 'How Income Tax Works in the UK',
      description: 'A complete guide to UK income tax bands.',
    })
    expect(meta.title).toContain('How Income Tax Works')
    expect(meta.openGraph.type).toBe('article')
    expect(meta.alternates.canonical).toContain('/blog/tax/how-income-tax-works-uk')
  })

  it('should generate static page metadata', () => {
    const meta = generateStaticMetadata('About Us', 'About UK Salary Calculator', '/about')
    expect(meta.title).toBe('About Us')
    expect(meta.alternates.canonical).toContain('/about')
  })
})

describe('Schema.org', () => {
  it('should generate WebApplication schema', () => {
    const schema = salaryWebApplicationSchema(35000, 'uk')
    expect(schema['@type']).toBe('WebApplication')
    expect(schema.name).toContain('£35,000')
    expect(schema.offers.price).toBe('0')
  })

  it('should generate FAQ schema', () => {
    const schema = faqPageSchema([
      { question: 'Q1?', answer: 'A1.' },
      { question: 'Q2?', answer: 'A2.' },
    ])
    expect(schema['@type']).toBe('FAQPage')
    expect(schema.mainEntity).toHaveLength(2)
    expect(schema.mainEntity[0].name).toBe('Q1?')
  })

  it('should generate BreadcrumbList schema', () => {
    const schema = breadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Salary', href: '/salary/35000-uk' },
    ])
    expect(schema['@type']).toBe('BreadcrumbList')
    expect(schema.itemListElement).toHaveLength(2)
    expect(schema.itemListElement[1].position).toBe(2)
  })

  it('should generate Organization schema', () => {
    const schema = organizationSchema()
    expect(schema['@type']).toBe('Organization')
    expect(schema.name).toBeDefined()
  })

  it('should generate Article schema', () => {
    const schema = articleSchema('Test Title', 'Test desc', '/blog/test')
    expect(schema['@type']).toBe('Article')
    expect(schema.headline).toBe('Test Title')
  })

  it('should generate HowTo schema', () => {
    const schema = howToSchema([
      { name: 'Enter salary', text: 'Enter your annual salary' },
      { name: 'See results', text: 'View your take-home pay' },
    ])
    expect(schema['@type']).toBe('HowTo')
    expect(schema.step).toHaveLength(2)
  })
})
