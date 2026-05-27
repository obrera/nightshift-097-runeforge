import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/runeforge/feature/runeforge-feature-app'
import { WalletProviders } from '@/wallet/feature/wallet-providers'

import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProviders>
      <App />
    </WalletProviders>
  </StrictMode>,
)
