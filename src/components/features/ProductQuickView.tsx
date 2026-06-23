import { useState, useEffect, useCallback } from 'react'
import { X, Heart, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useWishlist } from '../../hooks/use-wishlist'
import { cn } from '../../lib/utils'
import type { Product } from '../../data/products'

interface ProductQuickViewProps {
  product: Product
  onClose: () => void
}

export function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  const { isWishlisted, toggleItem } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  const images = product.images?.length
    ? product.images.map((img) => img.imageUrl)
    : product.imageUrl
      ? [product.imageUrl]
      : []

  const [currentIndex, setCurrentIndex] = useState(0)

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(goNext, 4000)
    return () => clearInterval(timer)
  }, [images.length, goNext])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 border border-border flex items-center justify-center hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
          {images.length > 0 ? (
            <>
              {images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`${product.name} ${i + 1}`}
                  className={cn(
                    'absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-500',
                    i === currentIndex ? 'opacity-100' : 'opacity-0'
                  )}
                />
              ))}

              {images.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 border border-border flex items-center justify-center hover:bg-white z-10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 border border-border flex items-center justify-center hover:bg-white z-10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={cn(
                          'w-2 h-2 rounded-full transition-all',
                          i === currentIndex
                            ? 'bg-primary w-4'
                            : 'bg-white/60 hover:bg-white/80'
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="font-heading text-5xl font-bold text-primary/30">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <Badge variant="outline" className="mb-3">{product.category}</Badge>
          <h2 className="font-heading text-xl font-bold mb-1">{product.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{product.tagline}</p>

          {product.benefits && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Manfaat:</h4>
              <ul className="space-y-1">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={() => toggleItem(product.id)} variant={wishlisted ? 'default' : 'outline'} className="flex-1">
              <Heart className={cn('h-4 w-4', wishlisted && 'fill-white')} />
              {wishlisted ? 'Di Wishlist' : 'Tambah ke Wishlist'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
