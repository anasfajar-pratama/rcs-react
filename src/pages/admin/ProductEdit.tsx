import { useEffect, useState, useRef } from 'react'
import { useRoute, useLocation } from 'wouter'
import { ArrowLeft, Save, Upload, Trash2, Star, ImagePlus, X, Eye, Loader2, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { ImageCropperModal } from '../../components/ui/image-cropper-modal'
import { AdminLayout } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import { fallbackSubcategories, type Product, type Subcategory, type ProductImage } from '../../data/products'
import { BRANDS } from '../../data/brands'
import { cn } from '../../lib/utils'

const brandOptions = [
  { value: 'Wanita', brand: BRANDS.Wanita },
  { value: 'Pria', brand: BRANDS.Pria },
  { value: 'Anak', brand: BRANDS.Anak },
]

export default function AdminProductEdit() {
  const [, params] = useRoute('/admin/products/edit/:id?')
  const [, navigate] = useLocation()
  const isEdit = params?.id && params.id !== 'new'
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [images, setImages] = useState<ProductImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [beforeUploading, setBeforeUploading] = useState(false)
  const [afterUploading, setAfterUploading] = useState(false)
  const beforeInputRef = useRef<HTMLInputElement>(null)
  const afterInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    name: '', category: 'Wanita' as string, subcategoryId: '', tagline: '', description: '',
    ingredients: '', benefits: ['', '', '', ''], howToUse: ['', '', '', ''],
    isNew: false, isPromo: false, isFeatured: false, sortOrder: 0,
    price: '', originalPrice: '', weight: '', dimensions: '', bpomNumber: '',
    certifications: ['', '', ''], halalCertified: false, warrantyInfo: '',
    shopeeUrl: '', tokopediaUrl: '', tiktokUrl: '',
    beforeImage: '', afterImage: '',
  })

  useEffect(() => {
    api.get('/subcategories').then((res) => {
      setSubcategories(res.data || [])
    }).catch(() => setSubcategories(fallbackSubcategories))
  }, [])

  useEffect(() => {
    if (!isEdit || !params?.id) return
    api.get(`/admin/products/${params.id}`).then((res) => {
      const p: Product = res.data
      setForm({
        name: p.name, category: p.category, subcategoryId: String(p.subcategory?.id || ''),
        tagline: p.tagline, description: p.description || '',
        ingredients: p.ingredients || '',
        benefits: p.benefits?.length ? [...p.benefits, ...Array(4 - p.benefits.length).fill('')].slice(0, 4) : ['', '', '', ''],
        howToUse: p.howToUse?.length ? [...p.howToUse, ...Array(4 - p.howToUse.length).fill('')].slice(0, 4) : ['', '', '', ''],
        isNew: p.isNew || false, isPromo: p.isPromo || false, isFeatured: p.isFeatured || false,
        sortOrder: p.sortOrder || 0,
        price: String(p.price || ''),
        originalPrice: String(p.originalPrice || ''),
        weight: p.weight || '', dimensions: p.dimensions || '',
        bpomNumber: p.bpomNumber || '',
        certifications: p.certifications?.length ? [...p.certifications, ...Array(3 - p.certifications.length).fill('')].slice(0, 3) : ['', '', ''],
        halalCertified: p.halalCertified || false, warrantyInfo: p.warrantyInfo || '',
        shopeeUrl: p.shopeeUrl || '', tokopediaUrl: p.tokopediaUrl || '', tiktokUrl: p.tiktokUrl || '',
        beforeImage: p.beforeImage || '', afterImage: p.afterImage || '',
      })
      setImages(p.images || [])
    }).catch(() => {
      toast.error('Gagal memuat produk')
      navigate('/admin/products')
    })
  }, [params?.id])

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      name: form.name,
      category: form.category,
      subcategory_id: form.subcategoryId ? Number(form.subcategoryId) : null,
      tagline: form.tagline,
      description: form.description || null,
      ingredients: form.ingredients || null,
      benefits: form.benefits.filter(Boolean),
      howToUse: form.howToUse.filter(Boolean),
      isNew: form.isNew,
      isPromo: form.isPromo,
      isFeatured: form.isFeatured,
      sortOrder: form.sortOrder || null,
      price: form.price ? Number(form.price) : null,
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      shopeeUrl: form.shopeeUrl || null,
      tokopediaUrl: form.tokopediaUrl || null,
      tiktokUrl: form.tiktokUrl || null,
      weight: form.weight || null,
      dimensions: form.dimensions || null,
      bpomNumber: form.bpomNumber || null,
      certifications: form.certifications.filter(Boolean),
      halalCertified: form.halalCertified,
      warrantyInfo: form.warrantyInfo || null,
      beforeImage: form.beforeImage || null,
      afterImage: form.afterImage || null,
    }

    try {
      if (isEdit && params?.id) {
        const res = await api.put(`/admin/products/${params.id}`, payload)
        const p: Product = res.data
        setForm({
          name: p.name, category: p.category, subcategoryId: String(p.subcategory?.id || ''),
          tagline: p.tagline, description: p.description || '',
          ingredients: p.ingredients || '',
          benefits: p.benefits?.length ? [...p.benefits, ...Array(4 - p.benefits.length).fill('')].slice(0, 4) : ['', '', '', ''],
          howToUse: p.howToUse?.length ? [...p.howToUse, ...Array(4 - p.howToUse.length).fill('')].slice(0, 4) : ['', '', '', ''],
          isNew: p.isNew || false, isPromo: p.isPromo || false, isFeatured: p.isFeatured || false,
          sortOrder: p.sortOrder || 0,
          price: String(p.price || ''),
          originalPrice: String(p.originalPrice || ''),
          weight: p.weight || '', dimensions: p.dimensions || '',
          bpomNumber: p.bpomNumber || '',
          certifications: p.certifications?.length ? [...p.certifications, ...Array(3 - p.certifications.length).fill('')].slice(0, 3) : ['', '', ''],
          halalCertified: p.halalCertified || false, warrantyInfo: p.warrantyInfo || '',
          shopeeUrl: p.shopeeUrl || '', tokopediaUrl: p.tokopediaUrl || '', tiktokUrl: p.tiktokUrl || '',
          beforeImage: p.beforeImage || '', afterImage: p.afterImage || '',
        })
        setImages(p.images || [])
        toast.success('Produk berhasil diperbarui')
      } else {
        const res = await api.post('/admin/products', payload)
        const productId = res.data.id
        const qrUrl = `${window.location.origin}/product/${productId}`
        await api.patch(`/admin/products/${productId}/qr`, { qrUrl })
        toast.success('Produk berhasil ditambahkan')
        navigate(`/admin/products/edit/${productId}`)
      }
    } catch {
      toast.error('Gagal menyimpan produk')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length || !params?.id) return
    const file = files[0]
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    setCropFile(file)
  }

  const doUploadAfterCrop = async (blob: Blob) => {
    if (!params?.id) return
    setUploading(true)
    try {
      const { compressImage } = await import('../../lib/compress-image')
      const compressed = await compressImage(
        new File([blob], 'product.jpg', { type: 'image/jpeg' })
      )
      const fd = new FormData()
      fd.append('image', compressed)
      const uploadRes = await api.post('/admin/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const { imageUrl } = uploadRes.data
      const imgRes = await api.post(`/admin/products/${params.id}/images`, {
        imageUrl,
        isPrimary: images.length === 0,
        sortOrder: images.length,
      })
      const img: ProductImage = {
        id: imgRes.data.id,
        imageUrl: imgRes.data.image_url ?? imgRes.data.imageUrl,
        isPrimary: imgRes.data.is_primary ?? imgRes.data.isPrimary,
        sortOrder: imgRes.data.sort_order ?? imgRes.data.sortOrder,
      }
      setImages((prev) => [...prev, img])
    } catch {
      toast.error('Gagal upload gambar')
    } finally {
      setUploading(false)
      setCropFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSetPrimary = async (imageId: number) => {
    if (!params?.id) return
    try {
      await api.put(`/admin/products/${params.id}/images/${imageId}/primary`)
      setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === imageId })))
      toast.success('Gambar utama diperbarui')
    } catch {
      toast.error('Gagal mengubah gambar utama')
    }
  }

  const handleDeleteImage = async (imageId: number) => {
    if (!params?.id) return
    try {
      await api.delete(`/admin/products/${params.id}/images/${imageId}`)
      setImages((prev) => prev.filter((img) => img.id !== imageId))
      toast.success('Gambar dihapus')
    } catch {
      toast.error('Gagal menghapus gambar')
    }
  }

  const handleBeforeAfterUpload = async (file: File, type: 'before' | 'after') => {
    const setUploadingState = type === 'before' ? setBeforeUploading : setAfterUploading
    const setValue = (url: string) => setForm((prev) => ({ ...prev, [type === 'before' ? 'beforeImage' : 'afterImage']: url }))
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }
    setUploadingState(true)
    try {
      const { compressImage } = await import('../../lib/compress-image')
      const compressed = await compressImage(file)
      const fd = new FormData()
      fd.append('image', compressed)
      const { data } = await api.post('/admin/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setValue(data.imageUrl)
      toast.success(`Gambar ${type === 'before' ? 'Before' : 'After'} berhasil diupload`)
    } catch {
      toast.error('Gagal upload gambar')
    } finally {
      setUploadingState(false)
    }
  }

  const subcategoriesForCategory = subcategories.filter((s) => s.category === form.category)

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold">
              {isEdit ? `Edit: ${form.name || 'Produk'}` : 'Tambah Produk'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEdit ? 'Ubah informasi produk' : 'Buat produk baru'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
              <h2 className="font-heading font-semibold">Informasi Dasar</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Produk</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v, subcategoryId: '' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {brandOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: opt.brand.color }} />
                            <span>{opt.brand.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subkategori</Label>
                  <Select value={form.subcategoryId} onValueChange={(v) => setForm({ ...form, subcategoryId: v })}>
                    <SelectTrigger><SelectValue placeholder="Pilih subkategori" /></SelectTrigger>
                    <SelectContent>
                      {subcategoriesForCategory.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Harga Jual (Rp)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Harga Asli (coret) (Rp)</Label>
                  <Input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <textarea className="flex w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Bahan / Ingredients</Label>
                <textarea className="flex w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none" rows={3} value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
              <h2 className="font-heading font-semibold">Manfaat & Cara Pakai</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Manfaat (4)</Label>
                  {form.benefits.map((b, i) => (
                    <Input key={i} value={b} onChange={(e) => {
                      const benefits = [...form.benefits]; benefits[i] = e.target.value; setForm({ ...form, benefits })
                    }} placeholder={`Manfaat ${i + 1}`} />
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Cara Pakai (4)</Label>
                  {form.howToUse.map((h, i) => (
                    <Input key={i} value={h} onChange={(e) => {
                      const howToUse = [...form.howToUse]; howToUse[i] = e.target.value; setForm({ ...form, howToUse })
                    }} placeholder={`Langkah ${i + 1}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
              <h2 className="font-heading font-semibold">Informasi Tambahan</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Berat</Label><Input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="50ml / 200g" /></div>
                <div className="space-y-2"><Label>Dimensi</Label><Input value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} placeholder="15 x 5 x 3 cm" /></div>
                <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>No. BPOM</Label><Input value={form.bpomNumber} onChange={(e) => setForm({ ...form, bpomNumber: e.target.value })} placeholder="NA18201200123" /></div>
                <div className="space-y-2"><Label>Info Garansi</Label><Input value={form.warrantyInfo} onChange={(e) => setForm({ ...form, warrantyInfo: e.target.value })} placeholder="Gunakan dalam 6 bulan" /></div>
              </div>
              <div className="space-y-2">
                <Label>Sertifikasi (3)</Label>
                <div className="grid grid-cols-3 gap-3">
                  {form.certifications.map((c, i) => (
                    <Input key={i} value={c} onChange={(e) => {
                      const certs = [...form.certifications]; certs[i] = e.target.value; setForm({ ...form, certifications: certs })
                    }} placeholder={`Sertifikasi ${i + 1}`} />
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="rounded border-border" /> Produk Baru
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isPromo} onChange={(e) => setForm({ ...form, isPromo: e.target.checked })} className="rounded border-border" /> Produk Promo
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded border-border" /> Produk Unggulan
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.halalCertified} onChange={(e) => setForm({ ...form, halalCertified: e.target.checked })} className="rounded border-border" /> Sertifikasi Halal
                </label>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
              <h2 className="font-heading font-semibold">Marketplace</h2>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Link Shopee</Label>
                  <Input value={form.shopeeUrl} onChange={(e) => setForm({ ...form, shopeeUrl: e.target.value })} placeholder="https://shopee.co.id/..." />
                </div>
                <div className="space-y-2">
                  <Label>Link Tokopedia</Label>
                  <Input value={form.tokopediaUrl} onChange={(e) => setForm({ ...form, tokopediaUrl: e.target.value })} placeholder="https://tokopedia.com/..." />
                </div>
                <div className="space-y-2">
                  <Label>Link TikTok</Label>
                  <Input value={form.tiktokUrl} onChange={(e) => setForm({ ...form, tiktokUrl: e.target.value })} placeholder="https://tiktok.com/@..." />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image Management */}
            <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
              <h2 className="font-heading font-semibold">Gambar Produk</h2>
              {isEdit ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((img) => (
                      <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-gradient-to-br from-primary/5 to-accent/5">
                        <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button onClick={() => setPreviewImage(img.imageUrl)} className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
                            <Eye className="h-4 w-4" />
                          </button>
                          {!img.isPrimary && (
                            <button onClick={() => handleSetPrimary(img.id)} className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
                              <Star className="h-4 w-4" />
                            </button>
                          )}
                          <button onClick={() => handleDeleteImage(img.id)} className="w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {img.isPrimary && (
                          <span className="absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-900">
                            Utama
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    <Button variant="outline" className="w-full gap-2" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                      <ImagePlus className="h-4 w-4" />
                      {uploading ? 'Mengupload...' : 'Tambah Gambar'}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Simpan produk terlebih dahulu untuk menambahkan gambar.</p>
              )}
            </div>

            {/* Before & After Images */}
            <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
              <h2 className="font-heading font-semibold">Before & After</h2>
              {isEdit ? (
                <div className="grid grid-cols-2 gap-3">
                  {/* Before */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Before</p>
                    {form.beforeImage ? (
                      <div className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-gradient-to-br from-primary/5 to-accent/5">
                        <img src={form.beforeImage} alt="Before" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => { if (beforeInputRef.current) beforeInputRef.current.click() }}
                            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setForm((prev) => ({ ...prev, beforeImage: '' }))}
                            className="w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                        onClick={() => beforeInputRef.current?.click()}
                      >
                        {beforeUploading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-muted-foreground">
                            <ImagePlus className="h-6 w-6" />
                            <span className="text-xs">Upload</span>
                          </div>
                        )}
                      </div>
                    )}
                    <input
                      ref={beforeInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) handleBeforeAfterUpload(f, 'before')
                      }}
                    />
                  </div>
                  {/* After */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">After</p>
                    {form.afterImage ? (
                      <div className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-gradient-to-br from-primary/5 to-accent/5">
                        <img src={form.afterImage} alt="After" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => { if (afterInputRef.current) afterInputRef.current.click() }}
                            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setForm((prev) => ({ ...prev, afterImage: '' }))}
                            className="w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                        onClick={() => afterInputRef.current?.click()}
                      >
                        {afterUploading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-muted-foreground">
                            <ImagePlus className="h-6 w-6" />
                            <span className="text-xs">Upload</span>
                          </div>
                        )}
                      </div>
                    )}
                    <input
                      ref={afterInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) handleBeforeAfterUpload(f, 'after')
                      }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Simpan produk terlebih dahulu untuk menambahkan gambar Before & After.</p>
              )}
            </div>

            {/* Save Button */}
            <div className="p-6 rounded-2xl bg-white border border-border">
              <Button className="w-full gap-2" onClick={handleSave} disabled={saving || !form.name || !form.tagline}>
                <Save className="h-4 w-4" />
                {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Produk'}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {previewImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
              onClick={() => setPreviewImage(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <img src={previewImage} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {cropFile && (
          <ImageCropperModal
            file={cropFile}
            cropShape="rect"
            aspectRatio={1}
            onCrop={doUploadAfterCrop}
            onCancel={() => setCropFile(null)}
          />
        )}
      </motion.div>
    </AdminLayout>
  )
}
