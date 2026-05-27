export type RuneSchool = 'ember' | 'tidal' | 'verdant' | 'astral'

export type CatalystId = 'sunshard' | 'voidglass' | 'mossagate' | 'stormsalt'

export type SocketPattern = 'triad' | 'warded-cross' | 'spiral-lock'

export interface CatalystStone {
  id: CatalystId
  name: string
  tone: string
  power: number
  volatility: number
  stat: 'force' | 'guard' | 'speed' | 'focus'
}

export interface RuneSchoolConfig {
  id: RuneSchool
  name: string
  accent: string
  role: string
  bias: {
    force: number
    guard: number
    speed: number
    focus: number
  }
}

export interface SocketPatternConfig {
  id: SocketPattern
  name: string
  sockets: Array<{ x: number; y: number }>
  stability: number
  risk: number
}

export interface RuneDraft {
  school: RuneSchool
  catalysts: CatalystId[]
  pattern: SocketPattern
}

export interface RuneStats {
  force: number
  guard: number
  speed: number
  focus: number
  stability: number
  fractureRisk: number
  rarityScore: number
}

export interface RuneMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{ trait_type: string; value: string | number }>
  properties: {
    category: string
    files: Array<{ type: string; uri: string }>
  }
}
