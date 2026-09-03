import type { ReactNode } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { getProfile } from './db'
import Onboarding from './pages/Onboarding'
import Wardrobe from './pages/Wardrobe'
import ItemForm from './pages/ItemForm'
import OutfitGenerator from './pages/OutfitGenerator'
import Lookbook from './pages/Lookbook'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'

function Gate() {
  const profile = useLiveQuery(() => getProfile(), [])
  if (profile === undefined) return null
  return <Navigate to={profile.onboarded ? '/guarda-roupa' : '/onboarding'} replace />
}

function RequireOnboarded({ children }: { children: ReactNode }) {
  const profile = useLiveQuery(() => getProfile(), [])
  if (profile === undefined) return null
  if (!profile.onboarded) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Gate />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/guarda-roupa"
            element={
              <RequireOnboarded>
                <Wardrobe />
              </RequireOnboarded>
            }
          />
          <Route
            path="/guarda-roupa/nova"
            element={
              <RequireOnboarded>
                <ItemForm />
              </RequireOnboarded>
            }
          />
          <Route
            path="/guarda-roupa/:id"
            element={
              <RequireOnboarded>
                <ItemForm />
              </RequireOnboarded>
            }
          />
          <Route
            path="/outfits"
            element={
              <RequireOnboarded>
                <OutfitGenerator />
              </RequireOnboarded>
            }
          />
          <Route
            path="/lookbook"
            element={
              <RequireOnboarded>
                <Lookbook />
              </RequireOnboarded>
            }
          />
          <Route
            path="/wishlist"
            element={
              <RequireOnboarded>
                <Wishlist />
              </RequireOnboarded>
            }
          />
          <Route
            path="/perfil"
            element={
              <RequireOnboarded>
                <Profile />
              </RequireOnboarded>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
