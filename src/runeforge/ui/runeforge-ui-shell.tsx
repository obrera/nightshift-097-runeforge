import { WalletUiDropdown } from '@wallet-ui/react'
import { Hammer, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'

export function RuneForgeShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rune-mask grid h-12 w-12 place-items-center bg-orange-500 text-zinc-950 shadow-lg shadow-orange-950/40">
              <Hammer size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200">Nightshift 097</p>
              <h1 className="text-2xl font-black text-white sm:text-3xl">RuneForge</h1>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-100">
              <ShieldCheck size={16} />
              Wallet-signed MPL Core devnet mint
            </div>
            <WalletUiDropdown />
          </div>
        </header>
        {children}
      </div>
    </main>
  )
}
