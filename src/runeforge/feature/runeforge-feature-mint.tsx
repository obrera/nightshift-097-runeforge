import type { UiWalletAccount } from '@wallet-ui/react'
import { useState } from 'react'

import type { SolanaClient } from '@/solana/data-access/solana-client'
import { useRuneForgeMint, type RuneMintResult } from '@/runeforge/data-access/use-runeforge-mint'
import { RuneForgeMintPanel } from '@/runeforge/ui/runeforge-ui-mint-panel'

export function RuneForgeMintFeature({
  account,
  client,
  metadataUri,
  runeName,
  setLastMintedAsset,
}: {
  account: UiWalletAccount | undefined
  client: SolanaClient
  metadataUri: string
  runeName: string
  setLastMintedAsset: (asset: string) => void
}) {
  if (!account) {
    return (
      <RuneForgeMintPanel
        accountAddress={undefined}
        error={null}
        isMinting={false}
        mintResult={null}
        mintRune={() => undefined}
      />
    )
  }

  return (
    <RuneForgeConnectedMint
      account={account}
      client={client}
      metadataUri={metadataUri}
      runeName={runeName}
      setLastMintedAsset={setLastMintedAsset}
    />
  )
}

function RuneForgeConnectedMint({
  account,
  client,
  metadataUri,
  runeName,
  setLastMintedAsset,
}: {
  account: UiWalletAccount
  client: SolanaClient
  metadataUri: string
  runeName: string
  setLastMintedAsset: (asset: string) => void
}) {
  const { isMinting, mintRune } = useRuneForgeMint({ account, client })
  const [error, setError] = useState<string | null>(null)
  const [mintResult, setMintResult] = useState<RuneMintResult | null>(null)

  async function submitMint() {
    setError(null)
    try {
      const result = await mintRune({ metadataUri, name: runeName })
      setMintResult(result)
      setLastMintedAsset(result.asset)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Wallet mint failed')
    }
  }

  return (
    <RuneForgeMintPanel
      accountAddress={account.address}
      error={error}
      isMinting={isMinting}
      mintResult={mintResult}
      mintRune={() => void submitMint()}
    />
  )
}
