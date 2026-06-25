import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import { ArrowRight, Sparkles, Shield, Leaf, Star, Gift, Clock, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { ProductCard } from '../components/features/ProductCard'
import { HeroSlider } from '../components/features/HeroSlider'
import { CategoryBentoGrid } from '../components/features/CategoryBentoGrid'
import { ProductQuickView } from '../components/features/ProductQuickView'
import { Card, CardContent } from '../components/ui/card'

import api from '../lib/api'
import { fallbackProducts, fallbackTestimonials, fallbackHomepageContent, type Product, type Testimonial } from '../data/products'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
}

const features = [
  { icon: Sparkles, title: 'Teknologi Terkini', desc: 'Inovasi terbaru untuk hasil maksimal' },
  { icon: Shield, title: 'Material Premium', desc: 'Bahan berkualitas tinggi, aman & tahan lama' },
  { icon: Leaf, title: 'Ramah Lingkungan', desc: 'Komitmen kami untuk bumi yang lebih hijau' },
  { icon: Star, title: 'Teruji Klinis', desc: 'Terbukti aman dan efektif secara ilmiah' },
]

export default function Home() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials)
  const [content, setContent] = useState(fallbackHomepageContent)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  useEffect(() => {
    api.get('/products').then((res) => {
      if (res.data?.length) setProducts(res.data)
    }).catch(() => {})
    api.get('/testimonials').then((res) => {
      if (res.data?.length) setTestimonials(res.data)
    }).catch(() => {})
    api.get('/homepage-content').then((res) => {
      if (res.data) setContent((prev) => ({ ...prev, ...res.data }))
    }).catch(() => {})
  }, [])

  const promoProducts = products.filter((p) => p.isPromo).slice(0, 4)
  const newProducts = products.filter((p) => p.isNew).slice(0, 4)
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 6)

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Category Bento Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">{content.section_kategori_title || 'Koleksi Berdasarkan Kategori'}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {content.section_kategori_subtitle || 'Temukan alat kecantikan yang sesuai dengan kebutuhanmu'}
            </p>
          </motion.div>
          <CategoryBentoGrid />
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 sm:py-20 bg-gradient-to-r from-amber-50/40 to-rose-50/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-10">
              <Badge variant="default" className="mb-4 px-4 py-1.5">
                <Trophy className="h-3.5 w-3.5 mr-1.5" /> Produk Unggulan
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-2">{content.section_unggulan_title || 'Pilihan Terbaik Kami'}</h2>
              <p className="text-muted-foreground">{content.section_unggulan_subtitle || 'Rekomendasi produk terbaik yang wajib kamu coba'}</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product, i) => {
                const rank = i < 4 ? i + 1 : undefined
                const prices = [
                  { price: 149000, original: 179000, rating: 4.8, sold: 1240 },
                  { price: 179000, original: 219000, rating: 4.6, sold: 890 },
                  { price: 129000, original: 159000, rating: 4.7, sold: 560 },
                  { price: 79000, original: 119000, rating: 4.9, sold: 2100 },
                ]
                const fallback = prices[Math.min(i, prices.length - 1)]
                const productWithHardcoded = {
                  ...product,
                  price: Number(product.price) || fallback.price,
                  originalPrice: Number(product.originalPrice) || fallback.original,
                  rating: Number(product.rating) || fallback.rating,
                  soldCount: Number(product.soldCount) || fallback.sold,
                }
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <ProductCard product={productWithHardcoded} rank={rank} onQuickView={setQuickViewProduct} />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Promo Section */}
      {promoProducts.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-10">
              <Badge variant="default" className="mb-4 px-4 py-1.5">
                <Gift className="h-3.5 w-3.5 mr-1.5" /> Promo Spesial
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-2">{content.section_promo_title || 'Penawaran Terbatas'}</h2>
              <p className="text-muted-foreground">{content.section_promo_subtitle || 'Dapatkan produk favorit dengan harga spesial sebelum kehabisan!'}</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {promoProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newcomer Section */}
      {newProducts.length > 0 && (
        <section className="py-16 sm:py-20 bg-gradient-to-r from-rose-50/80 to-amber-50/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-10">
              <Badge variant="accent" className="mb-3">
                <Clock className="h-3.5 w-3.5 mr-1.5" /> Baru Datang
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-2">{content.section_terbaru_title || 'Produk Terbaru'}</h2>
              <p className="text-muted-foreground">{content.section_terbaru_subtitle || 'Kenalan dengan produk-produk baru kami'}</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newProducts.map((product, i) => (
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
      )}

      {/* Features / Why Us */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">{content.section_features_title || 'Mengapa Produk Kami?'}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {content.section_features_subtitle || 'Kami berkomitmen menghadirkan yang terbaik untuk kecantikan Anda'}
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Card className="text-center p-6 h-full">
                    <CardContent className="p-0 space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/[0.03] to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-accent/[0.03] to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div {...fadeUp} className="relative">
              <div className="absolute -top-6 -left-6 text-[10rem] sm:text-[12rem] font-heading font-bold text-primary/[0.04] leading-none select-none pointer-events-none">
                {content.about_title?.charAt(0) || 'I'}
              </div>
              <Badge variant="outline" className="mb-6 tracking-[0.15em] text-[11px] uppercase px-4 py-1.5 rounded-full border-primary/20 text-primary">
                Tentang Kami
              </Badge>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-8 text-balance">
                {content.about_title || 'Inovasi untuk Kecantikan'}
              </h2>
              <div className="w-12 h-0.5 bg-primary/30 mb-8" />
              <p className="text-muted-foreground leading-[1.9] text-[15px] sm:text-[16px] mb-6 text-balance">
                {content.about_text1 || 'Rindang Cemara Sukses menghadirkan alat kecantikan berkualitas tinggi yang menggabungkan teknologi modern dengan desain elegan.'}
              </p>
              <p className="text-muted-foreground leading-[1.9] text-[15px] sm:text-[16px] mb-10 text-balance">
                {content.about_text2 || 'Setiap produk dirancang dengan teliti menggunakan material terbaik untuk hasil maksimal.'}
              </p>
              {content.about_quote && (
                <blockquote className="relative pl-10 italic text-foreground/70 font-heading font-medium text-lg sm:text-xl leading-relaxed">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-px bg-primary/40" />
                  <span className="text-primary/50 text-2xl mr-1 font-serif">&ldquo;</span>
                  {content.about_quote}
                  <span className="text-primary/50 text-2xl ml-1 font-serif">&rdquo;</span>
                </blockquote>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-[2.5rem] blur-2xl" />
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                {content.about_image ? (
                  <img src={content.about_image} alt="Tentang Rindang Cemara Sukses" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/[0.04] to-accent/[0.04] flex items-center justify-center">
                    <span className="font-heading text-7xl sm:text-8xl font-bold text-primary/[0.08] tracking-tight">
                      RCS
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-primary/10 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 border-2 border-accent/10 rounded-full -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">{content.section_testimonials_title || 'Apa Kata Mereka'}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {content.section_testimonials_subtitle || 'Testimoni dari pelanggan setia Rindang Cemara Sukses'}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {testimonials.slice(0, 4).map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex gap-0.5">
                        {Array.from({ length: Number(t.rating) }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">"{t.content}"</p>
                      <p className="text-sm font-semibold">— {t.name}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3">
              {content.newsletter_title || 'Dapatkan Update Terbaru'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {content.newsletter_subtitle || 'Berlangganan untuk info produk baru dan penawaran eksklusif.'}
            </p>
            <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 h-12 px-4 rounded-xl border border-border bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-sm"
              />
              <Button type="submit" size="lg">Subscribe</Button>
            </form>
          </motion.div>
        </div>
      </section>

      {quickViewProduct && (
        <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  )
}
