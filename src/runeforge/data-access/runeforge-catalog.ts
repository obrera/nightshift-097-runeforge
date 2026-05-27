import type { CatalystStone, RuneSchoolConfig, SocketPatternConfig } from '../util/runeforge-types'

export const runeSchools: RuneSchoolConfig[] = [
  {
    id: 'ember',
    name: 'Ember Hex',
    accent: '#f97316',
    role: 'burst damage',
    bias: { force: 24, guard: 4, speed: 8, focus: 10 },
  },
  {
    id: 'tidal',
    name: 'Tidal Ward',
    accent: '#22d3ee',
    role: 'shield sustain',
    bias: { force: 6, guard: 24, speed: 5, focus: 12 },
  },
  {
    id: 'verdant',
    name: 'Verdant Bind',
    accent: '#84cc16',
    role: 'control and recovery',
    bias: { force: 8, guard: 12, speed: 8, focus: 20 },
  },
  {
    id: 'astral',
    name: 'Astral Edge',
    accent: '#a78bfa',
    role: 'mobility casting',
    bias: { force: 12, guard: 6, speed: 24, focus: 12 },
  },
]

export const catalystStones: CatalystStone[] = [
  { id: 'sunshard', name: 'Sunshard', tone: '#facc15', power: 20, volatility: 18, stat: 'force' },
  { id: 'voidglass', name: 'Voidglass', tone: '#c084fc', power: 24, volatility: 28, stat: 'focus' },
  { id: 'mossagate', name: 'Moss Agate', tone: '#4ade80', power: 14, volatility: 8, stat: 'guard' },
  { id: 'stormsalt', name: 'Stormsalt', tone: '#67e8f9', power: 18, volatility: 22, stat: 'speed' },
]

export const socketPatterns: SocketPatternConfig[] = [
  {
    id: 'triad',
    name: 'Triad',
    sockets: [
      { x: 50, y: 22 },
      { x: 25, y: 66 },
      { x: 75, y: 66 },
    ],
    stability: 18,
    risk: 6,
  },
  {
    id: 'warded-cross',
    name: 'Warded Cross',
    sockets: [
      { x: 50, y: 18 },
      { x: 50, y: 82 },
      { x: 18, y: 50 },
      { x: 82, y: 50 },
    ],
    stability: 28,
    risk: 12,
  },
  {
    id: 'spiral-lock',
    name: 'Spiral Lock',
    sockets: [
      { x: 52, y: 20 },
      { x: 72, y: 40 },
      { x: 62, y: 68 },
      { x: 35, y: 72 },
      { x: 25, y: 42 },
    ],
    stability: 12,
    risk: 24,
  },
]

export function getSchool(id: string) {
  return runeSchools.find((school) => school.id === id) ?? runeSchools[0]
}

export function getPattern(id: string) {
  return socketPatterns.find((pattern) => pattern.id === id) ?? socketPatterns[0]
}

export function getCatalyst(id: string) {
  return catalystStones.find((stone) => stone.id === id) ?? catalystStones[0]
}
