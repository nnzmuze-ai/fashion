import type { StyleTag } from '../types'

export function StyleIcon({ style, size = 30 }: { style: StyleTag; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 64 64', fill: 'none', stroke: 'currentColor', strokeWidth: 2.4 }
  switch (style) {
    case 'office-goth':
      return (
        <svg {...common} strokeLinejoin="round" strokeLinecap="round">
          <path d="M20 14 L32 22 L44 14 L50 20 L46 54 L18 54 L14 20 Z" />
          <line x1="32" y1="22" x2="32" y2="50" />
        </svg>
      )
    case 'rockstar':
      return (
        <svg {...common} strokeLinejoin="round" strokeLinecap="round">
          <path d="M18 14 L32 20 L46 14 L52 22 L48 54 L16 54 L12 22 Z" />
          <circle cx="24" cy="30" r="1.6" fill="currentColor" />
          <circle cx="24" cy="40" r="1.6" fill="currentColor" />
          <circle cx="40" cy="30" r="1.6" fill="currentColor" />
          <circle cx="40" cy="40" r="1.6" fill="currentColor" />
        </svg>
      )
    case 'whimsgoth':
      return (
        <svg {...common} strokeLinejoin="round" strokeLinecap="round">
          <path d="M18 22 A14 14 0 1 1 30 42 A11 11 0 1 0 18 22 Z" />
        </svg>
      )
    case 'western-goth':
      return (
        <svg {...common} strokeLinejoin="round" strokeLinecap="round">
          <path d="M20 8 L20 34 L12 44 L12 54 L44 54 L44 40 L34 40 L34 8 Z" />
          <path d="M12 44 L34 44" />
        </svg>
      )
    case 'androgino':
      return (
        <svg {...common}>
          <circle cx="26" cy="32" r="15" />
          <circle cx="38" cy="32" r="15" />
        </svg>
      )
  }
}
