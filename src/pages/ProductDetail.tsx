import { useEffect, useState } from 'react'
import { useRoute, Link } from 'wouter'
import { ArrowLeft, Heart, Check, Scale, Ruler, Barcode, Award, BadgeCheck, FileText, ChevronLeft, ChevronRight, ShoppingCart, Store, Music2, MessageCircle, Crown, Sparkles, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { BeforeAfterSlider } from '../components/features/BeforeAfterSlider'
import { PageLoader } from '../components/ui/page-loader'
import { useWishlist } from '../hooks/use-wishlist'
import { cn, formatPrice } from '../lib/utils'
import api from '../lib/api'
import { fallbackProducts, type Product } from '../data/products'
import { getBrandByCategory } from '../data/brands'
import { useSiteSettings } from '../hooks/use-site-settings'

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id')
  const [product, setProduct] = useState<Product | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const { isWishlisted, toggleItem } = useWishlist()
  const [whatsappPhone, setWhatsappPhone] = useState('')
  const { settings } = useSiteSettings()

  useEffect(() => {
    api.get('/settings').then((res) => {
      if (res.data?.whatsapp_phone) setWhatsappPhone(res.data.whatsapp_phone)
    }).catch(() => {})
  }, [])

  const images = product?.images?.length ? product.images : []
  const allImages = images.length > 0
    ? images
    : product?.imageUrl
      ? [{ id: 0, imageUrl: product.imageUrl, isPrimary: true }]
      : []

  useEffect(() => {
    if (!params?.id) return
    setLoading(true)
    api.get(`/products/${params.id}`).then((res) => {
      const data = res.data
      if (data) {
        data.isPromo = !!data.isPromo
        data.isNew = !!data.isNew
        data.isFeatured = !!data.isFeatured
        data.halalCertified = !!data.halalCertified
      }
      setProduct(data)
    }).catch(() => {
      const found = fallbackProducts.find((p) => p.id === Number(params.id)) || null
      setProduct(found)
    }).finally(() => setLoading(false))
  }, [params?.id])

  useEffect(() => {
    setActiveImage(0)
  }, [product?.id])

  useEffect(() => {
    if (!allImages.length || allImages.length <= 1) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length)
      if (e.key === 'ArrowRight') setActiveImage((prev) => (prev + 1) % allImages.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [allImages.length])

  if (loading) {
    return <PageLoader logo={settings.site_logo} />
  }

  if (!product) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h1 className="font-heading text-2xl font-bold mb-4">Produk tidak ditemukan</h1>
        <Link href="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    )
  }

  const wishlisted = isWishlisted(product.id)
  const discountPercent = product.originalPrice && product.price && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  const brandConfig = getBrandByCategory(product.category)
  const brandName = brandConfig?.name || product.category

  return (
    <div className="pt-24 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={brandConfig ? `/brand/${brandConfig.slug}` : '/'} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Koleksi
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery - Slider */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className={cn(
              "aspect-square rounded-2xl flex items-center justify-center p-8 relative overflow-hidden",
            )} style={{ background: `linear-gradient(135deg, ${brandConfig?.colorLight || '#f0ebe6'} 0%, white 60%, ${brandConfig?.colorLight || '#f0ebe6'}40 100%)` }}>
              {allImages.length > 0 && allImages[activeImage]?.imageUrl ? (
                <img
                  key={activeImage}
                  src={allImages[activeImage]?.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <span className="font-heading text-7xl sm:text-9xl font-bold text-primary/20">
                    {product.name.charAt(0)}
                  </span>
                </div>
              )}
              {product.isFeatured && (
                <div
                  className="absolute top-0 left-0 z-10 flex flex-col items-center pointer-events-none"
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)',
                    background: 'linear-gradient(180deg, #fbbf24 0%, #eab308 25%, #d97706 60%, #ea580c 100%)',
                    width: 104,
                    padding: '16px 14px 24px',
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)',
                    }}
                  />
                  <Crown className="h-[23px] w-[23px] text-white drop-shadow-sm" />
                  <span className="text-[15px] font-bold uppercase tracking-[0.15em] text-white/90 leading-none mt-1">
                    TOP
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                {product.isNew && (
                  <div className="rounded-full bg-yellow-400 px-3 py-1 shadow-lg shadow-yellow-400/30">
                    <span className="flex items-center gap-1.5 text-yellow-900 text-[11px] font-bold tracking-wider">
                      <Sparkles className="h-3.5 w-3.5" /> Produk Baru
                    </span>
                  </div>
                )}
                {product.isPromo && discountPercent > 0 && (
                  <div className="rounded-lg bg-red-600 px-3 py-1 shadow-lg shadow-red-600/30">
                    <span className="flex items-center gap-1.5 text-white text-[12px] font-heading font-extrabold tracking-wider">
                      <Zap className="h-3.5 w-3.5" /> Extra Promo -{discountPercent}%
                    </span>
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-all"
                  >
                    <ChevronLeft className="h-5 w-5 text-foreground" />
                  </button>
                  <button
                    onClick={() => setActiveImage((prev) => (prev + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-all"
                  >
                    <ChevronRight className="h-5 w-5 text-foreground" />
                  </button>
                </>
              )}
            </div>

            {allImages.length > 1 && (
              <>
                <div className="flex justify-center gap-2 mt-4">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all",
                        activeImage === i ? "bg-primary w-6" : "bg-border hover:bg-primary/50"
                      )}
                    />
                  ))}
                </div>
                <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        "w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all",
                        activeImage === i ? 'border-primary' : 'border-border hover:border-primary/50'
                      )}
                    >
                      {img.imageUrl ? (
                        <img src={img.imageUrl} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <span className="font-heading text-lg font-bold text-primary/20">{i + 1}</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Before/After */}
            {product.showBeforeAfter && (
              <div className="mt-6 p-4 rounded-2xl border border-border bg-white">
                <h3 className="font-heading font-semibold text-base mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
                  Sebelum & Sesudah
                </h3>
                <BeforeAfterSlider beforeImage={product.beforeImage || undefined} afterImage={product.afterImage || undefined} />
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <Badge
                style={{
                  backgroundColor: brandConfig?.color || '#D4A574',
                  color: '#fff',
                  borderColor: brandConfig?.color || '#D4A574',
                }}
              >
                {brandName}
              </Badge>
              {product.subcategory && (
                <Badge variant="outline">{product.subcategory.name}</Badge>
              )}
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground mb-4">{product.tagline}</p>

            {product.price != null && (
              <div className="flex items-center gap-3 mb-4">
                <p className="text-2xl font-bold" style={{ color: brandConfig?.colorDark || 'var(--color-foreground)' }}>{formatPrice(product.price)}</p>
                {product.originalPrice != null && product.originalPrice > product.price && (
                  <>
                    <p className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
                    <span className="text-xs font-semibold text-white bg-destructive px-2 py-0.5 rounded-full">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Beli di */}
            {(product.shopeeUrl || product.tokopediaUrl || product.tiktokUrl || whatsappPhone) && (
              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-2">Beli di:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.shopeeUrl && (
                    <a href={product.shopeeUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <ShoppingCart className="h-4 w-4 text-orange-500" /> Shopee
                      </Button>
                    </a>
                  )}
                  {product.tokopediaUrl && (
                    <a href={product.tokopediaUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Store className="h-4 w-4 text-green-600" /> Tokopedia
                      </Button>
                    </a>
                  )}
                  {product.tiktokUrl && (
                    <a href={product.tiktokUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Music2 className="h-4 w-4" /> TikTok
                      </Button>
                    </a>
                  )}
                  {whatsappPhone && (
                    <a
                      href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Halo, saya ingin bertanya tentang produk ${product.name}\n\nLink produk: ${window.location.origin}/product/${product.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageCircle className="h-4 w-4 text-green-500" /> WhatsApp
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            )}

            <Separator className="mb-4" />

            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                onClick={() => toggleItem(product.id)}
                variant={wishlisted ? 'default' : 'outline'}
                className="gap-2"
              >
                <Heart className={cn('h-4 w-4', wishlisted && 'fill-white')} />
                {wishlisted ? 'Di Wishlist' : 'Tambah ke Wishlist'}
              </Button>
            </div>

            {product.description && (
              <div className="mb-6">
                <div className="text-base text-foreground/80 leading-relaxed tracking-wide max-w-prose text-justify prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-sm mb-3">Manfaat:</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-base text-foreground/80 leading-relaxed tracking-wide">
                      <Check className="h-4 w-4 shrink-0" style={{ color: brandConfig?.color || 'var(--color-primary)' }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* How to Use */}
            {product.howToUse && product.howToUse.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-sm mb-3">Cara Pakai:</h3>
                <ol className="space-y-2">
                  {product.howToUse.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-foreground/80 leading-relaxed tracking-wide text-justify">
                      <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${brandConfig?.color || 'var(--color-primary)'}20`, color: brandConfig?.color || 'var(--color-primary)' }}>
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && (
              <div className="mb-6">
                <h3 className="font-semibold text-sm mb-2">Bahan:</h3>
                <div className="text-base text-foreground/80 leading-relaxed tracking-wide text-justify prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.ingredients }} />
              </div>
            )}

            <Separator className="mb-6" />

            {/* Additional Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {product.weight && (
                <div className="flex items-center gap-2 text-base text-foreground/80 leading-relaxed tracking-wide">
                  <Scale className="h-4 w-4 shrink-0" />
                  <span>{product.weight}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex items-center gap-2 text-base text-foreground/80 leading-relaxed tracking-wide">
                  <Ruler className="h-4 w-4 shrink-0" />
                  <span>Dimensi: {product.dimensions}</span>
                </div>
              )}
              {product.bpomNumber && (
                <div className="flex items-center gap-2 text-base text-foreground/80 leading-relaxed tracking-wide">
                  <Barcode className="h-4 w-4 shrink-0" />
                  <span>BPOM: {product.bpomNumber}</span>
                </div>
              )}
              {product.warrantyInfo && (
                <div className="flex items-center gap-2 text-base text-foreground/80 leading-relaxed tracking-wide">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span>Expired Date: {product.warrantyInfo}</span>
                </div>
              )}
            </div>

            {/* Certifications */}
            {(product.certifications?.length || product.halalCertified) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.certifications?.map((cert, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    <Award className="h-3 w-3" /> {cert}
                  </Badge>
                ))}
                {product.halalCertified && (
                  <Badge variant="secondary" className="gap-1">
                    <BadgeCheck className="h-3 w-3" /> Halal
                  </Badge>
                )}
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </div>
  )
}
