import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, ImagePlus, Loader2, ArrowLeft, Settings2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { ImageCropperModal } from '../../components/ui/image-cropper-modal'
import { RichEditor } from '../../components/ui/rich-editor'
import { AdminLayout, AdminLoader } from './AdminLayout'
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
    if (key === `logo_${bk}` || key === `logo_style_${bk}` || key.startsWith(`brand_${bk}_`)) return bk
  }
  return null
}

const FIELD_LABELS: Record<string, string> = {
  logo: 'Logo',
  logo_style: 'Bentuk Logo',
  name: 'Nama Brand',
  tagline: 'Tagline',
  description: 'Deskripsi',
  about: 'Tentang',
}

export default function AdminBrands() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [edited, setEdited] = useState<Record<string, string>>({})
  const [rev, setRev] = useState(0)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const { cropState, uploading, progress, startCrop, cancelCrop, handleCropResult, directUpload } = useImageUpload()
  const [skipCrop, setSkipCrop] = useState<Record<string, boolean>>({})

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

  const brandSettings = settings.filter((s) => s.group === 'brands' && !s.key.startsWith('hero_image_'))

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

  const selectedSection = selectedBrand ? brandSections.find((s) => s.key === selectedBrand) : null

  const handleSelectBrand = (key: string) => {
    setSelectedBrand(key)
  }

  const handleBack = () => {
    setSelectedBrand(null)
  }

  const handleUploadClick = (key: string, e: React.ChangeEvent<HTMLInputElement>, shape: 'round' | 'rect') => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!validateFileSize(file)) {
      toast.error('Ukuran file maksimal 5MB')
      e.target.value = ''
      return
    }
    e.target.value = ''
    const onDone = (url: string) => {
      setEdited((prev) => ({ ...prev, [key]: url }))
      setRev((r) => r + 1)
    }
    if (skipCrop[key]) {
      directUpload(file, onDone)
    } else {
      startCrop(file, shape, key.startsWith('hero_') ? 16/9 : 1, onDone)
    }
  }

  const handleSave = async () => {
    if (!selectedSection) return
    setSaving(true)
    try {
      const promises = selectedSection.items.map((s) =>
        api.put(`/admin/settings/${s.id}`, { value: edited[s.key] ?? '' })
      )
      await Promise.all(promises)
      toast.success(`Pengaturan ${selectedSection.name} berhasil disimpan`)
      load()
    } catch {
      toast.error(`Gagal menyimpan pengaturan ${selectedSection.name}`)
    } finally {
      setSaving(false)
    }
  }

  const renderField = (setting: Setting) => {
    const isRich = setting.key.endsWith('_description') || setting.key.endsWith('_about')

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
      const src = edited[setting.key]
      const showProgress = uploading && progress > 0 && progress < 100
      return (
        <div className="space-y-2">
          {isHero && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              Rekomendasi: minimal 1280&times;720px, rasio 16:9. Subjek utama sebaiknya di area tengah atau kanan.
            </p>
          )}
          {src && (
            <div className={`relative rounded-xl border border-border overflow-hidden bg-white flex items-center justify-center p-3 ${isHero ? 'w-full aspect-video' : 'w-32 h-32'}`}>
              <img src={`${src}${rev > 0 ? `?rev=${rev}` : ''}`} alt={isHero ? 'Hero' : 'Logo'} className="w-full h-full object-contain" />
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              ref={(el) => { fileInputRefs.current[setting.key] = el }}
              type="file" accept="image/*" className="hidden"
              onChange={(e) => handleUploadClick(setting.key, e, isHero ? 'rect' : 'round')}
            />
            <Button variant="outline" size="sm" className="gap-2" disabled={uploading} onClick={() => fileInputRefs.current[setting.key]?.click()}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              {uploading ? 'Mengupload...' : src ? (isHero ? 'Ganti Gambar Hero' : 'Ganti Logo') : (isHero ? 'Upload Gambar Hero' : 'Upload Logo')}
            </Button>
            {src && !uploading && (
              <Button variant="ghost" size="sm" onClick={() => setEdited((prev) => ({ ...prev, [setting.key]: '' }))}>
                Hapus
              </Button>
            )}
          </div>
          {showProgress && (
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          )}
          {isHero && (
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!skipCrop[setting.key]}
                onChange={(e) => setSkipCrop((prev) => ({ ...prev, [setting.key]: e.target.checked }))}
                className="rounded border-border accent-primary"
              />
              Upload langsung tanpa crop
            </label>
          )}
        </div>
      )
    }

    if (setting.type === 'text') {
      if (isRich) {
        return (
          <RichEditor
            value={edited[setting.key] ?? ''}
            onChange={(v) => setEdited((prev) => ({ ...prev, [setting.key]: v }))}
          />
        )
      }
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
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold">Brand</h1>
          <p className="text-sm text-muted-foreground">
            {selectedSection ? `Kelola ${selectedSection.name}` : 'Pilih brand untuk dikelola'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!selectedBrand ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-6 md:grid-cols-3"
            >
              {brandSections.map((brandSec) => {
                const logoSetting = brandSec.items.find((s) => s.key === `logo_${brandSec.key}`)
                const logoUrl = logoSetting ? edited[logoSetting.key] : ''
                return (
                  <div
                    key={brandSec.key}
                    className="rounded-2xl bg-white border border-border overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div
                      className="p-8 flex flex-col items-center gap-4"
                      style={{ background: `linear-gradient(180deg, ${brandSec.colorLight} 0%, white 80%)` }}
                    >
                      {logoUrl ? (
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white flex items-center justify-center">
                          <img src={logoUrl} alt={brandSec.name} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div
                          className="w-24 h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-white"
                          style={{ background: brandSec.color }}
                        >
                          {brandSec.name.charAt(0)}
                        </div>
                      )}
                      <div className="text-center">
                        <h2 className="font-heading text-xl font-bold" style={{ color: brandSec.color }}>
                          {brandSec.name}
                        </h2>
                      </div>
                    </div>
                    <div className="p-4 flex justify-center">
                      <Button
                        variant="outline"
                        className="gap-2 w-full"
                        onClick={() => handleSelectBrand(brandSec.key)}
                      >
                        <Settings2 className="h-4 w-4" />
                        Kelola
                      </Button>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          ) : selectedSection ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-6">
                <Button variant="ghost" size="sm" className="gap-2 mb-4" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </Button>
              </div>

              <div className="max-w-2xl space-y-6">
                {selectedSection.items.map((s) => {
                  const key = s.key
                    .replace(`logo_style_${selectedSection.key}`, 'logo_style')
                    .replace(`logo_${selectedSection.key}`, 'logo')
                    .replace(`hero_image_${selectedSection.key}`, 'hero_image')
                    .replace(`brand_${selectedSection.key}_`, '')
                  const label = FIELD_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

                  return (
                    <div key={s.id} className="p-6 rounded-2xl bg-white border border-border space-y-3">
                      <div>
                        <Label className="text-sm font-medium">{label}</Label>
                        {s.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                        )}
                      </div>
                      {renderField(s)}
                    </div>
                  )
                })}

                <div className="flex justify-end pt-2">
                  <Button onClick={handleSave} disabled={saving} className="gap-2 min-w-[140px]">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}
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
