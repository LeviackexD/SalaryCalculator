// Affiliate link placeholder — renders as plain link until Fase 7 activation.
// When ready: swap href with affiliate-tagged URL.
interface AffiliateLinkProps {
  href: string
  label: string
  className?: string
}

const AFFILIATE_ENABLED = false

export default function AffiliateLink({ href, label, className }: AffiliateLinkProps) {
  if (!AFFILIATE_ENABLED) {
    return (
      <span className={`text-gray-400 cursor-not-allowed ${className ?? ''}`}>
        {label}
      </span>
    )
  }

  return (
    <a
      href={href}
      rel="sponsored noopener noreferrer"
      target="_blank"
      className={`text-mint hover:text-mint-dark transition-colors ${className ?? ''}`}
    >
      {label}
    </a>
  )
}
