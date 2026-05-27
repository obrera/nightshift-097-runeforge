import { Gem, Grid3X3, Sparkles } from 'lucide-react'

import { catalystStones, runeSchools, socketPatterns } from '@/runeforge/data-access/runeforge-catalog'
import { RuneForgeButton } from '@/runeforge/ui/runeforge-ui-button'
import type { CatalystId, RuneDraft, RuneSchool, SocketPattern } from '@/runeforge/util/runeforge-types'

export function RuneForgeWorkbench({
  draft,
  setCatalysts,
  setPattern,
  setSchool,
}: {
  draft: RuneDraft
  setCatalysts: (catalysts: CatalystId[]) => void
  setPattern: (pattern: SocketPattern) => void
  setSchool: (school: RuneSchool) => void
}) {
  function toggleCatalyst(id: CatalystId) {
    if (draft.catalysts.includes(id)) {
      setCatalysts(draft.catalysts.filter((catalyst) => catalyst !== id))
      return
    }
    setCatalysts([...draft.catalysts, id].slice(0, 5))
  }

  return (
    <section className="forge-grid rounded-lg border border-white/10 bg-zinc-950/72 p-4 shadow-2xl shadow-black/30">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-200">Crafting workbench</p>
          <h2 className="text-xl font-bold text-white">Choose the rune recipe</h2>
        </div>
        <Gem className="text-orange-200" size={22} />
      </div>

      <div className="grid gap-5">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Sparkles size={16} /> Rune school
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {runeSchools.map((school) => (
              <button
                className={`rounded-md border p-3 text-left transition ${
                  draft.school === school.id
                    ? 'border-orange-300/60 bg-orange-400/15'
                    : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
                }`}
                key={school.id}
                onClick={() => setSchool(school.id)}
                type="button"
              >
                <span className="block text-sm font-bold text-white">{school.name}</span>
                <span className="text-xs text-slate-400">{school.role}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Gem size={16} /> Catalyst stones
          </div>
          <div className="grid grid-cols-2 gap-2">
            {catalystStones.map((stone) => (
              <button
                className={`rounded-md border p-3 text-left transition ${
                  draft.catalysts.includes(stone.id)
                    ? 'border-teal-200/60 bg-teal-300/12'
                    : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
                }`}
                key={stone.id}
                onClick={() => toggleCatalyst(stone.id)}
                type="button"
              >
                <span className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: stone.tone }} />
                  {stone.name}
                </span>
                <span className="text-xs capitalize text-slate-400">
                  {stone.stat} +{stone.power} / risk {stone.volatility}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Grid3X3 size={16} /> Socket pattern
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {socketPatterns.map((pattern) => (
              <RuneForgeButton
                className="justify-start"
                key={pattern.id}
                onClick={() => setPattern(pattern.id)}
                type="button"
                variant={draft.pattern === pattern.id ? 'secondary' : 'ghost'}
              >
                {pattern.name}
              </RuneForgeButton>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
