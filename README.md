# Chain Pulse — Blockchain Network Status Monitor

A lightweight, single-page dashboard that shows the real-time status of the
blockchain network the user's wallet is connected to. Designed to help
developers quickly verify their Web3 environment before starting work.

## Tech stack

React + TypeScript, bootstrapped with Vite. Uses `lucide-react` for icons.

## Getting started

```bash
npm install
npm run dev
```

## Existing code

The `src/` directory contains a working foundation. Extend and improve
it — do not rewrite from scratch. Keep all existing components and
utilities, they are actively used.

## Features

### Network Status Card

On mount, detect the Web3 provider via `window.ethereum`. Display:
- Chain ID and network name (Mainnet, Goerli, Sepolia, etc.)
- Connection status (connected / disconnected)
- Current block number (call `eth_blockNumber`)
- Gas price (call `eth_gasPrice`)

If no provider is detected, show a "No wallet detected" notice.

### Wallet Summary Card

If the provider is available, read `ethereum.selectedAddress` and
`ethereum.isConnected()`. Listen for `chainChanged` and
`accountsChanged` events to update the UI live.

Display:
- Truncated wallet address (first 6 + last 4 chars)
- Connection state badge (green dot / red dot)
- Chain ID as hex and decimal

### Environment Info Card

Collect and display:
- `navigator.userAgent` (first 80 chars)
- Screen resolution and device pixel ratio
- Platform and language
- Hardware concurrency (CPU core count)

### Auto-Refresh

Poll chain data every 12 seconds. Show a subtle pulse animation on the
Network Status card header during each refresh.

## Design

Dark theme, rounded cards, monospace font for hex values and addresses.
CSS grid with 2 columns on desktop, stacked on mobile. A small
"Chain Pulse" header with a radio-tower icon at the top. Minimal and
developer-focused.
