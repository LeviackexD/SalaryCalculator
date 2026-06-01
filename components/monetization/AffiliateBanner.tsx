// Affiliate banner placeholder — renders nothing until Fase 7 activation.
interface AffiliateBannerProps {
  position: 'sidebar' | 'content-bottom' | 'footer'
  className?: string
}

const AFFILIATE_ENABLED = false

const BANNER_TEXT: Record<string, string> = {
  'sidebar': 'Sponsored',
  'content-bottom': 'Recommended',
  'footer': 'Partner',
}

export default function AffiliateBanner({ position, className }: AffiliateBannerProps) {
  if (!AFFILIATE_ENABLED) return null

  return (
    <div
      className={`border border-gray-200 rounded-xl p-4 bg-gray-50 text-center text-sm text-gray-400 ${className ?? ''}`}
      data-affiliate-position={position}
    >
      {BANNER_TEXT[position] ?? 'Advertisement'}
    </div>
  )
}
