import { useState } from 'react'
import { Link } from 'wouter'
import { Heart, Eye } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useWishlist } from '../../hooks/use-wishlist'
import { cn } from '../../lib/utils'
import type { Product } from '../../data/products'

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

const categoryColors: Record<string, string> = {
  Wanita: 'bg-rose-50 text-rose-600 border-rose-200',
  Pria: 'bg-blue-50 text-blue-600 border-blue-200',
  Anak: 'bg-green-50 text-green-600 border-green-200',
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { isWishlisted, toggleItem } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const [imgError, setImgError] = useState(false)

  const productImage = product.images?.[0]?.imageUrl || product.imageUrl

  return (
    <div className="group relative bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-8">
          {productImage && !imgError ? (
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-sm"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <span className="font-heading text-4xl font-bold text-primary/20">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="absolute top-3 left-3">
        <Badge variant="outline" className={cn('text-xs', categoryColors[product.category])}>
          {product.category}
        </Badge>
      </div>

      <button
        onClick={(e) => { e.preventDefault(); toggleItem(product.id) }}
        className={cn(
          'absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-border flex items-center justify-center transition-all hover:scale-110',
          wishlisted ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        <Heart className={cn('h-4 w-4', wishlisted && 'fill-primary')} />
      </button>

      {onQuickView && (
        <button
          onClick={(e) => { e.preventDefault(); onQuickView(product) }}
          className="absolute top-14 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-heading font-semibold text-foreground mb-1 line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {product.tagline}
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {product.benefits?.slice(0, 2).map((b, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary">
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
