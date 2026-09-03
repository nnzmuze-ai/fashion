import { NavLink } from 'react-router-dom'
import { WardrobeIcon, OutfitsIcon, LookbookIcon, WishlistIcon, ProfileIcon } from './Icons'

const ITEMS = [
  { to: '/guarda-roupa', label: 'Guarda-roupa', Icon: WardrobeIcon },
  { to: '/outfits', label: 'Outfits', Icon: OutfitsIcon },
  { to: '/lookbook', label: 'Lookbook', Icon: LookbookIcon },
  { to: '/wishlist', label: 'Wishlist', Icon: WishlistIcon },
  { to: '/perfil', label: 'Perfil', Icon: ProfileIcon },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <Icon className="ic" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
