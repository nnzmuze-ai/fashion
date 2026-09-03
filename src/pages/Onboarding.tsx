import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../db'
import { STYLES, type StyleTag } from '../types'
import { StyleIcon } from '../components/StyleIcon'
import { CheckIcon } from '../components/Icons'
import './Onboarding.css'

export default function Onboarding() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Set<StyleTag>>(new Set())

  function toggle(id: StyleTag) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function finish(styles: StyleTag[]) {
    await db.profile.put({ id: 'main', styles, onboarded: true })
    navigate('/guarda-roupa', { replace: true })
  }

  return (
    <div className="onboarding">
      <div className="brand">
        <div className="word">RW</div>
        <div className="tagline">seu guarda-roupa, seu ritual</div>
      </div>

      <div className="heading">Quais estilos te definem?</div>
      <div className="subtext">Escolha um ou mais — você pode ajustar depois no seu perfil.</div>

      <div className="styles-grid">
        {STYLES.map((s) => {
          const isSel = selected.has(s.id)
          const full = s.id === 'androgino'
          return (
            <button
              key={s.id}
              type="button"
              className={`opt${isSel ? ' sel' : ''}${full ? ' full' : ''}`}
              onClick={() => toggle(s.id)}
            >
              {isSel && (
                <div className="check">
                  <CheckIcon />
                </div>
              )}
              <div className="opt-icon">
                <StyleIcon style={s.id} />
              </div>
              <div className="lbl">{s.label}</div>
            </button>
          )
        })}
      </div>

      <button type="button" className="btn" disabled={selected.size === 0} onClick={() => finish(Array.from(selected))}>
        Continuar
      </button>
      <button type="button" className="skip" onClick={() => finish([])}>
        Pular por enquanto
      </button>
    </div>
  )
}
