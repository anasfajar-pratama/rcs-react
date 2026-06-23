import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { Plus, Edit3, Trash2, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog'
import { AdminLayout } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import { fallbackProducts, type Product } from '../../data/products'
import { BRANDS } from '../../data/brands'
import { QRCodeSVG } from 'qrcode.react'

export default function AdminProducts() {
  const [, navigate] = useLocation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get('/admin/products').then((res) => {
      setProducts(res.data || [])
    }).catch(() => {
      setProducts(fallbackProducts)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

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
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width * 2
      canvas.height = img.height * 2
      ctx?.scale(2, 2)
      ctx?.drawImage(img, 0, 0)
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
            <p className="text-sm text-muted-foreground">{products.length} total produk</p>
          </div>
          <Button onClick={() => navigate('/admin/products/edit/new')} className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Produk
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Memuat...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Belum ada produk</p>
            <Button onClick={() => navigate('/admin/products/edit/new')}>Tambah Produk Pertama</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
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
