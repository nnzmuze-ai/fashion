import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../db'
import { Pill } from '../components/Chip'
import { GarmentIcon } from '../components/GarmentIcon'
import { BackIcon, EditIcon, CameraIcon } from '../components/Icons'
import { fileToCompressedDataUrl } from '../lib/image'
import { CATEGORIES, COLOR_PALETTE, SEASONS, STYLES, type Category, type Season, type StyleTag } from '../types'
import './ItemForm.css'

export default function ItemForm() {
  const { id } = useParams()
  const editingId = id ? Number(id) : null
  const existing = useLiveQuery(() => (editingId ? db.items.get(editingId) : undefined), [editingId])
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('top')
  const [color, setColor] = useState(COLOR_PALETTE[0])
  const [styles, setStyles] = useState<Set<StyleTag>>(new Set())
  const [season, setSeason] = useState<Season>('todas')
  const [photo, setPhoto] = useState('')
  const [loadedExisting, setLoadedExisting] = useState(false)

  useEffect(() => {
    if (existing && !loadedExisting) {
      setName(existing.name)
      setCategory(existing.category)
      setColor({ name: existing.colorName, value: existing.colorValue })
      setStyles(new Set(existing.styles))
      setSeason(existing.season)
      setPhoto(existing.photo)
      setLoadedExisting(true)
    }
  }, [existing, loadedExisting])

  function toggleStyle(s: StyleTag) {
    setStyles((prev) => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })
  }

  async function onPhotoSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await fileToCompressedDataUrl(file)
    setPhoto(dataUrl)
  }

  const canSave = name.trim().length > 0

  async function save() {
    if (!canSave) return
    const payload = {
      name: name.trim(),
      category,
      colorName: color.name,
      colorValue: color.value,
      styles: Array.from(styles),
      season,
      photo,
    }
    if (editingId) {
      await db.items.update(editingId, payload)
    } else {
      await db.items.add({ ...payload, createdAt: Date.now() })
    }
    navigate('/guarda-roupa')
  }

  async function remove() {
    if (!editingId) return
    if (!confirm('Remover esta peça do guarda-roupa?')) return
    await db.items.delete(editingId)
    navigate('/guarda-roupa')
  }

  return (
    <>
      <div className="screen-header-row">
        <button type="button" className="icon-btn" onClick={() => navigate(-1)} aria-label="Voltar">
          <BackIcon />
        </button>
        <div className="screen-title" style={{ fontSize: 15 }}>
          {editingId ? 'EDITAR PEÇA' : 'NOVA PEÇA'}
        </div>
        <button type="button" className="hact" disabled={!canSave} onClick={save}>
          Salvar
        </button>
      </div>

      <div className="scroll-area" style={{ paddingTop: 20 }}>
        <div className="photo-box" onClick={() => fileRef.current?.click()}>
          {photo ? <img src={photo} alt="Prévia da peça" /> : <CameraIcon />}
          {!photo && <div className="photo-hint">Toque para adicionar foto</div>}
          {photo && (
            <div className="edit-badge">
              <EditIcon />
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPhotoSelected} />

        <div className="field">
          <div className="label">Nome da peça</div>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Blazer Estruturado Preto" />
        </div>

        <div className="field">
          <div className="label">Categoria</div>
          <div className="row-wrap">
            {CATEGORIES.map((c) => (
              <Pill key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
                {c.label}
              </Pill>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="label">Cor</div>
          <div className="row-wrap">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.name}
                type="button"
                className={`swatch${color.name === c.name ? ' sel' : ''}`}
                title={c.name}
                onClick={() => setColor(c)}
              >
                <span className="dot" style={{ background: c.value }} />
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="label">Estilo(s)</div>
          <div className="row-wrap">
            {STYLES.map((s) => (
              <Pill key={s.id} active={styles.has(s.id)} onClick={() => toggleStyle(s.id)}>
                {s.label}
              </Pill>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="label">Estação</div>
          <div className="row-wrap">
            {SEASONS.map((s) => (
              <Pill key={s.id} active={season === s.id} onClick={() => setSeason(s.id)}>
                {s.label}
              </Pill>
            ))}
          </div>
        </div>

        {editingId && (
          <button type="button" className="btn-outline" style={{ width: '100%', color: 'oklch(58% 0.16 25)', borderColor: 'oklch(58% 0.16 25)' }} onClick={remove}>
            Remover peça
          </button>
        )}

        {!photo && category && (
          <div className="fallback-note">
            <GarmentIcon category={category} size={16} /> Sem foto ainda — a peça aparecerá com um ícone no guarda-roupa até você adicionar uma.
          </div>
        )}
      </div>
    </>
  )
}
