import { Activity, AlertTriangle } from 'lucide-react'

import type { RuneStats } from '@/runeforge/util/runeforge-types'

export function RuneForgeSimulator({ stats }: { stats: RuneStats }) {
  const bars = [
    ['Force', stats.force, 'bg-orange-400'],
    ['Guard', stats.guard, 'bg-cyan-300'],
    ['Speed', stats.speed, 'bg-lime-300'],
    ['Focus', stats.focus, 'bg-violet-300'],
  ] as const

  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/78 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">Forge simulator</p>
          <h2 className="text-xl font-bold text-white">Stability and loadout stats</h2>
        </div>
        <Activity className="text-teal-200" size={22} />
      </div>
      <div className="grid gap-4">
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-semibold text-slate-200">Stability</span>
            <span className="text-white">{stats.stability}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-teal-300" style={{ width: `${stats.stability}%` }} />
          </div>
        </div>
        <div className="rounded-md border border-amber-300/20 bg-amber-300/10 p-3">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 font-semibold text-amber-100">
              <AlertTriangle size={16} /> Fracture risk
            </span>
            <span className="text-white">{stats.fractureRisk}%</span>
          </div>
        </div>
        <div className="grid gap-3">
          {bars.map(([label, value, color]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-xs text-slate-300">
                <span>{label}</span>
                <span>{value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
          Rarity score <span className="font-bold text-white">{stats.rarityScore}</span>. High-risk combinations earn
          stronger on-chain item identity but are easier to fracture in game balance.
        </div>
      </div>
    </section>
  )
}
