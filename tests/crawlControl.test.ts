import { describe, it, expect } from 'vitest'
import {
  getPageTier,
  getIndexingStatus,
  getNoindexMeta,
  getAllSalaries,
  getSalariesByTier,
  getTier1Slugs,
} from '@/lib/crawlControl'

describe('Crawl Control & Tier System', () => {
  it('should classify Tier 1 UK salaries', () => {
    expect(getPageTier('35000-uk')).toBe(1)
    expect(getPageTier('50000-uk')).toBe(1)
    expect(getPageTier('100000-uk')).toBe(1)
  })

  it('should classify Tier 1 Scotland salaries', () => {
    expect(getPageTier('35000-scotland')).toBe(1)
    expect(getPageTier('50000-scotland')).toBe(1)
  })

  it('should classify Tier 2 salaries', () => {
    const all = getAllSalaries()
    const tier2 = all.filter((s) => s.tier === 2)
    expect(tier2.length).toBeGreaterThan(50)
    expect(getPageTier('16000-uk')).toBe(2)
    expect(getPageTier('23000-uk')).toBe(2)
  })

  it('should classify Tier 3 salaries', () => {
    expect(getPageTier('10250-uk')).toBe(3)
    expect(getPageTier('13750-uk')).toBe(3)
    expect(getPageTier('37250-uk')).toBe(3)
  })

  it('should return fallback tier 3 for invalid slugs', () => {
    expect(getPageTier('invalid')).toBe(3)
    expect(getPageTier('')).toBe(3)
  })

  it('should return indexable for Tier 1 and 2', () => {
    expect(getIndexingStatus('35000-uk').index).toBe(true)
    expect(getIndexingStatus('16000-uk').index).toBe(true)
  })

  it('should return noindex for Tier 3', () => {
    const status = getIndexingStatus('10250-uk')
    expect(status.index).toBe(false)
    expect(status.priority).toBe(0.3)
  })

  it('should return correct priorities per tier', () => {
    expect(getIndexingStatus('35000-uk').priority).toBe(0.9)
    expect(getIndexingStatus('16000-uk').priority).toBe(0.6)
    expect(getIndexingStatus('10250-uk').priority).toBe(0.3)
  })

  it('should return robots meta for tier 3', () => {
    const meta = getNoindexMeta('10250-uk')
    expect(meta).toEqual({ index: false, follow: true })
  })

  it('should return null robots meta for tier 1', () => {
    expect(getNoindexMeta('35000-uk')).toBeNull()
  })

  it('should have all tiers producing total pages', () => {
    const all = getAllSalaries()
    const t1 = getSalariesByTier(1)
    const t2 = getSalariesByTier(2)
    const t3 = getSalariesByTier(3)
    expect(all.length).toBe(t1.length + t2.length + t3.length)
  })

  it('should have Tier 1 slugs for static generation', () => {
    const slugs = getTier1Slugs()
    expect(slugs.length).toBeGreaterThan(50)
    expect(slugs).toContain('35000-uk')
    expect(slugs).toContain('35000-scotland')
  })

  it('should have non-overlapping tier 1 slugs', () => {
    const slugs = getTier1Slugs()
    const unique = new Set(slugs)
    expect(unique.size).toBe(slugs.length)
  })
})
