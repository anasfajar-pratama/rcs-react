import { useEffect, useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { Plus, Edit3, Trash2, Download, Search, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog'
import { AdminLayout, AdminLoader } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import { fallbackProducts, fallbackSubcategories, type Product, type Subcategory } from '../../data/products'
import { BRANDS } from '../../data/brands'
import { QRCodeSVG } from 'qrcode.react'

export default function AdminProducts() {
  const [, navigate] = useLocation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [search, setSearch] = useState('')
  const [filterBrand, setFilterBrand] = useState('')
  const [filterSubcategory, setFilterSubcategory] = useState('')

  const load = () => {
    setLoading(true)
    api.get('/admin/products').then((res) => {
      setProducts(res.data || [])
    }).catch(() => {
      setProducts(fallbackProducts)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    api.get('/admin/subcategories').then((res) => {
      setSubcategories(res.data || [])
    }).catch(() => {
      setSubcategories(fallbackSubcategories)
    })
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (search) {
        const q = search.toLowerCase()
        if (!p.name.toLowerCase().includes(q) && !p.tagline.toLowerCase().includes(q)) return false
      }
      if (filterBrand && p.category !== filterBrand) return false
      if (filterSubcategory && p.subcategory?.slug !== filterSubcategory) return false
      return true
    })
  }, [products, search, filterBrand, filterSubcategory])

  const filteredSubcategories = subcategories.filter((sc) => !filterBrand || sc.category === filterBrand)

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/products/${id}`)
      toast.success('Produk berhasil dihapus')
      load()
    } catch {
      toast.error('Gagal menghapus produk')
    }
  }

  const downloadQR = (product: Product) => {
    const svg = document.getElementById(`qr-${product.id}`)
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const a5Width = 1748
    const a5Height = 2480
    canvas.width = a5Width
    canvas.height = a5Height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = new Image()
    img.onload = () => {
      const padding = a5Width * 0.12
      const qrSize = a5Width - padding * 2
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, a5Width, a5Height)
      ctx.drawImage(img, padding, (a5Height - qrSize) / 2, qrSize, qrSize)
      const a = document.createElement('a')
      a.download = `${product.name}-qr.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">Produk</h1>
            <p className="text-sm text-muted-foreground">{filteredProducts.length} dari {products.length} total produk</p>
          </div>
          <Button onClick={() => navigate('/admin/products/edit/new')} className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Produk
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau tagline..."
              className="pl-9 pr-8"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Select value={filterBrand} onValueChange={(v) => { setFilterBrand(v); setFilterSubcategory('') }}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Semua Brand" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Brand</SelectItem>
              {Object.values(BRANDS).map((b) => (
                <SelectItem key={b.key} value={b.category}>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />
                    <span>{b.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filterBrand && (() => {
            const activeSubcategories = filteredSubcategories.filter(
              (sc) => products.some((p) => p.subcategory?.id === sc.id)
            )
            if (activeSubcategories.length === 0) return null
            return (
              <div className="flex flex-wrap items-center gap-2 w-full">
                <button
                  onClick={() => setFilterSubcategory('')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    !filterSubcategory
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'text-muted-foreground border-border hover:text-foreground hover:border-foreground/20'
                  }`}
                >
                  Semua
                </button>
                {activeSubcategories.map((sc) => {
                  const count = products.filter((p) => p.subcategory?.id === sc.id).length
                  const isActive = filterSubcategory === sc.slug
                  return (
                    <button
                      key={sc.id}
                      onClick={() => setFilterSubcategory(isActive ? '' : sc.slug)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        isActive
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'text-muted-foreground border-border hover:text-foreground hover:border-foreground/20'
                      }`}
                    >
                      {sc.name}
                      <span className="ml-1 opacity-70">({count})</span>
                    </button>
                  )
                })}
              </div>
            )
          })()}
        </div>

        {loading ? (
          <AdminLoader />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {products.length === 0 ? 'Belum ada produk' : 'Tidak ada produk yang cocok dengan filter'}
            </p>
            {products.length === 0 ? (
              <Button onClick={() => navigate('/admin/products/edit/new')}>Tambah Produk Pertama</Button>
            ) : (
              <Button variant="outline" onClick={() => { setSearch(''); setFilterBrand(''); setFilterSubcategory('') }}>
                Reset Filter
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0 cursor-pointer" onClick={() => navigate(`/admin/products/edit/${p.id}`)}>
                  <span className="font-heading font-bold text-primary">{p.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/admin/products/edit/${p.id}`)}>
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(BRANDS as any)[p.category]?.name || p.category}{p.subcategory ? ` — ${p.subcategory.name}` : ''} — {p.tagline}
                    {p.isNew && ' • Baru'}{p.isPromo && ' • Promo'}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1 shrink-0">
                  <QRCodeSVG id={`qr-${p.id}`} value={`${window.location.origin}/product/${p.id}`} size={32} />
                  <Button variant="ghost" size="icon" onClick={() => downloadQR(p)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/products/edit/${p.id}`)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
                        <AlertDialogDescription>Yakin ingin menghapus {p.name}?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-destructive">Hapus</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  )
}
