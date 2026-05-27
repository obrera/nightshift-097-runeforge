import { Hono } from 'hono'

import { getCatalyst, getPattern, getSchool } from '../src/runeforge/data-access/runeforge-catalog'
import { runeDraftFromSearchParams } from '../src/runeforge/util/runeforge-query'
import { simulateRune } from '../src/runeforge/util/runeforge-simulation'
import type { RuneMetadata } from '../src/runeforge/util/runeforge-types'

const app = new Hono()
const build = '097'
const publicBaseUrl = (Bun.env.PUBLIC_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const rpcUrl = Bun.env.RPC_URL ?? 'https://api.devnet.solana.com'
const rpcWsUrl = Bun.env.RPC_WS_URL ?? 'wss://api.devnet.solana.com'

app.get('/health', (context) =>
  context.json({
    build,
    name: 'RuneForge',
    ok: true,
    publicBaseUrl,
    timestamp: new Date().toISOString(),
  }),
)

app.get('/api/bootstrap', (context) =>
  context.json({
    build,
    network: 'devnet',
    publicBaseUrl,
    ready: Boolean(publicBaseUrl),
    rpcUrl,
    rpcWsUrl,
  }),
)

app.get('/api/metadata/rune.json', (context) => {
  const url = new URL(context.req.url)
  const draft = runeDraftFromSearchParams(url.searchParams)
  const stats = simulateRune(draft)
  const school = getSchool(draft.school)
  const pattern = getPattern(draft.pattern)
  const catalysts = draft.catalysts.map(getCatalyst)
  const query = url.searchParams.toString()
  const mediaUri = `${publicBaseUrl}/api/media/rune.svg?${query}`
  const metadata: RuneMetadata = {
    name: `${school.name} Rune`,
    description:
      'A crafted RuneForge game equipment item minted as a transferable MPL Core asset for a player loadout.',
    image: mediaUri,
    attributes: [
      { trait_type: 'Build', value: build },
      { trait_type: 'Rune School', value: school.name },
      { trait_type: 'Socket Pattern', value: pattern.name },
      { trait_type: 'Catalysts', value: catalysts.map((stone) => stone.name).join(', ') },
      { trait_type: 'Force', value: stats.force },
      { trait_type: 'Guard', value: stats.guard },
      { trait_type: 'Speed', value: stats.speed },
      { trait_type: 'Focus', value: stats.focus },
      { trait_type: 'Stability', value: stats.stability },
    ],
    properties: {
      category: 'image',
      files: [{ type: 'image/svg+xml', uri: mediaUri }],
    },
  }
  return context.json(metadata)
})

app.get('/api/media/rune.svg', (context) => {
  const url = new URL(context.req.url)
  const draft = runeDraftFromSearchParams(url.searchParams)
  const stats = simulateRune(draft)
  const school = getSchool(draft.school)
  const pattern = getPattern(draft.pattern)
  const catalysts = draft.catalysts.map(getCatalyst)
  const socketMarks = pattern.sockets
    .map((socket, index) => {
      const catalyst = catalysts[index % catalysts.length]
      return `<circle cx="${socket.x * 8}" cy="${socket.y * 8}" r="42" fill="${catalyst.tone}" stroke="#fff7ed" stroke-width="8" opacity="0.92"/>`
    })
    .join('')
  const lines = pattern.sockets
    .map((socket) => `<line x1="400" y1="400" x2="${socket.x * 8}" y2="${socket.y * 8}" stroke="${school.accent}" stroke-width="8" opacity="0.58"/>`)
    .join('')
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" role="img" aria-label="RuneForge crafted rune">
  <defs>
    <radialGradient id="core" cx="50%" cy="48%" r="62%">
      <stop offset="0%" stop-color="${school.accent}" stop-opacity="0.86"/>
      <stop offset="54%" stop-color="#18181b"/>
      <stop offset="100%" stop-color="#050505"/>
    </radialGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="800" fill="#070707"/>
  <path d="M400 42 L693 166 L758 400 L693 634 L400 758 L107 634 L42 400 L107 166 Z" fill="url(#core)" stroke="#f8fafc" stroke-width="10"/>
  <path d="M400 116 L618 214 L684 400 L618 586 L400 684 L182 586 L116 400 L182 214 Z" fill="none" stroke="${school.accent}" stroke-width="6" opacity="0.7"/>
  <g filter="url(#glow)">${lines}${socketMarks}</g>
  <circle cx="400" cy="400" r="82" fill="#09090b" stroke="${school.accent}" stroke-width="10"/>
  <path d="M400 260 L462 400 L400 540 L338 400 Z" fill="${school.accent}" opacity="0.72"/>
  <text x="400" y="705" text-anchor="middle" fill="#f8fafc" font-family="Arial, sans-serif" font-size="34" font-weight="700">${escapeSvg(school.name)}</text>
  <text x="400" y="746" text-anchor="middle" fill="#99f6e4" font-family="Arial, sans-serif" font-size="24">Stability ${stats.stability} / Risk ${stats.fractureRisk}</text>
</svg>`

  return new Response(svg, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'image/svg+xml; charset=utf-8',
    },
  })
})

app.get('*', async (context) => {
  const pathname = new URL(context.req.url).pathname
  const assetPath = pathname === '/' ? '/index.html' : pathname
  const file = Bun.file(`dist${assetPath}`)
  if (await file.exists()) return new Response(file)
  return new Response(Bun.file('dist/index.html'))
})

Bun.serve({
  fetch: app.fetch,
  hostname: Bun.env.HOST ?? '0.0.0.0',
  port: Number(Bun.env.PORT ?? 3000),
})

function escapeSvg(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}
