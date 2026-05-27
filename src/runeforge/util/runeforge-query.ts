import type { RuneDraft } from './runeforge-types'

export function runeDraftToSearchParams(draft: RuneDraft) {
  const params = new URLSearchParams()
  params.set('school', draft.school)
  params.set('pattern', draft.pattern)
  params.set('catalysts', draft.catalysts.join(','))
  return params
}

export function runeDraftFromSearchParams(params: URLSearchParams): RuneDraft {
  const catalysts = params.get('catalysts')?.split(',').filter(Boolean) ?? ['sunshard', 'mossagate', 'stormsalt']
  return {
    catalysts: catalysts.slice(0, 5) as RuneDraft['catalysts'],
    pattern: (params.get('pattern') ?? 'triad') as RuneDraft['pattern'],
    school: (params.get('school') ?? 'ember') as RuneDraft['school'],
  }
}
