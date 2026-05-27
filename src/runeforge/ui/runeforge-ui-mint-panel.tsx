import { ExternalLink, Hammer, Wallet } from 'lucide-react'

import { RuneForgeButton } from '@/runeforge/ui/runeforge-ui-button'
import type { RuneMintResult } from '@/runeforge/data-access/use-runeforge-mint'

export function RuneForgeMintPanel({
  accountAddress,
  error,
  isMinting,
  mintResult,
  mintRune,
}: {
  accountAddress?: string
  error: string | null
  isMinting: boolean
  mintResult: RuneMintResult | null
  mintRune: () => void
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/78 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">Wallet mint</p>
          <h2 className="text-xl font-bold text-white">Mint crafted rune</h2>
        </div>
        <Wallet className="text-teal-200" size={22} />
      </div>
      <div className="grid gap-3">
        <p className="text-sm text-slate-300">
          The connected wallet signs the MPL Core createV1 transaction. The server only hosts metadata and media.
        </p>
        <div className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-xs text-slate-300">
          Owner: <span className="break-all text-white">{accountAddress ?? 'Connect a wallet to mint'}</span>
        </div>
        <RuneForgeButton disabled={!accountAddress || isMinting} onClick={mintRune} type="button">
          <Hammer size={17} />
          {isMinting ? 'Awaiting signature' : 'Mint rune asset'}
        </RuneForgeButton>
        {error ? <p className="rounded-md border border-red-300/20 bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}
        {mintResult ? (
          <div className="rounded-md border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm">
            <p className="font-bold text-emerald-100">Mint complete</p>
            <p className="break-all text-slate-200">Asset: {mintResult.asset}</p>
            <p className="break-all text-slate-200">Signature: {mintResult.signature}</p>
            <a
              className="mt-2 inline-flex items-center gap-1 text-emerald-100 underline"
              href={`https://explorer.solana.com/address/${mintResult.asset}?cluster=devnet`}
              rel="noreferrer"
              target="_blank"
            >
              View asset <ExternalLink size={14} />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  )
}
