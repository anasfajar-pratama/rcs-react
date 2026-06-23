import { useEffect, useState } from 'react'
import { Sparkles, Heart, Shield, Zap, Wind, Briefcase, Leaf, Smile } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '../../components/ui/badge'
import { ProductCard } from '../../components/features/ProductCard'
import { ProductQuickView } from '../../components/features/ProductQuickView'
import { useSiteSettings } from '../../hooks/use-site-settings'
import { getBrandBySlug } from '../../data/brands'
import api from '../../lib/api'
import { fallbackProducts, type Product } from '../../data/products'

const iconMap: Record<string, typeof Sparkles> = {
  Sparkles, Heart, Shield, Zap, Wind, Briefcase, Leaf, Smile,
}

interface BrandPageProps {
  slug: string
}

export default function BrandPage({ slug }: BrandPageProps) {
  const brand = getBrandBySlug(slug)
  const { settings } = useSiteSettings()
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const logoStyle = brand ? settings[`logo_style_${brand.key}`] || 'rounded' : 'rounded'
  const logoClass = logoStyle === 'circle' ? 'rounded-full' : logoStyle === 'square' ? 'rounded-none' : 'rounded-3xl'

  useEffect(() => {
    if (!brand) return
    api.get(`/products?category=${brand.category}`).then((res) => {
      if (res.data?.length) setProducts(res.data)
    }).catch(() => {})
  }, [brand?.category])

  if (!brand) return null

  const logo = settings[`logo_${brand.key}`]
  const brandName = settings[`brand_${brand.key}_name`] || brand.name
  const tagline = settings[`brand_${brand.key}_tagline`] || brand.tagline
  const description = settings[`brand_${brand.key}_description`] || brand.description
  const about = settings[`brand_${brand.key}_about`] || brand.about

  return (
    <div>
      {/* Hero */}
      <section
        className="relative pt-28 pb-20 sm:pb-28 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${brand.colorLight} 0%, white 50%, ${brand.colorLight}40 100%)` }}
      >
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: brand.color, transform: 'translate(30%, -30%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: brand.color, transform: 'translate(-20%, 20%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-2"
              >
                <Badge
                  className="text-xs px-3 py-1"
                  style={{
                    background: brand.colorLight,
                    color: brand.colorDark,
                    borderColor: brand.color,
                  }}
                >
                  {brandName}
                </Badge>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-3"
                style={{ color: brand.colorDark }}
              >
                {brandName}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-lg sm:text-xl font-medium mb-2"
                style={{ color: brand.color }}
              >
                {tagline}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="text-muted-foreground leading-relaxed max-w-lg"
              >
                {description}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden md:flex items-center justify-center"
            >
              <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
                <div
                  className="absolute inset-4 rounded-full opacity-40 blur-2xl"
                  style={{ background: brand.color }}
                />
                {logo ? (
                  <img
                    src={logo}
                    alt={brandName}
                    className={`relative w-full h-full object-contain drop-shadow-2xl p-8 ${logoClass}`}
                  />
                ) : (
                  <div
                    className="relative w-48 h-48 rounded-3xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${brand.colorLight}, ${brand.color}20)` }}
                  >
                    <span className="font-heading text-6xl font-bold" style={{ color: brand.color }}>
                      {brandName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2
                className="font-heading text-3xl font-bold mb-4"
                style={{ color: brand.colorDark }}
              >
                Tentang {brandName}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {about.split('. ').map((paragraph, i) => (
                  <p key={i}>{paragraph}.</p>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {brand.values.map((v, i) => {
                const Icon = iconMap[v.icon] || Sparkles
                return (
                  <div
                    key={v.title}
                    className="p-5 rounded-2xl border"
                    style={{
                      background: brand.colorLight,
                      borderColor: `${brand.color}30`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${brand.color}20` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: brand.color }} />
                    </div>
                    <h3 className="font-heading font-semibold text-sm mb-1">{v.title}</h3>
                    <p className="text-xs text-muted-foreground">{v.desc}</p>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 sm:py-20" style={{ background: brand.bgLight }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <h2 className="font-heading text-3xl font-bold mb-2" style={{ color: brand.colorDark }}>
                Koleksi {brandName}
              </h2>
              <p className="text-muted-foreground">
                {products.length} produk tersedia
              </p>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <ProductCard product={product} onQuickView={setQuickViewProduct} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {quickViewProduct && (
        <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  )
}
