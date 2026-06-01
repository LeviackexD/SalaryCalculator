import { SITE_NAME, SITE_URL } from './constants'
import type { TaxRegion } from './types'

export function salaryWebApplicationSchema(salary: number, region: TaxRegion) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `£${salary.toLocaleString('en-GB')} Salary Calculator - ${region === 'scotland' ? 'Scotland' : 'UK'}`,
    url: `${SITE_URL}/salary/${salary}-${region}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
    },
    description: `Calculate take-home pay for a £${salary.toLocaleString('en-GB')} salary in ${region === 'scotland' ? 'Scotland' : 'the UK'} after Income Tax and National Insurance.`,
  }
}

export function faqPageSchema(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  }
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Free UK salary calculator and take-home pay tool.',
  }
}

export function articleSchema(title: string, description: string, urlPath: string, publishedTime?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${SITE_URL}${urlPath}`,
    ...(publishedTime ? { datePublished: publishedTime } : {}),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  }
}

export function howToSchema(steps: { name: string; text: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Calculate Your Take-Home Pay',
    description: 'Use our salary calculator to find your net income after tax and National Insurance.',
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}

export function buildJsonLd(...schemas: Record<string, unknown>[]): string {
  return schemas.map((s) => JSON.stringify(s)).join('\n')
}

export function buildJsonLdScripts(...schemas: Record<string, unknown>[]): { key: string; type: string; dangerouslySetInnerHTML: { __html: string } }[] {
  return schemas.map((schema, i) => ({
    key: `schema-${i}`,
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
  }))
}
