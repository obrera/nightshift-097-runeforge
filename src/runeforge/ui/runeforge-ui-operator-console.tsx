import { SlidersHorizontal } from 'lucide-react'

import { catalystStones, socketPatterns } from '@/runeforge/data-access/runeforge-catalog'

export function RuneForgeOperatorConsole({ ready, publicBaseUrl }: { publicBaseUrl?: string; ready: boolean }) {
  const supplyCap = 900
  const projectedRisk = Math.round(
    socketPatterns.reduce((sum, pattern) => sum + pattern.risk, 0) / socketPatterns.length +
      catalystStones.reduce((sum, stone) => sum + stone.volatility, 0) / catalystStones.length,
  )

  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/78 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">Creator console</p>
          <h2 className="text-xl font-bold text-white">Recipe tuning and readiness</h2>
        </div>
        <SlidersHorizontal className="text-teal-200" size={22} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Supply cap" value={supplyCap.toLocaleString()} />
        <Metric label="Recipe sets" value={`${socketPatterns.length * catalystStones.length}`} />
        <Metric label="Avg risk" value={`${projectedRisk}%`} />
      </div>
      <div className="mt-3 rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
        Runtime readiness:{' '}
        <span className={ready ? 'font-bold text-emerald-200' : 'font-bold text-amber-200'}>
          {ready ? 'ready' : 'missing live base URL'}
        </span>
        <p className="mt-1 break-all text-xs text-slate-400">PUBLIC_BASE_URL: {publicBaseUrl ?? 'not loaded'}</p>
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  )
}
