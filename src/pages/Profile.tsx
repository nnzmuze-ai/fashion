import { useLiveQuery } from 'dexie-react-hooks'
import { db, getProfile } from '../db'
import { BottomNav } from '../components/BottomNav'
import { StyleIcon } from '../components/StyleIcon'
import { STYLES, type StyleTag } from '../types'
import './Profile.css'

export default function Profile() {
  const profile = useLiveQuery(() => getProfile(), [])
  const itemCount = useLiveQuery(() => db.items.count(), [])
  const outfitCount = useLiveQuery(() => db.outfits.count(), [])
  const wishlistCount = useLiveQuery(() => db.wishlist.count(), [])

  async function toggleStyle(id: StyleTag) {
    const current = profile ?? { id: 'main' as const, styles: [], onboarded: true }
    const has = current.styles.includes(id)
    const styles = has ? current.styles.filter((s) => s !== id) : [...current.styles, id]
    await db.profile.put({ id: 'main', styles, onboarded: true })
  }

  async function resetAll() {
    if (!confirm('Isso vai apagar todas as peças, looks e a wishlist salvos neste dispositivo. Continuar?')) return
    await db.items.clear()
    await db.outfits.clear()
    await db.wishlist.clear()
    await db.profile.clear()
    location.reload()
  }

  return (
    <>
      <div className="screen-header">
        <div className="screen-title">PERFIL</div>
      </div>

      <div className="scroll-area">
        <div className="brand-mini">
          <div className="word">RW</div>
        </div>

        <div className="stats-row">
          <div className="stat">
            <div className="stat-num">{itemCount ?? 0}</div>
            <div className="stat-lbl">Peças</div>
          </div>
          <div className="stat">
            <div className="stat-num">{outfitCount ?? 0}</div>
            <div className="stat-lbl">Looks</div>
          </div>
          <div className="stat">
            <div className="stat-num">{wishlistCount ?? 0}</div>
            <div className="stat-lbl">Wishlist</div>
          </div>
        </div>

        <div className="stitle" style={{ marginTop: 8 }}>
          Seus estilos
        </div>
        <div className="styles-grid-profile">
          {STYLES.map((s) => {
            const isSel = profile?.styles.includes(s.id) ?? false
            return (
              <button key={s.id} type="button" className={`opt${isSel ? ' sel' : ''}`} onClick={() => toggleStyle(s.id)}>
                <div className="opt-icon">
                  <StyleIcon style={s.id} size={24} />
                </div>
                <div className="lbl">{s.label}</div>
              </button>
            )
          })}
        </div>

        <button type="button" className="btn-outline danger" onClick={resetAll}>
          Apagar todos os dados
        </button>
      </div>

      <BottomNav />
    </>
  )
}
