import type { ReactNode } from 'react'

export function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button type="button" className={`chip${active ? ' active' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

export function Pill({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button type="button" className={`pill${active ? ' active' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}
