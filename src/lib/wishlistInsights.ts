import { STYLES, categoryLabel, styleLabel, type Category, type ClothingItem, type StyleTag } from '../types'

export interface StyleShare {
  style: StyleTag
  label: string
  count: number
  pct: number
}

export function computeStyleDistribution(items: ClothingItem[]): StyleShare[] {
  const counts = new Map<StyleTag, number>()
  STYLES.forEach((s) => counts.set(s.id, 0))
  let total = 0
  for (const item of items) {
    for (const s of item.styles) {
      counts.set(s, (counts.get(s) ?? 0) + 1)
      total += 1
    }
  }
  if (total === 0) return []
  return STYLES.map((s) => ({
    style: s.id,
    label: s.label,
    count: counts.get(s.id) ?? 0,
    pct: Math.round(((counts.get(s.id) ?? 0) / total) * 100),
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)
}

const GAP_CATEGORIES: Category[] = ['shoes', 'accessory', 'outerwear']

export interface GapSuggestion {
  key: string
  title: string
  reason: string
  category: Category
}

export function computeGapSuggestions(items: ClothingItem[]): GapSuggestion[] {
  const styleCounts = new Map<StyleTag, number>()
  const styleHasCategory = new Map<StyleTag, Set<Category>>()

  for (const s of STYLES) {
    styleHasCategory.set(s.id, new Set())
  }

  for (const item of items) {
    for (const s of item.styles) {
      styleCounts.set(s, (styleCounts.get(s) ?? 0) + 1)
      styleHasCategory.get(s)?.add(item.category)
    }
  }

  const relevantStyles = STYLES.filter((s) => (styleCounts.get(s.id) ?? 0) >= 2).sort(
    (a, b) => (styleCounts.get(b.id) ?? 0) - (styleCounts.get(a.id) ?? 0),
  )

  const byCategory = new Map<Category, StyleTag[]>()
  for (const s of relevantStyles) {
    const has = styleHasCategory.get(s.id) ?? new Set()
    for (const cat of GAP_CATEGORIES) {
      if (!has.has(cat)) {
        const list = byCategory.get(cat) ?? []
        list.push(s.id)
        byCategory.set(cat, list)
      }
    }
  }

  const suggestions: GapSuggestion[] = []
  for (const [cat, styleIds] of byCategory) {
    if (styleIds.length === 0) continue
    const names = styleIds.slice(0, 2).map(styleLabel)
    const title = `${categoryLabel(cat)} para ${names.join(' + ')}`
    const reason =
      styleIds.length > 1
        ? `Nenhuma peça de ${categoryLabel(cat).toLowerCase()} do seu acervo combina com ${names.join(' e ')} — uniria os dois estilos.`
        : `Seu acervo de ${styleLabel(styleIds[0])} ainda não tem ${categoryLabel(cat).toLowerCase()} catalogado.`
    suggestions.push({ key: `${cat}-${styleIds.join('-')}`, title, reason, category: cat })
  }

  return suggestions.slice(0, 4)
}
