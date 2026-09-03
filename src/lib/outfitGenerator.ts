import { categoryLabel, styleLabel, type ClothingItem, type Occasion, type StyleTag } from '../types'

export interface GeneratedOutfit {
  pieces: ClothingItem[]
  explanation: string
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

const OCCASION_LABEL: Record<Occasion, string> = {
  'dia-a-dia': 'o dia a dia',
  trabalho: 'o ambiente de trabalho',
  balada: 'uma noite fora',
  evento: 'um evento especial',
}

const OCCASION_CLOSER: Record<Occasion, string> = {
  'dia-a-dia': 'Confortável e ainda assim fiel ao seu estilo.',
  trabalho: 'Estruturado o bastante para o trabalho, sem perder a identidade.',
  balada: 'Com presença suficiente para uma noite fora.',
  evento: 'Elevado o bastante para ocasiões especiais.',
}

export function generateOutfit(items: ClothingItem[], style: StyleTag, occasion: Occasion): GeneratedOutfit | 'insufficient' {
  const pool = items.filter((it) => it.styles.includes(style))
  const byCategory = (cat: ClothingItem['category']) => pool.filter((it) => it.category === cat)

  const dresses = byCategory('dress')
  const tops = byCategory('top')
  const bottoms = byCategory('bottom')
  const shoes = byCategory('shoes')
  const outerwear = byCategory('outerwear')
  const accessories = [...byCategory('accessory'), ...byCategory('bag')]

  const pieces: ClothingItem[] = []
  const canTopBottom = tops.length > 0 && bottoms.length > 0
  const canOuterBottom = outerwear.length > 0 && bottoms.length > 0

  let baseType: 'dress' | 'top-bottom' | 'outer-bottom' | null = null
  const useDress = dresses.length > 0 && (!(canTopBottom || canOuterBottom) || Math.random() < 0.5)
  if (useDress) {
    const d = pickRandom(dresses)
    if (d) pieces.push(d)
    baseType = 'dress'
  } else if (canTopBottom) {
    const t = pickRandom(tops)
    const b = pickRandom(bottoms)
    if (t) pieces.push(t)
    if (b) pieces.push(b)
    baseType = 'top-bottom'
  } else if (canOuterBottom) {
    const o = pickRandom(outerwear)
    const b = pickRandom(bottoms)
    if (o) pieces.push(o)
    if (b) pieces.push(b)
    baseType = 'outer-bottom'
  } else if (dresses.length > 0) {
    const d = pickRandom(dresses)
    if (d) pieces.push(d)
    baseType = 'dress'
  }

  if (pieces.length === 0 || !baseType) return 'insufficient'

  const shoe = pickRandom(shoes)
  if (shoe) pieces.push(shoe)

  const usedIds = new Set(pieces.map((p) => p.id))
  const availableOuterwear = outerwear.filter((o) => !usedIds.has(o.id))
  if (availableOuterwear.length > 0 && (occasion === 'trabalho' || occasion === 'evento' || Math.random() < 0.5)) {
    const o = pickRandom(availableOuterwear)
    if (o) pieces.push(o)
  }

  if (accessories.length > 0) {
    const a = pickRandom(accessories)
    if (a) pieces.push(a)
  }

  if (pieces.length < 2) return 'insufficient'

  return { pieces, explanation: buildExplanation(pieces, style, occasion, baseType) }
}

function buildExplanation(
  pieces: ClothingItem[],
  style: StyleTag,
  occasion: Occasion,
  baseType: 'dress' | 'top-bottom' | 'outer-bottom',
): string {
  const colors = Array.from(new Set(pieces.map((p) => p.colorName)))
  const outerwearCount = pieces.filter((p) => p.category === 'outerwear').length
  const extraLayer = baseType === 'outer-bottom' ? outerwearCount > 1 : outerwearCount > 0
  const hasAccessory = pieces.some((p) => p.category === 'accessory' || p.category === 'bag')

  let colorSentence: string
  if (colors.length === 1) {
    colorSentence = `A combinação aposta em um visual monocromático em ${colors[0].toLowerCase()}, reforçando a identidade ${styleLabel(style).toLowerCase()}.`
  } else if (colors.length === 2) {
    colorSentence = `${colors[0]} e ${colors[1].toLowerCase()} conversam bem entre si, dando à combinação uma base coesa de cor.`
  } else {
    colorSentence = `A paleta mistura ${colors
      .slice(0, -1)
      .join(', ')
      .toLowerCase()} e ${colors[colors.length - 1].toLowerCase()}, com variação suficiente para manter o visual interessante sem perder unidade.`
  }

  let structureSentence: string
  if (baseType === 'dress') {
    structureSentence = 'A peça-base em vestido dá o tom da silhueta,'
  } else if (baseType === 'outer-bottom') {
    structureSentence = 'O casaco no papel de peça de cima, junto com a peça de baixo, forma a base da silhueta,'
  } else {
    structureSentence = 'A dupla de cima e baixo forma a base da silhueta,'
  }
  if (extraLayer) {
    structureSentence += ' complementada por uma camada externa extra que adiciona estrutura ao look.'
  } else if (hasAccessory) {
    structureSentence += ' equilibrada pelo acessório escolhido, que assina o visual sem competir com as outras peças.'
  } else {
    structureSentence += ' mantida limpa e direta, sem excesso de camadas.'
  }

  const closer = OCCASION_CLOSER[occasion]
  const catList = pieces.map((p) => categoryLabel(p.category).toLowerCase())
  const usedCategories = catList.filter((c, i) => catList.indexOf(c) === i)
  const opener = `Pensado para ${OCCASION_LABEL[occasion]}, este look reúne ${usedCategories.join(', ')} do seu acervo ${styleLabel(style).toLowerCase()}.`

  return `${opener} ${colorSentence} ${structureSentence} ${closer}`
}
