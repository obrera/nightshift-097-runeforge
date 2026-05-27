import { Eye, WandSparkles } from 'lucide-react'

import { getCatalyst, getPattern, getSchool } from '@/runeforge/data-access/runeforge-catalog'
import type { RuneDraft, RuneStats } from '@/runeforge/util/runeforge-types'

export function RuneForgePreview({
  draft,
  metadataUri,
  stats,
}: {
  draft: RuneDraft
  metadataUri: string
  stats: RuneStats
}) {
  const school = getSchool(draft.school)
  const pattern = getPattern(draft.pattern)
  const catalysts = draft.catalysts.map(getCatalyst)

  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/78 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-200">Metadata preview</p>
          <h2 className="text-xl font-bold text-white">Finished rune item</h2>
        </div>
        <Eye className="text-orange-200" size={22} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="grid min-h-80 place-items-center rounded-lg border border-white/10 bg-black/45 p-4">
          <div className="rune-mask relative aspect-square w-full max-w-80 overflow-hidden bg-zinc-900">
            <img
              alt="Generated rune SVG preview"
              className="h-full w-full object-cover"
              src={`/api/media/rune.svg?${metadataUri.split('?')[1] ?? ''}`}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs text-slate-400">Name</p>
            <p className="font-bold text-white">{school.name} Rune</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs text-slate-400">Sockets</p>
            <p className="font-bold text-white">{pattern.name}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs text-slate-400">Catalysts</p>
            <p className="font-bold text-white">{catalysts.map((stone) => stone.name).join(', ')}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs text-slate-400">Mint URI</p>
            <p className="break-all text-xs text-teal-100">{metadataUri}</p>
          </div>
          <div className="rounded-md border border-violet-300/20 bg-violet-300/10 p-3 text-sm text-violet-100">
            <span className="flex items-center gap-2 font-semibold text-white">
              <WandSparkles size={16} /> Attribute count: 9
            </span>
            Stability {stats.stability}, risk {stats.fractureRisk}, rarity {stats.rarityScore}.
          </div>
        </div>
      </div>
    </section>
  )
}
