import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { db } from '../db'
import { BottomNav } from '../components/BottomNav'
import { Chip, Pill } from '../components/Chip'
import { GarmentIcon } from '../components/GarmentIcon'
import { SearchIcon, ProfileIcon, PlusIcon } from '../components/Icons'
import { CATEGORIES, STYLES, styleLabel, type Category, type StyleTag } from '../types'
import './Wardrobe.css'

export default function Wardrobe() {
  const navigate = useNavigate()
  const items = useLiveQuery(() => db.items.orderBy('createdAt').reverse().toArray(), [])
  const [style, setStyle] = useState<StyleTag | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const filtered = useMemo(() => {
    if (!items) return []
    return items.filter((it) => {
      if (style && !it.styles.includes(style)) return false
      if (category && it.category !== category) return false
      if (search.trim() && !it.name.toLowerCase().includes(search.trim().toLowerCase())) return false
      return true
    })
  }, [items, style, category, search])

  return (
    <>
      <div className="wardrobe-header">
        <div>
          <div className="word">RW</div>
          <div className="sub">{items ? `${items.length} PEÇA${items.length === 1 ? '' : 'S'} CATALOGADA${items.length === 1 ? '' : 'S'}` : ' '}</div>
        </div>
        <div className="htools">
          <button type="button" className="icon-btn" onClick={() => setShowSearch((v) => !v)} aria-label="Buscar">
            <SearchIcon />
          </button>
          <button type="button" className="icon-btn" onClick={() => navigate('/perfil')} aria-label="Perfil">
            <ProfileIcon size={24} />
          </button>
        </div>
      </div>

      {showSearch && (
        <div style={{ padding: '0 20px 6px' }}>
          <input
            className="input"
            placeholder="Buscar peça pelo nome…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      )}

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
      <div className="pill-row">
        <Pill active={category === null} onClick={() => setCategory(null)}>
          Todas categorias
        </Pill>
        {CATEGORIES.map((c) => (
          <Pill key={c.id} active={category === c.id} onClick={() => setCategory(c.id === category ? null : c.id)}>
            {c.label}
          </Pill>
        ))}
      </div>

      <div className="scroll-area">
        {items && items.length === 0 && (
          <div className="empty-state">
            Seu guarda-roupa ainda está vazio.
            <br />
            Comece catalogando sua primeira peça.
            <div className="btn" onClick={() => navigate('/guarda-roupa/nova')}>
              Cadastrar primeira peça
            </div>
          </div>
        )}
        {items && items.length > 0 && filtered.length === 0 && (
          <div className="empty-state">Nenhuma peça encontrada com esses filtros.</div>
        )}
        {filtered.length > 0 && (
          <div className="item-grid">
            {filtered.map((item) => (
              <button key={item.id} type="button" className="card" onClick={() => navigate(`/guarda-roupa/${item.id}`)}>
                <div className="thumb">
                  {item.photo ? <img src={item.photo} alt={item.name} /> : <GarmentIcon category={item.category} size={40} />}
                </div>
                <div className="name">{item.name}</div>
                <div className="tag">{item.styles[0] ? styleLabel(item.styles[0]) : 'Sem estilo'}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <button type="button" className="fab" onClick={() => navigate('/guarda-roupa/nova')} aria-label="Adicionar peça">
        <PlusIcon size={24} />
      </button>

      <BottomNav />
    </>
  )
}
