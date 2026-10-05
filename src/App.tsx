import { useState, useEffect, useCallback } from 'react'
import { CHAIN_NAMES } from './lib/config'
import { ComplianceBadge } from './components/ComplianceBadge'

declare global {
  interface Window {
    ethereum?: {
      chainId: string | null
      selectedAddress: string | null
      isConnected: () => boolean
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void
    }
  }
}

function truncateAddr(addr: string) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '—'
}

export default function App() {
  const [chainId, setChainId] = useState<string | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [blockNumber, setBlockNumber] = useState<string | null>(null)
  const [gasPrice, setGasPrice] = useState<string | null>(null)
  const [hasProvider, setHasProvider] = useState(false)

  const refresh = useCallback(async () => {
    const eth = window.ethereum
    if (!eth) return
    try {
      const block = (await eth.request({ method: 'eth_blockNumber' })) as string
      setBlockNumber(block)
      const gas = (await eth.request({ method: 'eth_gasPrice' })) as string
      setGasPrice(gas)
    } catch {}
  }, [])

  useEffect(() => {
    const eth = window.ethereum
    if (!eth) return
    setHasProvider(true)
    setChainId(eth.chainId)
    setAddress(eth.selectedAddress)
    setConnected(eth.isConnected())

    const onChain = (id: unknown) => setChainId(id as string)
    const onAccounts = (accs: unknown) => {
      const list = accs as string[]
      setAddress(list[0] ?? null)
    }
    eth.on('chainChanged', onChain)
    eth.on('accountsChanged', onAccounts)
    refresh()
    const interval = setInterval(refresh, 12_000)

    return () => {
      eth.removeListener('chainChanged', onChain)
      eth.removeListener('accountsChanged', onAccounts)
      clearInterval(interval)
    }
  }, [refresh])

  const chainName = chainId ? CHAIN_NAMES[chainId] ?? 'Unknown' : '—'

  return (
    <div className="dashboard">
      <header>
        <h1>⚡ Chain Pulse</h1>
        {hasProvider && (
          <ComplianceBadge chainId={chainId} address={address} connected={connected} />
        )}
      </header>

      <div className="grid">
        <div className="card">
          <h2>Network Status</h2>
          {hasProvider ? (
            <dl>
              <dt>Chain</dt>
              <dd>{chainName} ({chainId})</dd>
              <dt>Block</dt>
              <dd>{blockNumber ? parseInt(blockNumber, 16).toLocaleString() : '—'}</dd>
              <dt>Gas Price</dt>
              <dd>{gasPrice ? `${(parseInt(gasPrice, 16) / 1e9).toFixed(1)} gwei` : '—'}</dd>
              <dt>Status</dt>
              <dd style={{ color: connected ? '#22c55e' : '#ef4444' }}>
                {connected ? '● Connected' : '● Disconnected'}
              </dd>
            </dl>
          ) : (
            <p className="muted">No wallet detected</p>
          )}
        </div>

        <div className="card">
          <h2>Wallet</h2>
          {address ? (
            <dl>
              <dt>Address</dt>
              <dd className="mono">{truncateAddr(address)}</dd>
              <dt>Chain ID</dt>
              <dd className="mono">{chainId} ({chainId ? parseInt(chainId, 16) : '—'})</dd>
            </dl>
          ) : (
            <p className="muted">No wallet connected</p>
          )}
        </div>

        <div className="card">
          <h2>Environment</h2>
          <dl>
            <dt>User Agent</dt>
            <dd>{navigator.userAgent.slice(0, 80)}</dd>
            <dt>Screen</dt>
            <dd>{screen.width}×{screen.height} @{devicePixelRatio}x</dd>
            <dt>CPU Cores</dt>
            <dd>{navigator.hardwareConcurrency}</dd>
            <dt>Platform</dt>
            <dd>{navigator.platform}</dd>
          </dl>
        </div>
      </div>
    </div>
  )
}
