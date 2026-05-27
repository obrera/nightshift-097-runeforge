import { getCatalyst, getPattern, getSchool } from '../data-access/runeforge-catalog'
import type { RuneDraft, RuneStats } from './runeforge-types'

export function simulateRune(draft: RuneDraft): RuneStats {
  const school = getSchool(draft.school)
  const pattern = getPattern(draft.pattern)
  const catalysts = draft.catalysts.map(getCatalyst)
  const uniqueStats = new Set(catalysts.map((stone) => stone.stat)).size
  const totalPower = catalysts.reduce((sum, stone) => sum + stone.power, 0)
  const totalVolatility = catalysts.reduce((sum, stone) => sum + stone.volatility, 0)
  const socketPressure = Math.max(0, catalysts.length - pattern.sockets.length) * 18

  const stats = {
    force: school.bias.force,
    guard: school.bias.guard,
    speed: school.bias.speed,
    focus: school.bias.focus,
  }

  for (const catalyst of catalysts) {
    stats[catalyst.stat] += catalyst.power
  }

  const harmony = uniqueStats * 5
  const stability = clamp(82 + pattern.stability + harmony - totalVolatility - socketPressure, 4, 98)
  const fractureRisk = clamp(100 - stability + pattern.risk + Math.floor(totalPower / 8), 2, 96)
  const rarityScore = clamp(totalPower + uniqueStats * 9 + pattern.sockets.length * 4 + Math.floor((100 - stability) / 2), 10, 100)

  return {
    force: clamp(stats.force, 0, 100),
    guard: clamp(stats.guard, 0, 100),
    speed: clamp(stats.speed, 0, 100),
    focus: clamp(stats.focus, 0, 100),
    stability,
    fractureRisk,
    rarityScore,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)))
}
