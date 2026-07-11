import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, ImagePlus, Loader2, ArrowLeft, Plus, Eye, EyeOff,
  GripVertical, Trash2, Layout, Sun, CloudSun, Moon,
  Sparkles, Gem, PartyPopper, Palette, Dices, Tags,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { ImageCropperModal } from '../../components/ui/image-cropper-modal'
import { AdminLayout, AdminLoader } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import { validateFileSize } from '../../lib/compress-image'
import { useImageUpload } from '../../hooks/use-image-upload'
import { BRANDS } from '../../data/brands'

interface Hero {
  id: number
  type: 'brand' | 'product' | 'event'
  brand_key: string | null
  product_type: string | null
  theme: string
  title: string
  subtitle: string | null
  description: string | null
  button_text: string | null
  button_link: string | null
  hero_image: string | null
  logo: string | null
  logo_style: string
  label: string | null
  label_color: string | null
  event_date: string | null
  event_end_date: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

const THEMES = [
  { value: 'rose', label: 'Rose', gradient: 'from-rose-400/20 to-pink-400/20', glow: '#E8A0BF', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' },
  { value: 'sky', label: 'Sky', gradient: 'from-sky-300/20 to-cyan-300/20', glow: '#7DD3FC', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600' },
  { value: 'slate', label: 'Slate', gradient: 'from-slate-800/20 to-blue-900/20', glow: '#2C3E50', bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-600' },
  { value: 'amber', label: 'Amber', gradient: 'from-amber-300/20 to-orange-300/20', glow: '#FCD34D', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
  { value: 'emerald', label: 'Emerald', gradient: 'from-emerald-300/20 to-teal-300/20', glow: '#6EE7B7', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
]

const THEME_ICONS: Record<string, React.ComponentType<any>> = {
  rose: Gem,
  sky: CloudSun,
  slate: Moon,
  amber: Sun,
  emerald: Sparkles,
}

const TYPE_OPTIONS = [
  { value: 'brand', label: 'Brand' },
  { value: 'product', label: 'Produk' },
  { value: 'event', label: 'Event' },
]

const PRODUCT_TYPE_OPTIONS = [
  { value: 'featured', label: 'Produk Unggulan', labelText: 'Produk Unggulan', color: '#B76E79' },
  { value: 'promo', label: 'Promo Spesial', labelText: 'Promo Spesial', color: '#F59E0B' },
  { value: 'new', label: 'Baru Datang', labelText: 'Baru Datang', color: '#0EA5E9' },
]

const LABEL_COLORS = [
  { value: '#B76E79', label: 'Rose' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#0EA5E9', label: 'Sky' },
  { value: '#10B981', label: 'Emerald' },
  { value: '#6366F1', label: 'Indigo' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#F97316', label: 'Orange' },
  { value: '#8B5CF6', label: 'Purple' },
]

export default function AdminHeroes() {
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [rev, setRev] = useState(0)
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [dragOverId, setDragOverId] = useState<number | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const { cropState, uploading, progress, startCrop, cancelCrop, handleCropResult, directUpload } = useImageUpload()

  interface HeroForm {
    type: 'brand' | 'product' | 'event'
    brand_key: string | null
    product_type: string | null
    theme: string
    title: string
    subtitle: string
    description: string
    button_text: string
    button_link: string
    hero_image: string
    logo: string
    logo_style: string
    label: string
    label_color: string
    event_date: string
    event_end_date: string
    is_active: boolean
  }

  const emptyForm: HeroForm = {
    type: 'brand',
    brand_key: 'blisera',
    product_type: null,
    theme: 'rose',
    title: '',
    subtitle: '',
    description: '',
    button_text: '',
    button_link: '',
    hero_image: '',
    logo: '',
    logo_style: 'rounded',
    label: '',
    label_color: '#B76E79',
    event_date: '',
    event_end_date: '',
    is_active: true,
  }

  const [form, setForm] = useState<typeof emptyForm>({ ...emptyForm })

  const load = useCallback(() => {
    setLoading(true)
    api.get('/admin/heroes').then((res) => {
      setHeroes(res.data || [])
    }).catch(() => {
      toast.error('Gagal memuat data hero')
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const resetForm = () => {
    setForm({ ...emptyForm })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (hero: Hero) => {
    setForm({
      type: hero.type as HeroForm['type'],
      brand_key: hero.brand_key,
      product_type: hero.product_type,
      theme: hero.theme,
      title: hero.title,
      subtitle: hero.subtitle || '',
      description: hero.description || '',
      button_text: hero.button_text || '',
      button_link: hero.button_link || '',
      hero_image: hero.hero_image || '',
      logo: hero.logo || '',
      logo_style: hero.logo_style || 'rounded',
      label: hero.label || '',
      label_color: hero.label_color || '#B76E79',
      event_date: hero.event_date || '',
      event_end_date: hero.event_end_date || '',
      is_active: hero.is_active,
    })
    setEditingId(hero.id)
    setShowForm(true)
  }

  const handleUploadClick = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!validateFileSize(file)) {
      toast.error('Ukuran file maksimal 5MB')
      e.target.value = ''
      return
    }
    e.target.value = ''
    startCrop(file, 'rect', field === 'logo' ? 1 : 16/9, (url: string) => {
      setForm((prev) => ({ ...prev, [field]: url }))
      setRev((r) => r + 1)
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...form,
        brand_key: form.type === 'brand' ? form.brand_key : null,
        product_type: form.type === 'product' ? form.product_type : null,
        event_date: form.event_date || null,
        event_end_date: form.event_end_date || null,
      }

      if (editingId) {
        await api.put(`/admin/heroes/${editingId}`, payload)
        toast.success('Hero berhasil diperbarui')
      } else {
        await api.post('/admin/heroes', payload)
        toast.success('Hero berhasil ditambahkan')
      }
      load()
      resetForm()
    } catch {
      toast.error(editingId ? 'Gagal memperbarui hero' : 'Gagal menambahkan hero')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus hero ini?')) return
    try {
      await api.delete(`/admin/heroes/${id}`)
      toast.success('Hero berhasil dihapus')
      load()
    } catch {
      toast.error('Gagal menghapus hero')
    }
  }

  const handleToggleActive = async (hero: Hero) => {
    try {
      await api.put(`/admin/heroes/${hero.id}`, { is_active: !hero.is_active })
      toast.success(hero.is_active ? 'Hero dinonaktifkan' : 'Hero diaktifkan')
      load()
    } catch {
      toast.error('Gagal mengubah status hero')
    }
  }

  const handleDragStart = (id: number) => {
    setDraggedId(id)
  }

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault()
    setDragOverId(id)
  }

  const handleDrop = async (targetId: number) => {
    if (draggedId === null || draggedId === targetId) {
      setDraggedId(null)
      setDragOverId(null)
      return
    }

    const items = [...heroes]
    const draggedIdx = items.findIndex((h) => h.id === draggedId)
    const targetIdx = items.findIndex((h) => h.id === targetId)
    if (draggedIdx === -1 || targetIdx === -1) return

    const [moved] = items.splice(draggedIdx, 1)
    items.splice(targetIdx, 0, moved)

    const orders = items.map((h, i) => ({ id: h.id, sort_order: i }))

    try {
      await api.post('/admin/heroes/reorder', { orders })
      setHeroes(items)
      toast.success('Urutan hero diperbarui')
    } catch {
      toast.error('Gagal memperbarui urutan')
    }

    setDraggedId(null)
    setDragOverId(null)
  }

  const getTypeIcon = (type: string) => {
    if (type === 'brand') return Layout
    if (type === 'product') return Tags
    return PartyPopper
  }

  const getBrandInfo = (brandKey: string | null) => {
    if (!brandKey) return null
    return Object.values(BRANDS).find((b) => b.key === brandKey)
  }

  const getProductTypeInfo = (productType: string | null) => {
    if (!productType) return null
    return PRODUCT_TYPE_OPTIONS.find((p) => p.value === productType)
  }

  if (loading) {
    return (
      <AdminLayout>
        <AdminLoader />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Hero</h1>
            <p className="text-sm text-muted-foreground">
              {showForm
                ? editingId ? 'Edit hero slider' : 'Tambah hero baru'
                : `${heroes.length} hero slider`
              }
            </p>
          </div>
          {!showForm && (
            <Button onClick={() => { resetForm(); setShowForm(true) }} className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Hero
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl"
            >
              <div className="mb-6">
                <Button variant="ghost" size="sm" className="gap-2 mb-4" onClick={resetForm}>
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </Button>
              </div>

              <div className="space-y-6">
                {/* Tipe Hero */}
                <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
                  <Label className="text-sm font-medium">Tipe Hero</Label>
                  <div className="flex gap-2 flex-wrap">
                    {TYPE_OPTIONS.map((opt) => {
                      const Icon = opt.value === 'brand' ? Layout : opt.value === 'product' ? Tags : PartyPopper
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setForm((prev) => ({
                            ...prev,
                            type: opt.value as 'brand' | 'product' | 'event',
                            brand_key: opt.value === 'brand' ? 'blisera' : null,
                            product_type: opt.value === 'product' ? 'featured' : null,
                            label: opt.value === 'product' ? PRODUCT_TYPE_OPTIONS[0].labelText : '',
                            label_color: opt.value === 'product' ? PRODUCT_TYPE_OPTIONS[0].color : '#B76E79',
                          }))}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                            form.type === opt.value
                              ? 'border-primary bg-primary/10 text-primary shadow-sm'
                              : 'border-border text-muted-foreground hover:border-primary/30'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Brand Type: Pilih Brand */}
                {form.type === 'brand' && (
                  <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
                    <Label className="text-sm font-medium">Pilih Brand</Label>
                    <div className="flex gap-2 flex-wrap">
                      {['blisera', 'fokka', 'pijar_nala'].map((bk) => {
                        const brand = getBrandInfo(bk)
                        return (
                          <button
                            key={bk}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, brand_key: bk }))}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                              form.brand_key === bk
                                ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                : 'border-border text-muted-foreground hover:border-primary/30'
                            }`}
                          >
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: brand?.color || '#6B7280', color: '#fff' }}>
                              {brand?.name?.charAt(0) || bk.charAt(0).toUpperCase()}
                            </div>
                            {brand?.name || bk.toUpperCase()}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Product Type: Pilih Jenis Produk */}
                {form.type === 'product' && (
                  <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
                    <Label className="text-sm font-medium">Jenis Produk</Label>
                    <div className="flex gap-2 flex-wrap">
                      {PRODUCT_TYPE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setForm((prev) => ({
                            ...prev,
                            product_type: opt.value,
                            label: opt.labelText,
                            label_color: opt.color,
                          }))}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                            form.product_type === opt.value
                              ? 'border-primary bg-primary/10 text-primary shadow-sm'
                              : 'border-border text-muted-foreground hover:border-primary/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Label (untuk product & event) */}
                {(form.type === 'product' || form.type === 'event') && (
                  <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
                    <h3 className="text-sm font-medium">Label / Selendang</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Teks Label</Label>
                        <Input
                          value={form.label}
                          onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
                          placeholder={form.type === 'product' ? 'Produk Unggulan' : 'Event Spesial'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Warna Label</Label>
                        <div className="flex gap-1.5 flex-wrap">
                          {LABEL_COLORS.map((c) => (
                            <button
                              key={c.value}
                              type="button"
                              onClick={() => setForm((prev) => ({ ...prev, label_color: c.value }))}
                              className={`w-8 h-8 rounded-lg transition-all ${
                                form.label_color === c.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                              }`}
                              style={{ background: c.value }}
                              title={c.label}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Dates */}
                {form.type === 'event' && (
                  <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
                    <h3 className="text-sm font-medium">Periode Event</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Tanggal Mulai</Label>
                        <Input type="date" value={form.event_date} onChange={(e) => setForm((prev) => ({ ...prev, event_date: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Tanggal Selesai</Label>
                        <Input type="date" value={form.event_end_date} onChange={(e) => setForm((prev) => ({ ...prev, event_end_date: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5 Tema Warna */}
                <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
                  <Label className="text-sm font-medium">Tema Warna</Label>
                  <div className="grid grid-cols-5 gap-3">
                    {THEMES.map((t) => {
                      const Icon = THEME_ICONS[t.value]
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, theme: t.value }))}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            form.theme === t.value
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-border hover:border-primary/30'
                          } ${t.bg}`}
                        >
                          {Icon && <Icon className={`h-5 w-5 mx-auto mb-1 ${t.text}`} />}
                          <span className={`text-xs font-medium ${t.text}`}>{t.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Judul & Subtitle */}
                <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
                  <h3 className="text-sm font-medium">Konten Hero</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Judul</Label>
                      <Input
                        value={form.title}
                        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Judul hero"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Subtitle / Tagline</Label>
                      <Input
                        value={form.subtitle}
                        onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                        placeholder="Tagline hero"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Deskripsi</Label>
                      <textarea
                        className="flex w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Deskripsi hero..."
                      />
                    </div>
                  </div>
                </div>

                {/* Tombol CTA */}
                <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
                  <h3 className="text-sm font-medium">Tombol CTA</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Teks Tombol</Label>
                      <Input
                        value={form.button_text}
                        onChange={(e) => setForm((prev) => ({ ...prev, button_text: e.target.value }))}
                        placeholder="Koleksi Wanita"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Link Tombol</Label>
                      <Input
                        value={form.button_link}
                        onChange={(e) => setForm((prev) => ({ ...prev, button_link: e.target.value }))}
                        placeholder="/brand/blisera"
                      />
                    </div>
                  </div>
                </div>

                {/* Gambar Hero & Logo */}
                <div className="p-6 rounded-2xl bg-white border border-border space-y-6">
                  <h3 className="text-sm font-medium">Gambar</h3>

                  {/* Hero Image */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Gambar Hero</Label>
                    <p className="text-xs text-muted-foreground/70">Rekomendasi: minimal 1280&times;720px, rasio 16:9.</p>
                    {form.hero_image && (
                      <div className="relative rounded-xl border border-border overflow-hidden bg-white aspect-video flex items-center justify-center p-2 max-w-lg">
                        <img
                          src={`${form.hero_image}${rev > 0 ? `?rev=${rev}` : ''}`}
                          alt="Hero"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        ref={(el) => { fileInputRefs.current['hero_image'] = el }}
                        type="file" accept="image/*" className="hidden"
                        onChange={(e) => handleUploadClick('hero_image', e)}
                      />
                      <Button variant="outline" size="sm" className="gap-2" disabled={uploading} onClick={() => fileInputRefs.current['hero_image']?.click()}>
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                        {uploading ? 'Mengupload...' : form.hero_image ? 'Ganti Gambar' : 'Upload Gambar'}
                      </Button>
                      {form.hero_image && !uploading && (
                        <Button variant="ghost" size="sm" onClick={() => setForm((prev) => ({ ...prev, hero_image: '' }))}>
                          Hapus
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Brand info hint */}
                  {form.type === 'brand' && (
                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                      <p className="text-xs text-muted-foreground">
                        Logo dan bentuk logo untuk brand <strong>{form.brand_key?.toUpperCase()}</strong> diambil dari pengaturan Brand.
                        Atur di menu <strong>Brand</strong> pada sidebar.
                      </p>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="p-6 rounded-2xl bg-white border border-border space-y-4">
                  <h3 className="text-sm font-medium">Status</h3>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div
                      role="checkbox"
                      tabIndex={0}
                      onClick={() => setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setForm((prev) => ({ ...prev, is_active: !prev.is_active })) }}
                      className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-primary' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${form.is_active ? 'translate-x-5' : ''}`} />
                    </div>
                    <span className="text-sm">{form.is_active ? 'Aktif' : 'Nonaktif'}</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={resetForm}>Batal</Button>
                  <Button onClick={handleSave} disabled={saving} className="gap-2 min-w-[140px]">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambahkan'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {heroes.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Layout className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Belum ada hero. Klik "Tambah Hero" untuk membuat hero baru.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {heroes.map((hero) => {
                    const TypeIcon = getTypeIcon(hero.type)
                    const brand = getBrandInfo(hero.brand_key)
                    const productTypeInfo = getProductTypeInfo(hero.product_type)
                    const themeInfo = THEMES.find((t) => t.value === hero.theme)
                    const isDragged = draggedId === hero.id
                    const isDragOver = dragOverId === hero.id

                    return (
                      <div
                        key={hero.id}
                        draggable
                        onDragStart={() => handleDragStart(hero.id)}
                        onDragOver={(e) => handleDragOver(e, hero.id)}
                        onDragEnd={() => { setDraggedId(null); setDragOverId(null) }}
                        onDrop={() => handleDrop(hero.id)}
                        className={`rounded-2xl bg-white border border-border overflow-hidden transition-all ${
                          isDragOver ? 'border-primary shadow-lg scale-[1.01]' : ''
                        } ${isDragged ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-stretch">
                          {/* Drag Handle */}
                          <div className="flex items-center justify-center w-10 cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors" onMouseDown={() => handleDragStart(hero.id)}>
                            <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-4 flex items-center gap-4">
                            {/* Theme indicator */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${themeInfo?.bg || 'bg-gray-50'}`}>
                              {themeInfo && THEME_ICONS[themeInfo.value] && (
                                (() => {
                                  const Icon = THEME_ICONS[themeInfo.value]
                                  return <Icon className={`h-5 w-5 ${themeInfo.text}`} />
                                })()
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-heading font-semibold text-sm truncate">{hero.title}</h3>
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                                  <TypeIcon className="h-3 w-3" />
                                  {hero.type === 'brand' ? (brand?.name || hero.brand_key) : hero.type === 'product' ? hero.label : 'Event'}
                                </Badge>
                              </div>
                              {hero.subtitle && (
                                <p className="text-xs text-muted-foreground truncate mt-0.5">{hero.subtitle}</p>
                              )}
                            </div>

                            {/* Hero image preview */}
                            {hero.hero_image && (
                              <div className="w-16 h-9 rounded-lg border border-border overflow-hidden bg-white shrink-0 hidden sm:block">
                                <img src={hero.hero_image} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleToggleActive(hero)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  hero.is_active
                                    ? 'text-emerald-600 hover:bg-emerald-50'
                                    : 'text-muted-foreground hover:bg-muted'
                                }`}
                                title={hero.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                              >
                                {hero.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEdit(hero)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                title="Edit"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(hero.id)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {cropState && (
          <ImageCropperModal
            file={cropState.file}
            cropShape={cropState.shape}
            aspectRatio={cropState.aspectRatio}
            onCrop={handleCropResult}
            onCancel={cancelCrop}
          />
        )}
      </motion.div>
    </AdminLayout>
  )
}
