export type IntentType =
  | 'transactional'
  | 'comparison'
  | 'evaluation'
  | 'informational'

export interface PageIntent {
  intent: IntentType
  primaryKeyword: string
  modifiers: string[]
}

const salarySlugPattern = /^(\d{3,7})-(uk|scotland)$/
const hourlySlugPattern = /^(\d{1,3}(?:\.\d{1,2})?)-(uk|scotland)$/
const evaluationPattern = /^how-much-is-(\d{3,7})-after-tax-(uk|scotland)$/

export function getPageIntent(slug: string): PageIntent {
  const salaryMatch = slug.match(salarySlugPattern)
  if (salaryMatch) {
    const amount = salaryMatch[1]
    const region = salaryMatch[2]
    return {
      intent: 'transactional',
      primaryKeyword: `${amount} after tax ${region === 'scotland' ? 'scotland' : 'uk'}`,
      modifiers: [region === 'scotland' ? 'scotland' : 'uk', 'salary'],
    }
  }

  const hourlyMatch = slug.match(hourlySlugPattern)
  if (hourlyMatch) {
    const rate = hourlyMatch[1]
    const region = hourlyMatch[2]
    return {
      intent: 'transactional',
      primaryKeyword: `${rate} per hour after tax ${region === 'scotland' ? 'scotland' : 'uk'}`,
      modifiers: [region === 'scotland' ? 'scotland' : 'uk', 'hourly'],
    }
  }

  const evaluationMatch = slug.match(evaluationPattern)
  if (evaluationMatch) {
    const amount = evaluationMatch[1]
    const region = evaluationMatch[2]
    return {
      intent: 'evaluation',
      primaryKeyword: `how much is ${amount} after tax in ${region === 'scotland' ? 'scotland' : 'the uk'}`,
      modifiers: [region === 'scotland' ? 'scotland' : 'uk', 'evaluation'],
    }
  }

  if (slug.includes('scotland-vs-uk') || slug.includes('compare')) {
    return {
      intent: 'comparison',
      primaryKeyword: 'scotland vs uk salary tax comparison',
      modifiers: ['comparison', 'scotland', 'uk'],
    }
  }

  if (slug.startsWith('blog/') || slug.startsWith('blog')) {
    const topic = slug.replace('blog/', '').split('/')[0]
    return {
      intent: 'informational',
      primaryKeyword: slug.replace(/[/-]/g, ' '),
      modifiers: ['blog', topic],
    }
  }

  return {
    intent: 'informational',
    primaryKeyword: slug.replace(/[/-]/g, ' '),
    modifiers: [],
  }
}

export function getIntentType(slug: string): IntentType {
  return getPageIntent(slug).intent
}
