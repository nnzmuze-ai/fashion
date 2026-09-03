import type { Category } from '../types'

const PATHS: Record<Category, string> = {
  top: 'M22 12 L26 8 H38 L42 12 L52 18 L46 26 L42 22 V54 H22 V22 L18 26 L12 18 Z',
  bottom: 'M20 10 H44 L46 54 H36 L32 26 L28 54 H18 Z',
  dress: 'M24 14 L40 14 L44 24 L50 54 L14 54 L20 24 Z',
  outerwear: 'M18 14 L32 20 L46 14 L52 22 L48 54 L16 54 L12 22 Z',
  shoes: 'M22 10 L22 36 L14 46 L14 54 L42 54 L42 44 L34 44 L34 10 Z',
  accessory: 'M18 22 A14 14 0 1 1 30 42 A11 11 0 1 0 18 22 Z',
  bag: '',
}

export function GarmentIcon({ category, size = 24 }: { category: Category; size?: number }) {
  if (category === 'bag') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round">
        <rect x="16" y="24" width="32" height="26" rx="3" />
        <path d="M24 24 V18 A8 8 0 0 1 40 18 V24" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round">
      <path d={PATHS[category]} />
    </svg>
  )
}
