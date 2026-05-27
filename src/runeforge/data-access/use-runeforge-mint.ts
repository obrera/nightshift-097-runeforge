import { getCreateV1Instruction } from '@obrera/mpl-core-kit-lib/generated'
import {
  appendTransactionMessageInstruction,
  assertIsTransactionMessageWithSingleSendingSigner,
  createTransactionMessage,
  generateKeyPairSigner,
  getBase58Decoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
} from '@solana/kit'
import { useWalletAccountTransactionSendingSigner } from '@solana/react'
import type { UiWalletAccount } from '@wallet-ui/react'
import { useState } from 'react'

import type { SolanaClient } from '@/solana/data-access/solana-client'

export interface RuneMintResult {
  asset: string
  owner: string
  signature: string
  updateAuthority: string
}

export function useRuneForgeMint({ account, client }: { account: UiWalletAccount; client: SolanaClient }) {
  const transactionSigner = useWalletAccountTransactionSendingSigner(account, 'solana:devnet')
  const [isMinting, setIsMinting] = useState(false)

  async function mintRune({ metadataUri, name }: { metadataUri: string; name: string }): Promise<RuneMintResult> {
    setIsMinting(true)
    try {
      const asset = await generateKeyPairSigner()
      const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()
      const message = pipe(
        createTransactionMessage({ version: 0 }),
        (transactionMessage) => setTransactionMessageFeePayerSigner(transactionSigner, transactionMessage),
        (transactionMessage) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transactionMessage),
        (transactionMessage) =>
          appendTransactionMessageInstruction(
            getCreateV1Instruction({
              asset,
              authority: transactionSigner,
              name: name.slice(0, 32),
              owner: transactionSigner.address,
              payer: transactionSigner,
              uri: metadataUri,
            }),
            transactionMessage,
          ),
      )

      assertIsTransactionMessageWithSingleSendingSigner(message)
      const signatureBytes = await signAndSendTransactionMessageWithSigners(message)

      return {
        asset: asset.address,
        owner: transactionSigner.address,
        signature: getBase58Decoder().decode(signatureBytes),
        updateAuthority: transactionSigner.address,
      }
    } finally {
      setIsMinting(false)
    }
  }

  return { isMinting, mintRune }
}
