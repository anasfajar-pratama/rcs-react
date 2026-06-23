import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Skeleton } from '../components/ui/skeleton'
import { ProductCard } from '../components/features/ProductCard'
import { ProductQuickView } from '../components/features/ProductQuickView'
import api from '../lib/api'
import { fallbackProducts, fallbackSubcategories, type Product, type Subcategory } from '../data/products'

const categories = ['Semua', 'Wanita', 'Pria', 'Anak']

export default function Products() {
  const [location] = useLocation()
  const [products, setProducts] = useState<Product[]>([])
  const [allSubcategories, setAllSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '')
    const cat = params.get('category')
    const subcat = params.get('subcategory')
    const filter = params.get('filter')
    if (cat) setActiveCategory(cat)
    if (subcat) setActiveSubcategory(subcat)
    if (filter === 'new') {
    }
  }, [location])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get('/products').catch(() => ({ data: fallbackProducts })),
      api.get('/subcategories').catch(() => ({ data: fallbackSubcategories })),
    ]).then(([prodRes, subcatRes]) => {
      setProducts(prodRes.data || [])
      setAllSubcategories(subcatRes.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const subcategoriesForCategory = activeCategory === 'Semua'
    ? allSubcategories
    : allSubcategories.filter((s) => s.category === activeCategory)

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === 'Semua' || p.category === activeCategory
    const matchSubcategory = !activeSubcategory || p.subcategory?.slug === activeSubcategory
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSubcategory && matchSearch
  })

  return (
    <div className="pt-24 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">Semua Produk</h1>
          <p className="text-muted-foreground">
            {filtered.length} produk ditemukan
          </p>
        </motion.div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setActiveSubcategory(null) }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-border text-muted-foreground hover:border-primary hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="flex-1" />
            <div className="relative hidden sm:block">
              <Input
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="sm:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" /> Filter
            </Button>
          </div>

          {/* Subcategory Pills */}
          {subcategoriesForCategory.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveSubcategory(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !activeSubcategory
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-white border border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                Semua
              </button>
              {subcategoriesForCategory.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSubcategory(s.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeSubcategory === s.slug
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-white border border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

          {showFilters && (
            <div className="sm:hidden p-4 rounded-xl bg-white border border-border">
              <Input
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Tidak ada produk yang ditemukan.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => { setActiveCategory('Semua'); setActiveSubcategory(null); setSearchQuery('') }}
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
              >
                <ProductCard product={product} onQuickView={setQuickViewProduct} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {quickViewProduct && (
        <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  )
}
