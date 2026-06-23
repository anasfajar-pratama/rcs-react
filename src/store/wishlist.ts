import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  items: number[]
  addItem: (id: number) => void
  removeItem: (id: number) => void
  toggleItem: (id: number) => void
  isWishlisted: (id: number) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) => set((state) => ({ items: [...state.items, id] })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i !== id) })),
      toggleItem: (id) => {
        const { items } = get()
        if (items.includes(id)) {
          set({ items: items.filter((i) => i !== id) })
        } else {
          set({ items: [...items, id] })
        }
      },
      isWishlisted: (id) => get().items.includes(id),
    }),
    { name: 'wishlist-storage' }
  )
)
