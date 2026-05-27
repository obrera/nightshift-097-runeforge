import { fetchAssetV1 } from '@obrera/mpl-core-kit-lib/generated'
import { address } from '@solana/kit'
import { useState } from 'react'

import type { SolanaClient } from '@/solana/data-access/solana-client'

export interface RuneVerification {
  asset: string
  name: string
  owner: string
  updateAuthority: string
  uri: string
}

export function useRuneForgeVerifier({ client }: { client: SolanaClient }) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verification, setVerification] = useState<RuneVerification | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function verifyRune(assetAddress: string) {
    setIsVerifying(true)
    setError(null)
    try {
      const asset = await fetchAssetV1(client.rpc, address(assetAddress))
      const result = {
        asset: asset.address,
        name: asset.data.name,
        owner: String(asset.data.owner),
        updateAuthority: JSON.stringify(asset.data.updateAuthority),
        uri: asset.data.uri,
      }
      setVerification(result)
      return result
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unable to verify asset'
      setError(message)
      setVerification(null)
      return null
    } finally {
      setIsVerifying(false)
    }
  }

  return { error, isVerifying, verification, verifyRune }
}
