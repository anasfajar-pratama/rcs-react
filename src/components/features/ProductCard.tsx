import { useState } from 'react'
import { Link } from 'wouter'
import { Heart, Eye, Crown, Star } from 'lucide-react'
import { useWishlist } from '../../hooks/use-wishlist'
import { cn, formatPrice } from '../../lib/utils'
import type { Product } from '../../data/products'
import { getBrandByCategory } from '../../data/brands'

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
  rank?: number
}

function formatSoldCount(count?: number): string {
  if (!count) return ''
  if (count >= 1000) {
    return (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1).replace(/\.0$/, '') + 'rb'
  }
  return count.toString()
}

export function ProductCard({ product, onQuickView, rank }: ProductCardProps) {
  const { isWishlisted, toggleItem } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const [imgError, setImgError] = useState(false)

  const productImage = product.images?.[0]?.imageUrl || product.imageUrl
  const brandCfg = getBrandByCategory(product.category)
  const brand = {
    name: brandCfg?.name || product.category,
    bg: brandCfg?.color || '#D4A574',
    text: brandCfg?.name === 'PIJAR NALA' ? '#2D3748' : '#FFFFFF',
  }
  const rating = product.rating ?? 0
  const filledStars = Math.round(rating)

  return (
    <div className="group relative bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      {/* TOP Badge */}
      {rank && rank <= 4 && (
        <div
          className="absolute top-0 left-0 z-10 flex flex-col items-center pointer-events-none"
          title={`Top ${rank} Terlaris`}
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)',
            background: 'linear-gradient(180deg, #fbbf24 0%, #eab308 25%, #d97706 60%, #ea580c 100%)',
            width: 60,
            padding: '8px 6px 12px',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)',
            }}
          />
          <Crown className="h-3.5 w-3.5 text-white drop-shadow-sm" />
          <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/90 leading-none mt-0.5">
            TOP
          </span>
          <span className="text-2xl font-black leading-none text-white drop-shadow-md -mt-0.5">
            {rank}
          </span>
        </div>
      )}
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-8">
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
          {/* Brand Badge */}
          <div
            className="absolute bottom-2 left-2 z-10 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider pointer-events-none"
            style={{
              backgroundColor: brand.bg,
              color: brand.text,
            }}
          >
            {brand.name}
          </div>
        </div>
      </Link>

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

      <div className="p-4 space-y-1.5">
        {/* Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-heading font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Terjual + Rating */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {product.soldCount ? (
            <span>Terjual {formatSoldCount(product.soldCount)}</span>
          ) : <span />}
          {rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'h-3 w-3',
                      star <= filledStars ? 'fill-primary text-primary' : 'text-muted-foreground/30'
                    )}
                  />
                ))}
              </div>
              <span className="font-semibold text-foreground">{rating}</span>
            </div>
          )}
        </div>

        {/* Harga - Harga Coret + Diskon */}
        {product.price ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-base text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 shrink-0">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>
        ) : null}

        {/* Manfaat */}
        <div className="flex gap-1.5 flex-wrap">
          {product.benefits?.slice(0, 2).map((b, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary whitespace-nowrap">
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
