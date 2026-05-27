import { useEffect, useState } from 'react'

export interface RuneForgeBootstrap {
  build: string
  network: string
  publicBaseUrl: string
  rpcUrl: string
  ready: boolean
}

export function useRuneForgeBootstrap() {
  const [bootstrap, setBootstrap] = useState<RuneForgeBootstrap | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetch('/api/bootstrap')
      .then((response) => {
        if (!response.ok) throw new Error(`Bootstrap failed with HTTP ${response.status}`)
        return response.json() as Promise<RuneForgeBootstrap>
      })
      .then((payload) => {
        if (active) setBootstrap(payload)
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof Error ? caught.message : 'Unable to load runtime readiness')
      })
    return () => {
      active = false
    }
  }, [])

  return { bootstrap, error }
}
