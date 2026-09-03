import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { BottomNav } from '../components/BottomNav'
import { GarmentIcon } from '../components/GarmentIcon'
import { CloseIcon, PlusIcon } from '../components/Icons'
import { computeGapSuggestions, computeStyleDistribution } from '../lib/wishlistInsights'
import './Wishlist.css'

export default function Wishlist() {
  const items = useLiveQuery(() => db.items.toArray(), [])
  const wishlist = useLiveQuery(() => db.wishlist.orderBy('createdAt').reverse().toArray(), [])
  const [draft, setDraft] = useState('')

  const distribution = useMemo(() => computeStyleDistribution(items ?? []), [items])
  const suggestions = useMemo(() => computeGapSuggestions(items ?? []), [items])
  const maxCount = distribution[0]?.count ?? 1

  async function addWishlistItem() {
    const name = draft.trim()
    if (!name) return
    await db.wishlist.add({ name, createdAt: Date.now() })
    setDraft('')
  }

  async function addSuggestion(title: string, reason: string) {
    await db.wishlist.add({ name: title, note: reason, createdAt: Date.now() })
  }

  async function removeWishlistItem(id?: number) {
    if (!id) return
    await db.wishlist.delete(id)
  }

  return (
    <>
      <div className="screen-header">
        <div className="screen-title">WISHLIST &amp; SUGESTÕES</div>
      </div>

      <div className="scroll-area">
        <div className="section">
          <div className="stitle">Seu raio-x de estilo</div>
          {distribution.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px 0' }}>
              Catalogue algumas peças com estilo definido para ver a distribuição do seu guarda-roupa.
            </div>
          ) : (
            distribution.map((d) => (
              <div className="barrow" key={d.style}>
                <div className="barlabel">
                  <span>{d.label}</span>
                  <span className="pct">{d.pct}%</span>
                </div>
                <div className="track">
                  <div className="fill" style={{ width: `${Math.round((d.count / maxCount) * 100)}%` }} />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="section">
          <div className="stitle">Peças que faltam</div>
          {suggestions.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px 0' }}>
              {items && items.length > 0
                ? 'Seu guarda-roupa já cobre bem as categorias essenciais dos seus estilos.'
                : 'Cadastre peças no guarda-roupa para receber sugestões personalizadas.'}
            </div>
          ) : (
            suggestions.map((s) => (
              <div className="suggest" key={s.key}>
                <div className="sicon">
                  <GarmentIcon category={s.category} size={22} />
                </div>
                <div>
                  <div className="sname">{s.title}</div>
                  <div className="sdesc">{s.reason}</div>
                  <button type="button" className="sbtn" onClick={() => addSuggestion(s.title, s.reason)}>
                    Adicionar à wishlist
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="section">
          <div className="stitle">Sua wishlist</div>
          <div className="add-row">
            <input
              className="input"
              placeholder="Ex: Botas Cowboy Vinho"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addWishlistItem()}
            />
            <button type="button" className="btn-icon-square" onClick={addWishlistItem} aria-label="Adicionar">
              <PlusIcon />
            </button>
          </div>
          {wishlist && wishlist.length === 0 && <div className="empty-state" style={{ padding: '16px 0' }}>Sua wishlist está vazia.</div>}
          {wishlist && wishlist.length > 0 && (
            <div className="wrow">
              {wishlist.map((w) => (
                <div className="witem" key={w.id}>
                  <div className="wthumb">
                    <span className="wname-inner">{w.name}</span>
                    <button type="button" className="wremove" onClick={() => removeWishlistItem(w.id)} aria-label="Remover">
                      <CloseIcon />
                    </button>
                  </div>
                  {w.note && <div className="wnote">{w.note}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </>
  )
}
