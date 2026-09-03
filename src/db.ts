import Dexie, { type Table } from 'dexie'
import type { ClothingItem, Outfit, Profile, WishlistItem } from './types'

class RWDatabase extends Dexie {
  items!: Table<ClothingItem, number>
  outfits!: Table<Outfit, number>
  wishlist!: Table<WishlistItem, number>
  profile!: Table<Profile, string>

  constructor() {
    super('rw-wardrobe')
    this.version(1).stores({
      items: '++id, category, season, createdAt, *styles',
      outfits: '++id, style, occasion, createdAt',
      wishlist: '++id, createdAt',
      profile: 'id',
    })
  }
}

export const db = new RWDatabase()

export async function getProfile(): Promise<Profile> {
  const p = await db.profile.get('main')
  return p ?? { id: 'main', styles: [], onboarded: false }
}
