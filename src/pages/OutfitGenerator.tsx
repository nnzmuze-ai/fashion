import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { BottomNav } from '../components/BottomNav'
import { Chip, Pill } from '../components/Chip'
import { GarmentIcon } from '../components/GarmentIcon'
import { ShuffleIcon } from '../components/Icons'
import { generateOutfit, type GeneratedOutfit } from '../lib/outfitGenerator'
import { categoryLabel, OCCASIONS, STYLES, type Occasion, type StyleTag } from '../types'
import './OutfitGenerator.css'

export default function OutfitGenerator() {
  const items = useLiveQuery(() => db.items.toArray(), [])
  const profile = useLiveQuery(() => db.profile.get('main'), [])
  const [style, setStyle] = useState<StyleTag | null>(null)
  const [occasion, setOccasion] = useState<Occasion>('dia-a-dia')
  const [result, setResult] = useState<GeneratedOutfit | 'insufficient' | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!style && profile && profile.styles.length > 0) setStyle(profile.styles[0])
    else if (!style) setStyle(STYLES[0].id)
  }, [profile, style])

  useEffect(() => {
    if (!items || !style) return
    setResult(generateOutfit(items, style, occasion))
    setSaved(false)
  }, [items, style, occasion])

  function shuffle() {
    if (!items || !style) return
    setResult(generateOutfit(items, style, occasion))
    setSaved(false)
  }

  async function saveToLookbook() {
    if (!result || result === 'insufficient' || !style) return
    await db.outfits.add({
      name: `Look ${STYLES.find((s) => s.id === style)?.label} · ${OCCASIONS.find((o) => o.id === occasion)?.label}`,
      style,
      occasion,
      itemIds: result.pieces.map((p) => p.id!).filter(Boolean),
      explanation: result.explanation,
      createdAt: Date.now(),
      usedAt: [],
    })
    setSaved(true)
  }

  return (
    <>
      <div className="screen-header">
        <div className="screen-title">GERADOR DE OUTFITS</div>
      </div>

      <div className="chip-row">
        {STYLES.map((s) => (
          <Chip key={s.id} active={style === s.id} onClick={() => setStyle(s.id)}>
            {s.label}
          </Chip>
        ))}
      </div>
      <div className="pill-row">
        {OCCASIONS.map((o) => (
          <Pill key={o.id} active={occasion === o.id} onClick={() => setOccasion(o.id)}>
            {o.label}
          </Pill>
        ))}
      </div>

      <div className="scroll-area">
        {result === 'insufficient' && (
          <div className="empty-state">
            Você ainda não tem peças suficientes catalogadas em <strong>{STYLES.find((s) => s.id === style)?.label}</strong> para
            montar um look completo.
            <br />
            Cadastre mais peças desse estilo no seu guarda-roupa.
          </div>
        )}

        {result && result !== 'insufficient' && (
          <>
            <div className="panel">
              <div className="panel-title">Seu look de hoje</div>
              {result.pieces.map((p) => (
                <div className="piece" key={p.id}>
                  <div className="pthumb">
                    {p.photo ? <img src={p.photo} alt={p.name} /> : <GarmentIcon category={p.category} size={22} />}
                  </div>
                  <div>
                    <div className="pname">{p.name}</div>
                    <div className="ptag">{categoryLabel(p.category)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="why">
              <div className="why-title">Por que funciona</div>
              <div className="why-text">{result.explanation}</div>
            </div>
          </>
        )}
      </div>

      {result && result !== 'insufficient' && (
        <div className="actions">
          <button type="button" className="btn" style={{ flex: 1 }} onClick={saveToLookbook}>
            {saved ? 'Salvo no Lookbook ✓' : 'Salvar no Lookbook'}
          </button>
          <button type="button" className="btn-icon-square" onClick={shuffle} aria-label="Gerar outro">
            <ShuffleIcon />
          </button>
        </div>
      )}

      <BottomNav />
    </>
  )
}
