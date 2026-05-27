import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function RuneForgeButton({
  children,
  className = '',
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' }) {
  const variants = {
    ghost: 'border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]',
    primary: 'border-orange-300/30 bg-orange-500 text-zinc-950 hover:bg-orange-300',
    secondary: 'border-teal-300/25 bg-teal-300/10 text-teal-100 hover:bg-teal-300/20',
  }

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
