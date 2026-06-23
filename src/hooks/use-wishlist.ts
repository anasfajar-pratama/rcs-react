import { useWishlistStore } from '../store/wishlist'

export function useWishlist() {
  const items = useWishlistStore((s) => s.items)
  const addItem = useWishlistStore((s) => s.addItem)
  const removeItem = useWishlistStore((s) => s.removeItem)
  const toggleItem = useWishlistStore((s) => s.toggleItem)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted)

  return { items, addItem, removeItem, toggleItem, isWishlisted }
}
