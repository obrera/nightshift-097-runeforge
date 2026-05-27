import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit'

const rpcUrl = import.meta.env.VITE_RPC_URL ?? 'https://api.devnet.solana.com'
const rpcWsUrl = import.meta.env.VITE_RPC_WS_URL ?? 'wss://api.devnet.solana.com'

export function createSolanaClient() {
  return {
    rpc: createSolanaRpc(rpcUrl),
    rpcSubscriptions: createSolanaRpcSubscriptions(rpcWsUrl),
  }
}

export type SolanaClient = ReturnType<typeof createSolanaClient>
