import { useEffect, useState } from 'react'
import { useRoute, Link } from 'wouter'
import { ArrowLeft, Heart, Check, Scale, Ruler, Barcode, Award, BadgeCheck, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Skeleton } from '../components/ui/skeleton'
import { BeforeAfterSlider } from '../components/features/BeforeAfterSlider'
import { TechSpecs } from '../components/features/TechSpecs'
import { ComparisonTable } from '../components/features/ComparisonTable'
import { useWishlist } from '../hooks/use-wishlist'
import { cn, formatPrice } from '../lib/utils'
import api from '../lib/api'
import { fallbackProducts, type Product } from '../data/products'

const brandColors: Record<string, string> = {
  BLISERA: 'from-rose-400/20 to-pink-400/20',
  FOKKA: 'from-blue-900/20 to-slate-800/20',
  'PIJAR NALA': 'from-yellow-300/20 to-green-300/20',
}

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id')
  const [product, setProduct] = useState<Product | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [compareMode, setCompareMode] = useState(false)
  const [compareProducts, setCompareProducts] = useState<Product[]>([])
  const { isWishlisted, toggleItem } = useWishlist()

  useEffect(() => {
    if (!params?.id) return
    setLoading(true)
    api.get(`/products/${params.id}`).then((res) => {
      setProduct(res.data)
    }).catch(() => {
      const found = fallbackProducts.find((p) => p.id === Number(params.id)) || null
      setProduct(found)
    }).finally(() => setLoading(false))
  }, [params?.id])

  useEffect(() => {
    setActiveImage(0)
  }, [product?.id])

  useEffect(() => {
    if (product && !compareProducts.find((p) => p.id === product.id)) {
      setCompareProducts((prev) => [...prev, product].slice(0, 3))
    }
  }, [product])

  if (loading) {
    return (
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        <Skeleton className="h-8 w-32 mb-8 rounded-xl" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 rounded-xl" />
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <Skeleton className="h-4 w-1/2 rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
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
  const images = product.images?.length ? product.images : []
  const allImages = images.length > 0
    ? images
    : product.imageUrl
      ? [{ id: 0, imageUrl: product.imageUrl, isPrimary: true }]
      : []

  const brand = product.subcategory?.category === 'Wanita' ? 'BLISERA'
    : product.subcategory?.category === 'Pria' ? 'FOKKA'
    : 'PIJAR NALA'

  const defaultSpecs = [
    { label: 'Material', value: product.ingredients || 'Premium food-grade' },
    { label: 'Berat', value: product.weight || '200g' },
    { label: 'Dimensi', value: product.dimensions || '15 x 5 x 3 cm' },
    { label: 'Garansi', value: product.warrantyInfo || '1 tahun' },
    { label: 'BPOM', value: product.bpomNumber || 'Terdaftar' },
  ]

  return (
    <div className="pt-24 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={product.category === 'Wanita' ? '/brand/blisera' : product.category === 'Pria' ? '/brand/fokka' : '/brand/pijar-nala'} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Koleksi
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={cn(
              "aspect-square rounded-2xl bg-gradient-to-br flex items-center justify-center p-8 mb-4 relative overflow-hidden",
              brandColors[brand] || 'from-primary/10 to-accent/10'
            )}>
              {allImages.length > 0 && allImages[0]?.imageUrl ? (
                <img
                  src={allImages[activeImage]?.imageUrl || allImages[0]?.imageUrl}
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
              {product.isNew && (
                <Badge variant="default" className="absolute top-4 left-4">Baru</Badge>
              )}
              {product.isPromo && (
                <Badge variant="destructive" className="absolute top-4 right-4">Promo</Badge>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "w-20 h-20 rounded-xl border-2 overflow-hidden shrink-0 transition-all",
                      activeImage === i ? 'border-primary' : 'border-border hover:border-primary/50'
                    )}
                  >
                    {img.imageUrl ? (
                      <img src={img.imageUrl} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <span className="font-heading text-xl font-bold text-primary/20">{i + 1}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">{product.category}</Badge>
              {product.subcategory && (
                <Badge variant="outline">{product.subcategory.name}</Badge>
              )}
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground mb-4">{product.tagline}</p>

            {product.price && (
              <p className="text-2xl font-bold text-primary mb-6">{formatPrice(product.price)}</p>
            )}

            {product.description && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-sm mb-3">Manfaat:</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0" />
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
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
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
                <p className="text-sm text-muted-foreground">{product.ingredients}</p>
              </div>
            )}

            <Separator className="mb-6" />

            {/* Additional Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {product.weight && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Scale className="h-4 w-4 shrink-0" />
                  <span>{product.weight}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Ruler className="h-4 w-4 shrink-0" />
                  <span>{product.dimensions}</span>
                </div>
              )}
              {product.bpomNumber && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Barcode className="h-4 w-4 shrink-0" />
                  <span>BPOM: {product.bpomNumber}</span>
                </div>
              )}
              {product.warrantyInfo && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span>{product.warrantyInfo}</span>
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

            <Separator className="mb-6" />

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => toggleItem(product.id)}
                variant={wishlisted ? 'default' : 'outline'}
                className="gap-2"
              >
                <Heart className={cn('h-4 w-4', wishlisted && 'fill-white')} />
                {wishlisted ? 'Di Wishlist' : 'Tambah ke Wishlist'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setCompareMode(!compareMode)}
              >
                {compareMode ? 'Tutup' : 'Bandingkan'}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Before/After + Tech Specs */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <BeforeAfterSlider />
          <TechSpecs specs={defaultSpecs} />
        </div>

        {/* Comparison Table */}
        {compareMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <h2 className="font-heading text-xl font-bold mb-6">Perbandingan Produk</h2>
            <div className="rounded-2xl border border-border bg-white overflow-hidden">
              <ComparisonTable
                products={compareProducts}
                onRemove={(id) => setCompareProducts((prev) => prev.filter((p) => p.id !== id))}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
