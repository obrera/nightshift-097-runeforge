import { useMemo, useState } from 'react'

import { createSolanaClient } from '@/solana/data-access/solana-client'
import { useRuneForgeBootstrap } from '@/runeforge/data-access/use-runeforge-bootstrap'
import { useRuneForgeVerifier } from '@/runeforge/data-access/use-runeforge-verifier'
import { RuneForgeMintFeature } from '@/runeforge/feature/runeforge-feature-mint'
import { RuneForgeOperatorConsole } from '@/runeforge/ui/runeforge-ui-operator-console'
import { RuneForgePreview } from '@/runeforge/ui/runeforge-ui-preview'
import { RuneForgeShell } from '@/runeforge/ui/runeforge-ui-shell'
import { RuneForgeSimulator } from '@/runeforge/ui/runeforge-ui-simulator'
import { RuneForgeVerifier } from '@/runeforge/ui/runeforge-ui-verifier'
import { RuneForgeWorkbench } from '@/runeforge/ui/runeforge-ui-workbench'
import { runeDraftToSearchParams } from '@/runeforge/util/runeforge-query'
import { simulateRune } from '@/runeforge/util/runeforge-simulation'
import type { CatalystId, RuneDraft, RuneSchool, SocketPattern } from '@/runeforge/util/runeforge-types'
import { useWalletAccount } from '@/wallet/data-access/use-wallet-account'

const initialDraft: RuneDraft = {
  catalysts: ['sunshard', 'mossagate', 'stormsalt'],
  pattern: 'triad',
  school: 'ember',
}

export function App() {
  const [draft, setDraft] = useState<RuneDraft>(initialDraft)
  const [lastMintedAsset, setLastMintedAsset] = useState<string | undefined>()
  const { account } = useWalletAccount()
  const { bootstrap } = useRuneForgeBootstrap()
  const client = useMemo(() => createSolanaClient(), [])
  const stats = useMemo(() => simulateRune(draft), [draft])
  const metadataUri = useMemo(() => {
    const baseUrl = (bootstrap?.publicBaseUrl ?? window.location.origin).replace(/\/$/, '')
    return `${baseUrl}/api/metadata/rune.json?${runeDraftToSearchParams(draft).toString()}`
  }, [bootstrap?.publicBaseUrl, draft])
  const verifier = useRuneForgeVerifier({ client })

  function setSchool(school: RuneSchool) {
    setDraft((current) => ({ ...current, school }))
  }

  function setPattern(pattern: SocketPattern) {
    setDraft((current) => ({ ...current, pattern }))
  }

  function setCatalysts(catalysts: CatalystId[]) {
    setDraft((current) => ({ ...current, catalysts }))
  }

  return (
    <RuneForgeShell>
      <div className="grid gap-6 lg:grid-cols-[minmax(18rem,26rem)_minmax(0,1fr)]">
        <RuneForgeWorkbench
          draft={draft}
          setCatalysts={setCatalysts}
          setPattern={setPattern}
          setSchool={setSchool}
        />
        <div className="grid gap-6">
          <RuneForgePreview draft={draft} metadataUri={metadataUri} stats={stats} />
          <div className="grid gap-6 xl:grid-cols-2">
            <RuneForgeSimulator stats={stats} />
            <RuneForgeMintFeature
              account={account}
              client={client}
              metadataUri={metadataUri}
              runeName={`${draft.school} rune`}
              setLastMintedAsset={setLastMintedAsset}
            />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <RuneForgeVerifier
              error={verifier.error}
              isVerifying={verifier.isVerifying}
              lastAsset={lastMintedAsset}
              verification={verifier.verification}
              verifyRune={verifier.verifyRune}
            />
            <RuneForgeOperatorConsole
              publicBaseUrl={bootstrap?.publicBaseUrl}
              ready={Boolean(bootstrap?.ready)}
            />
          </div>
        </div>
      </div>
    </RuneForgeShell>
  )
}
