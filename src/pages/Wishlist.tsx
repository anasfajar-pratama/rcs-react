import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { ProductCard } from '../components/features/ProductCard'
import { ProductQuickView } from '../components/features/ProductQuickView'
import { useWishlist } from '../hooks/use-wishlist'
import api from '../lib/api'
import { fallbackProducts, type Product } from '../data/products'

export default function Wishlist() {
  const { items } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (items.length === 0) return
    api.get('/products').then((res) => {
      const allProducts: Product[] = res.data || fallbackProducts
      setProducts(allProducts.filter((p) => items.includes(p.id)))
    }).catch(() => {
      setProducts(fallbackProducts.filter((p) => items.includes(p.id)))
    })
  }, [items])

  return (
    <div className="pt-24 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">Wishlist</h1>
          <p className="text-muted-foreground">
            {items.length} produk tersimpan
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-heading text-xl font-bold mb-2">Wishlist Kosong</h2>
            <p className="text-muted-foreground mb-6">
              Belum ada produk yang ditambahkan ke wishlist.
            </p>
            <Link href="/">
              <Button>Jelajahi Koleksi</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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
