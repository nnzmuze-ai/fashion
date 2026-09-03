import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { BottomNav } from '../components/BottomNav'
import { Chip } from '../components/Chip'
import { GarmentIcon } from '../components/GarmentIcon'
import { CloseIcon } from '../components/Icons'
import { STYLES, styleLabel, type ClothingItem, type StyleTag } from '../types'
import './Lookbook.css'

function formatDate(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function Lookbook() {
  const outfits = useLiveQuery(() => db.outfits.orderBy('createdAt').reverse().toArray(), [])
  const items = useLiveQuery(() => db.items.toArray(), [])
  const [tab, setTab] = useState<'saved' | 'used'>('saved')
  const [style, setStyle] = useState<StyleTag | null>(null)

  const itemsById = useMemo(() => {
    const map = new Map<number, ClothingItem>()
    items?.forEach((i) => i.id && map.set(i.id, i))
    return map
  }, [items])

  const list = useMemo(() => {
    if (!outfits) return []
    let base = outfits
    if (tab === 'used') {
      base = base.filter((o) => o.usedAt.length > 0).sort((a, b) => Math.max(...b.usedAt) - Math.max(...a.usedAt))
    }
    if (style) base = base.filter((o) => o.style === style)
    return base
  }, [outfits, tab, style])

  async function markUsed(id?: number) {
    if (!id) return
    const outfit = await db.outfits.get(id)
    if (!outfit) return
    await db.outfits.update(id, { usedAt: [...outfit.usedAt, Date.now()] })
  }

  async function removeOutfit(id?: number) {
    if (!id) return
    if (!confirm('Remover este look do lookbook?')) return
    await db.outfits.delete(id)
  }

  return (
    <>
      <div className="screen-header">
        <div className="screen-title">LOOKBOOK</div>
      </div>

      <div className="tabs">
        <button type="button" className={`tab${tab === 'saved' ? ' active' : ''}`} onClick={() => setTab('saved')}>
          Salvos
        </button>
        <button type="button" className={`tab${tab === 'used' ? ' active' : ''}`} onClick={() => setTab('used')}>
          Usados recentemente
        </button>
      </div>

      <div className="chip-row">
        <Chip active={style === null} onClick={() => setStyle(null)}>
          Tudo
        </Chip>
        {STYLES.map((s) => (
          <Chip key={s.id} active={style === s.id} onClick={() => setStyle(s.id === style ? null : s.id)}>
            {s.label}
          </Chip>
        ))}
      </div>

      <div className="scroll-area">
        {list.length === 0 && (
          <div className="empty-state">
            {tab === 'saved' ? 'Nenhum look salvo ainda. Gere um outfit e salve aqui.' : 'Nenhum look marcado como usado ainda.'}
          </div>
        )}
        {list.length > 0 && (
          <div className="item-grid">
            {list.map((look) => {
              const pieces = look.itemIds.map((id) => itemsById.get(id)).filter((p): p is ClothingItem => Boolean(p))
              const lastUsed = look.usedAt.length > 0 ? Math.max(...look.usedAt) : null
              return (
                <div className="card look-card" key={look.id}>
                  <div className="thumb">
                    {pieces.slice(0, 2).map((p, i) => (
                      <span key={i} className="mini-thumb">
                        {p.photo ? <img src={p.photo} alt={p.name} /> : <GarmentIcon category={p.category} size={20} />}
                      </span>
                    ))}
                  </div>
                  <div className="name">{look.name}</div>
                  <div className="meta">
                    <span className="tag">{styleLabel(look.style)}</span>
                    <span className="used">{lastUsed ? formatDate(lastUsed) : '—'}</span>
                  </div>
                  <div className="look-actions">
                    <button type="button" className="btn-outline small" onClick={() => markUsed(look.id)}>
                      Marcar usado
                    </button>
                    <button type="button" className="icon-btn" onClick={() => removeOutfit(look.id)} aria-label="Remover look">
                      <CloseIcon size={12} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </>
  )
}
