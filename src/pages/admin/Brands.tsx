import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Save, ImagePlus, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { ImageCropperModal } from '../../components/ui/image-cropper-modal'
import { AdminLayout } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import { validateFileSize } from '../../lib/compress-image'
import { useImageUpload } from '../../hooks/use-image-upload'
import type { Setting } from '../../data/admin'
import { BRANDS } from '../../data/brands'

const brandKeys = ['blisera', 'fokka', 'pijar_nala']

interface BrandSection {
  key: string
  name: string
  color: string
  colorLight: string
  items: Setting[]
}

function isBrandKey(key: string): string | null {
  for (const bk of brandKeys) {
    if (key === `logo_${bk}` || key === `hero_image_${bk}` || key === `logo_style_${bk}` || key.startsWith(`brand_${bk}_`)) return bk
  }
  return null
}

export default function AdminBrands() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [savingBrand, setSavingBrand] = useState<string | null>(null)
  const [edited, setEdited] = useState<Record<string, string>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const load = () => {
    setLoading(true)
    api.get('/admin/settings').then((res) => {
      const all: Setting[] = res.data || []
      setSettings(all)
      const initial: Record<string, string> = {}
      all.forEach((s: Setting) => { initial[s.key] = s.value })
      setEdited(initial)
    }).catch(() => {
      toast.error('Gagal memuat data brand')
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const { cropState, uploading, startCrop, cancelCrop, handleCropResult } = useImageUpload()

  const handleUploadClick = (key: string, e: React.ChangeEvent<HTMLInputElement>, shape: 'round' | 'rect') => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!validateFileSize(file)) {
      toast.error('Ukuran file maksimal 5MB')
      e.target.value = ''
      return
    }
    startCrop(file, shape, 1, (url) => {
      setEdited((prev) => ({ ...prev, [key]: url }))
    })
  }

  const handleSave = async (items: Setting[], brandName: string) => {
    setSavingBrand(brandName)
    try {
      const promises = items.map((s) =>
        api.put(`/admin/settings/${s.id}`, { value: edited[s.key] ?? '' })
      )
      await Promise.all(promises)
      toast.success(`Pengaturan ${brandName} berhasil disimpan`)
    } catch {
      toast.error(`Gagal menyimpan pengaturan ${brandName}`)
    } finally {
      setSavingBrand(null)
    }
  }

  const brandSettings = settings.filter((s) => s.group === 'brands')

  const brandSections: BrandSection[] = brandKeys.map((bk) => {
    const brand = Object.values(BRANDS).find((b) => b.key === bk)
    return {
      key: bk,
      name: brand?.name || bk.toUpperCase(),
      color: brand?.color || '#6B7280',
      colorLight: brand?.colorLight || '#F3F4F6',
      items: brandSettings.filter((s) => isBrandKey(s.key) === bk),
    }
  })

  const renderField = (setting: Setting) => {
    if (setting.key.startsWith('logo_style_')) {
      const value = edited[setting.key] || 'rounded'
      const options = [
        { value: 'circle', label: 'Lingkaran' },
        { value: 'rounded', label: 'Rounded' },
        { value: 'square', label: 'Persegi' },
      ]
      return (
        <div className="flex gap-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setEdited((prev) => ({ ...prev, [setting.key]: opt.value }))}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                value === opt.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )
    }

    if (setting.type === 'image') {
      const isHero = setting.key.startsWith('hero_image_')
      const isUploading = uploading
      return (
        <div className="space-y-2">
          {edited[setting.key] && (
            <div className="w-32 h-32 rounded-xl border border-border overflow-hidden bg-white flex items-center justify-center p-3">
              <img src={edited[setting.key]} alt="Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <div className="flex gap-2">
            <input
              ref={(el) => { fileInputRefs.current[setting.key] = el }}
              type="file" accept="image/*" className="hidden"
              onChange={(e) => handleUploadClick(setting.key, e, isHero ? 'rect' : 'round')}
            />
            <Button variant="outline" size="sm" className="gap-2" disabled={isUploading} onClick={() => fileInputRefs.current[setting.key]?.click()}>
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              {isUploading ? 'Mengupload...' : edited[setting.key] ? (isHero ? 'Ganti Gambar Hero' : 'Ganti Logo') : (isHero ? 'Upload Gambar Hero' : 'Upload Logo')}
            </Button>
            {edited[setting.key] && (
              <Button variant="ghost" size="sm" onClick={() => setEdited((prev) => ({ ...prev, [setting.key]: '' }))}>
                Hapus
              </Button>
            )}
          </div>
        </div>
      )
    }

    if (setting.type === 'text') {
      return (
        <textarea
          className="flex w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
          rows={3} value={edited[setting.key] ?? ''}
          onChange={(e) => setEdited((prev) => ({ ...prev, [setting.key]: e.target.value }))}
        />
      )
    }

    return (
      <Input value={edited[setting.key] ?? ''} onChange={(e) => setEdited((prev) => ({ ...prev, [setting.key]: e.target.value }))} />
    )
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold">Brand</h1>
          <p className="text-sm text-muted-foreground">Atur logo, tagline, dan deskripsi setiap brand</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Memuat...</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {brandSections.map((brandSec) => (
              <div
                key={brandSec.key}
                className="rounded-2xl bg-white border overflow-hidden"
                style={{ borderColor: `${brandSec.color}30` }}
              >
                <div
                  className="px-6 py-5"
                  style={{ background: `linear-gradient(135deg, ${brandSec.colorLight} 0%, white 80%)` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold"
                      style={{ background: brandSec.color, color: 'white' }}
                    >
                      {brandSec.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-heading font-semibold text-lg" style={{ color: brandSec.color }}>
                        {brandSec.name}
                      </h2>
                      <p className="text-xs text-muted-foreground">{brandSec.items.length} pengaturan</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 space-y-5">
                  {brandSec.items.map((s) => {
                    const label = s.key
                      .replace(`logo_style_${brandSec.key}`, 'Bentuk Logo')
                      .replace(`logo_${brandSec.key}`, 'Logo')
                      .replace(`hero_image_${brandSec.key}`, 'Gambar Hero')
                      .replace(`brand_${brandSec.key}_`, '')
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())
                    return (
                      <div key={s.id} className="space-y-1.5">
                        <Label className="text-sm font-medium">{label}</Label>
                        {s.description && (
                          <p className="text-xs text-muted-foreground">{s.description}</p>
                        )}
                        {renderField(s)}
                      </div>
                    )
                  })}
                </div>

                <div className="px-6 py-4 border-t flex justify-end" style={{ borderColor: `${brandSec.color}20` }}>
                  <Button
                    onClick={() => handleSave(brandSec.items, brandSec.name)}
                    disabled={savingBrand === brandSec.name}
                    size="sm"
                    className="gap-2"
                    style={{
                      background: brandSec.color,
                      color: 'white',
                      border: 'none',
                    }}
                  >
                    <Save className="h-4 w-4" />
                    {savingBrand === brandSec.name ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

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
