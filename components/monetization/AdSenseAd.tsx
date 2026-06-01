// AdSense ad placeholder — renders nothing until Fase 7 activation.
// When ready: replace with <ins className="adsbygoogle"> using NEXT_PUBLIC_ADSENSE_ID.
interface AdSenseAdProps {
  format?: 'horizontal' | 'vertical' | 'rectangle'
  className?: string
}

const AD_ENABLED = false

export default function AdSenseAd({ format, className }: AdSenseAdProps) {
  if (!AD_ENABLED) return null

  return (
    <div className={`ad-container ${className ?? ''}`} data-ad-format={format ?? 'horizontal'}>
      {/* <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format={format === 'vertical' ? 'auto' : 'horizontal'}
      /> */}
    </div>
  )
}
