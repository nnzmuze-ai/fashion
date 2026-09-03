export type StyleTag = 'office-goth' | 'rockstar' | 'whimsgoth' | 'western-goth' | 'androgino'

export type Category = 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory' | 'bag'

export type Season = 'verao' | 'inverno' | 'meia-estacao' | 'todas'

export type Occasion = 'dia-a-dia' | 'trabalho' | 'balada' | 'evento'

export interface ClothingItem {
  id?: number
  name: string
  category: Category
  colorName: string
  colorValue: string
  styles: StyleTag[]
  season: Season
  photo: string
  createdAt: number
}

export interface Outfit {
  id?: number
  name: string
  style: StyleTag
  occasion: Occasion
  itemIds: number[]
  explanation: string
  createdAt: number
  usedAt: number[]
}

export interface WishlistItem {
  id?: number
  name: string
  note?: string
  createdAt: number
}

export interface Profile {
  id: 'main'
  styles: StyleTag[]
  onboarded: boolean
}

export const STYLES: { id: StyleTag; label: string }[] = [
  { id: 'office-goth', label: 'Office Goth' },
  { id: 'rockstar', label: 'Rockstar Girlfriend' },
  { id: 'whimsgoth', label: 'Whimsgoth' },
  { id: 'western-goth', label: 'Western Goth' },
  { id: 'androgino', label: 'Andrógino' },
]

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'top', label: 'Top' },
  { id: 'bottom', label: 'Bottom' },
  { id: 'dress', label: 'Vestido' },
  { id: 'outerwear', label: 'Casaco' },
  { id: 'shoes', label: 'Calçado' },
  { id: 'accessory', label: 'Acessório' },
  { id: 'bag', label: 'Bolsa' },
]

export const SEASONS: { id: Season; label: string }[] = [
  { id: 'verao', label: 'Verão' },
  { id: 'inverno', label: 'Inverno' },
  { id: 'meia-estacao', label: 'Meia-estação' },
  { id: 'todas', label: 'Todas' },
]

export const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: 'dia-a-dia', label: 'Dia a dia' },
  { id: 'trabalho', label: 'Trabalho' },
  { id: 'balada', label: 'Balada' },
  { id: 'evento', label: 'Evento' },
]

export const COLOR_PALETTE: { name: string; value: string }[] = [
  { name: 'Preto', value: 'oklch(20% 0 0)' },
  { name: 'Cinza Chumbo', value: 'oklch(35% 0.01 40)' },
  { name: 'Vinho', value: 'oklch(45% 0.14 25)' },
  { name: 'Bege', value: 'oklch(78% 0.03 80)' },
  { name: 'Ameixa', value: 'oklch(40% 0.06 320)' },
  { name: 'Verde Musgo', value: 'oklch(45% 0.05 150)' },
  { name: 'Dourado', value: 'oklch(78% 0.12 90)' },
  { name: 'Branco Osso', value: 'oklch(92% 0.01 80)' },
]

export function styleLabel(id: StyleTag): string {
  return STYLES.find((s) => s.id === id)?.label ?? id
}

export function categoryLabel(id: Category): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}
