import { fetchAssetV1, getCreateV1Instruction } from '@obrera/mpl-core-kit-lib/generated'
import {
  appendTransactionMessageInstruction,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createTransactionMessage,
  generateKeyPairSigner,
  getBase64EncodedWireTransaction,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signature as signatureBrand,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

const signerPath =
  process.env.PROOF_SIGNER ?? '/home/obrera/projects/pubkey-link/tools/tokens/keypair/alice-keypair.json'
const baseUrl = (process.env.PROOF_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const rpcUrl = process.env.PROOF_RPC_URL ?? 'https://api.devnet.solana.com'

if (!existsSync(signerPath)) {
  throw new Error(`Proof signer not found: ${signerPath}`)
}

const signerBytes = new Uint8Array(JSON.parse(await readFile(signerPath, 'utf8')) as number[])
const payer = await createKeyPairSignerFromBytes(signerBytes)
const asset = await generateKeyPairSigner()
const rpc = createSolanaRpc(rpcUrl)
const metadataUri = `${baseUrl}/api/metadata/rune.json?school=astral&pattern=spiral-lock&catalysts=sunshard,voidglass,stormsalt,mossagate`
const metadataResponse = await fetch(metadataUri)

if (!metadataResponse.ok) {
  throw new Error(`Metadata route failed: ${metadataResponse.status}`)
}

const metadata = (await metadataResponse.json()) as { attributes?: unknown[]; image?: string; name?: string }
if (!metadata.image) throw new Error('Metadata image URI missing')

const mediaResponse = await fetch(metadata.image)
if (!mediaResponse.ok) {
  throw new Error(`Media route failed: ${mediaResponse.status}`)
}

const { value: latestBlockhash } = await rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()
const message = pipe(
  createTransactionMessage({ version: 0 }),
  (transactionMessage) => setTransactionMessageFeePayerSigner(payer, transactionMessage),
  (transactionMessage) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transactionMessage),
  (transactionMessage) =>
    appendTransactionMessageInstruction(
      getCreateV1Instruction({
        asset,
        authority: payer,
        name: (metadata.name ?? 'RuneForge Proof').slice(0, 32),
        owner: payer.address,
        payer,
        uri: metadataUri,
      }),
      transactionMessage,
    ),
)

const signedTransaction = await signTransactionMessageWithSigners(message)
const txSignature = await rpc
  .sendTransaction(getBase64EncodedWireTransaction(signedTransaction), {
    encoding: 'base64',
    preflightCommitment: 'confirmed',
  })
  .send()
await waitForSignature(txSignature)
const fetched = await waitForAsset()

console.log(
  JSON.stringify(
    {
      asset: asset.address,
      attributeCount: metadata.attributes?.length ?? 0,
      mediaHttpStatus: mediaResponse.status,
      metadataUri,
      owner: fetched.data.owner,
      signature: txSignature,
      updateAuthority: addressLikeToString(fetched.data.updateAuthority),
    },
    null,
    2,
  ),
)

async function waitForAsset() {
  let lastError: unknown
  for (let index = 0; index < 20; index += 1) {
    try {
      return await fetchAssetV1(rpc, asset.address)
    } catch (error) {
      lastError = error
      await Bun.sleep(750)
    }
  }
  throw lastError
}

async function waitForSignature(transactionSignature: string) {
  for (let index = 0; index < 20; index += 1) {
    const { value } = await rpc.getSignatureStatuses([signatureBrand(transactionSignature)]).send()
    const status = value[0]
    if (status?.err) throw new Error(`Proof transaction failed: ${JSON.stringify(status.err)}`)
    if (status?.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized') return
    await Bun.sleep(750)
  }
}

function addressLikeToString(value: unknown): string {
  if (typeof value === 'string') return value
  if (
    value &&
    typeof value === 'object' &&
    'fields' in value &&
    Array.isArray(value.fields) &&
    typeof value.fields[0] === 'string'
  ) {
    return value.fields[0]
  }
  return JSON.stringify(value)
}
