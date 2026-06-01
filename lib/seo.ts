import type { TaxRegion, TaxYear } from './types'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, REGION_SHORT_LABELS, TAX_YEAR_LABELS } from './constants'
import { formatCurrency } from './formatters'

export interface SalaryPageMetadataInput {
  slug: string
  salary: number
  region: TaxRegion
  taxYear: TaxYear
  netAnnual: number
  effectiveTaxRate: number
}

export interface BlogMetadataInput {
  slug: string
  title: string
  description: string
  publishedTime?: string
  author?: string
}

export function generateSalaryMetadata(input: SalaryPageMetadataInput) {
  const { salary, region, taxYear, netAnnual, effectiveTaxRate } = input
  const regionShort = REGION_SHORT_LABELS[region]
  const taxYearLabel = TAX_YEAR_LABELS[taxYear]
  const grossFormatted = formatCurrency(salary)
  const netFormatted = formatCurrency(netAnnual)

  const title = `Take Home Pay Calculator for ${grossFormatted} Salary in ${regionShort} (${taxYearLabel})`
  const description = `Take-home pay on ${grossFormatted} in ${regionShort}: net ${netFormatted}/yr (${effectiveTaxRate.toFixed(1)}% tax). Free UK salary calculator.`
  const url = `${SITE_URL}/salary/${salary}-${region}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website' as const,
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
    },
    alternates: { canonical: url },
  }
}

export function generateHourlyMetadata(rate: number, region: TaxRegion, taxYear: TaxYear) {
  const regionShort = REGION_SHORT_LABELS[region]
  const taxYearLabel = TAX_YEAR_LABELS[taxYear]

  const title = `£${rate} Per Hour After Tax in ${regionShort} (${taxYearLabel})`
  const description = `Take-home pay at £${rate}/hr in ${regionShort}: annual salary, tax, NI, and net income. Free hourly wage tax calculator.`
  const url = `${SITE_URL}/hourly/${rate}-${region}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website' as const,
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
    },
    alternates: { canonical: url },
  }
}

export function generateHomepageMetadata() {
  return {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    openGraph: {
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      siteName: SITE_NAME,
      type: 'website' as const,
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    alternates: { canonical: SITE_URL },
  }
}

export function generateBlogMetadata(input: BlogMetadataInput) {
  const url = `${SITE_URL}/blog/${input.slug}`

  return {
    title: input.title,
    description: input.description,
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      type: 'article' as const,
      locale: 'en_GB',
      publishedTime: input.publishedTime,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: input.title,
      description: input.description,
    },
    alternates: { canonical: url },
  }
}

export function generateStaticMetadata(title: string, description: string, path: string) {
  const url = `${SITE_URL}${path}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website' as const,
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
    },
    alternates: { canonical: url },
  }
}
