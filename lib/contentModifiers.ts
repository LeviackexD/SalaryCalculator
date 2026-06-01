export type SalaryTier = 'low' | 'mid' | 'high' | 'premium'

export interface ContentModifiers {
  tier: SalaryTier
  label: string
  introModifier: string
  lifestyleNote: string
  suggestedRelated: string
}

const tierConfigs: Record<SalaryTier, ContentModifiers> = {
  low: {
    tier: 'low',
    label: 'Low Income',
    introModifier: 'On this salary, careful budgeting can help you make the most of your income.',
    lifestyleNote: 'This income level may qualify for various government benefits and tax credits.',
    suggestedRelated: 'budget-friendly',
  },
  mid: {
    tier: 'mid',
    label: 'Middle Income',
    introModifier: 'This salary provides a comfortable living standard in most parts of the UK.',
    lifestyleNote: 'You may have room for savings and discretionary spending after essentials.',
    suggestedRelated: 'mid-range',
  },
  high: {
    tier: 'high',
    label: 'High Income',
    introModifier: 'This salary places you well above the UK national average.',
    lifestyleNote: 'You may want to consider pension contributions and ISA allowances to optimize tax efficiency.',
    suggestedRelated: 'higher-rate',
  },
  premium: {
    tier: 'premium',
    label: 'Premium Income',
    introModifier: 'At this income level, tax planning becomes increasingly important.',
    lifestyleNote: 'You have entered the additional-rate tax band. Consider professional financial advice for tax optimisation.',
    suggestedRelated: 'additional-rate',
  },
}

export function getSalaryTier(amount: number): SalaryTier {
  if (amount <= 20000) return 'low'
  if (amount <= 55000) return 'mid'
  if (amount <= 100000) return 'high'
  return 'premium'
}

export function getContentModifiers(tier: SalaryTier): ContentModifiers {
  return tierConfigs[tier]
}

export function getSalaryTierForAmount(amount: number): ContentModifiers {
  return getContentModifiers(getSalaryTier(amount))
}
