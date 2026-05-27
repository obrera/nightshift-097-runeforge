import { SearchCheck } from 'lucide-react'
import { useState } from 'react'

import { RuneForgeButton } from '@/runeforge/ui/runeforge-ui-button'
import type { RuneVerification } from '@/runeforge/data-access/use-runeforge-verifier'

export function RuneForgeVerifier({
  error,
  isVerifying,
  lastAsset,
  verification,
  verifyRune,
}: {
  error: string | null
  isVerifying: boolean
  lastAsset?: string
  verification: RuneVerification | null
  verifyRune: (asset: string) => void
}) {
  const [asset, setAsset] = useState(lastAsset ?? '')

  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/78 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-200">Verifier</p>
          <h2 className="text-xl font-bold text-white">Asset and signature check</h2>
        </div>
        <SearchCheck className="text-orange-200" size={22} />
      </div>
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          verifyRune(asset.trim())
        }}
      >
        <input
          className="min-h-11 rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white placeholder:text-slate-500"
          onChange={(event) => setAsset(event.target.value)}
          placeholder="MPL Core asset address"
          value={asset}
        />
        <RuneForgeButton disabled={!asset.trim() || isVerifying} type="submit" variant="secondary">
          {isVerifying ? 'Checking devnet' : 'Verify rune'}
        </RuneForgeButton>
      </form>
      {error ? <p className="mt-3 rounded-md border border-red-300/20 bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}
      {verification ? (
        <div className="mt-3 grid gap-2 rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
          <p>
            Name: <span className="text-white">{verification.name}</span>
          </p>
          <p className="break-all">Owner: {verification.owner}</p>
          <p className="break-all">URI: {verification.uri}</p>
        </div>
      ) : null}
    </section>
  )
}
