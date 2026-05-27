import { createSolanaDevnet, createWalletUiConfig, WalletUi } from '@wallet-ui/react'
import type { ReactNode } from 'react'

const rpcUrl = import.meta.env.VITE_RPC_URL ?? 'https://api.devnet.solana.com'
const rpcWsUrl = import.meta.env.VITE_RPC_WS_URL ?? 'wss://api.devnet.solana.com'

const walletUiConfig = createWalletUiConfig({
  clusters: [
    createSolanaDevnet({
      label: 'Solana devnet',
      url: rpcUrl,
      urlWs: rpcWsUrl,
    }),
  ],
})

export function WalletProviders({ children }: { children: ReactNode }) {
  return <WalletUi config={walletUiConfig}>{children}</WalletUi>
}
