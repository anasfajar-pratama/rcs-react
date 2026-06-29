import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Save, ImagePlus, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { ImageCropperModal } from '../../components/ui/image-cropper-modal'
import { AdminLayout, AdminLoader } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import { validateFileSize } from '../../lib/compress-image'
import { useImageUpload } from '../../hooks/use-image-upload'
import type { Setting } from '../../data/admin'

const groupLabels: Record<string, string> = {
  general: 'Umum',
  seo: 'SEO',
  social: 'Media Sosial',
  contact: 'Kontak',
  features: 'Fitur',
}

const groupIcons: Record<string, string> = {
  general: '⚙️',
  seo: '🔍',
  social: '🌐',
  contact: '📞',
  features: '🚀',
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [savingGroups, setSavingGroups] = useState<Record<string, boolean>>({})
  const [edited, setEdited] = useState<Record<string, string>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const load = () => {
    setLoading(true)
    api.get('/admin/settings').then((res) => {
      setSettings(res.data || [])
      const initial: Record<string, string> = {}
      ;(res.data || []).forEach((s: Setting) => { initial[s.key] = s.value })
      setEdited(initial)
    }).catch(() => {
      toast.error('Gagal memuat pengaturan')
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const { cropState, uploading, startCrop, cancelCrop, handleCropResult } = useImageUpload()

  const handleUploadClick = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!validateFileSize(file)) {
      toast.error('Ukuran file maksimal 5MB')
      e.target.value = ''
      return
    }
    startCrop(file, 'rect', 1, (url) => {
      setEdited((prev) => ({ ...prev, [key]: url }))
    })
  }

  const handleSave = async (items: Setting[], groupLabel: string) => {
    const groupKey = groupLabel.toLowerCase().replace(/\s+/g, '-')
    setSavingGroups((prev) => ({ ...prev, [groupKey]: true }))
    try {
      const promises = items.map((s) =>
        api.put(`/admin/settings/${s.id}`, { value: edited[s.key] ?? '' })
      )
      await Promise.all(promises)
      toast.success(`Pengaturan ${groupLabel} berhasil disimpan`)
    } catch {
      toast.error(`Gagal menyimpan pengaturan ${groupLabel}`)
    } finally {
      setSavingGroups((prev) => ({ ...prev, [groupKey]: false }))
    }
  }

  const renderField = (setting: Setting) => {
    if (setting.type === 'image') {
      return (
        <div className="space-y-2">
          {edited[setting.key] && (
            <img src={edited[setting.key]} alt="Logo" className="h-16 w-auto rounded-lg border border-border object-contain" />
          )}
          <div className="flex gap-2">
            <input
              ref={(el) => { fileInputRefs.current[setting.key] = el }}
              type="file" accept="image/*" className="hidden"
              onChange={(e) => handleUploadClick(setting.key, e)}
            />
            <Button variant="outline" size="sm" className="gap-2" disabled={uploading} onClick={() => fileInputRefs.current[setting.key]?.click()}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              {uploading ? 'Mengupload...' : edited[setting.key] ? 'Ganti Gambar' : 'Upload Gambar'}
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

    if (setting.type === 'boolean') {
      return (
        <div className="flex items-center gap-3 h-10">
          <Switch
            checked={edited[setting.key] === '1'}
            onCheckedChange={(v) => setEdited((prev) => ({ ...prev, [setting.key]: v ? '1' : '0' }))}
          />
          <span className="text-sm text-muted-foreground">{edited[setting.key] === '1' ? 'Aktif' : 'Nonaktif'}</span>
        </div>
      )
    }

    if (setting.key === 'whatsapp_phone') {
      return (
        <Input
          value={edited[setting.key] ?? ''}
          onChange={(e) => setEdited((prev) => ({ ...prev, [setting.key]: e.target.value }))}
          placeholder="6281234567890"
          pattern="62\d{7,15}"
          title="Harus diawali 62 (tanpa +), hanya angka. Contoh: 6281234567890"
        />
      )
    }

    return (
      <Input value={edited[setting.key] ?? ''} onChange={(e) => setEdited((prev) => ({ ...prev, [setting.key]: e.target.value }))} />
    )
  }

  const regularGroups = settings.reduce<Record<string, Setting[]>>((acc, s) => {
    if (s.group === 'brands') return acc
    if (!acc[s.group]) acc[s.group] = []
    acc[s.group].push(s)
    return acc
  }, {})

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">Pengaturan</h1>
            <p className="text-sm text-muted-foreground">Atur pengaturan website</p>
          </div>
        </div>

        {loading ? (
          <AdminLoader />
        ) : (
          <div className="space-y-6">
            {Object.entries(regularGroups).map(([group, items]) => {
              const groupKey = group.toLowerCase().replace(/\s+/g, '-')
              return (
                <div key={group} className="p-6 rounded-2xl bg-white border border-border space-y-4">
                  <h2 className="font-heading font-semibold text-lg">
                    {groupIcons[group]} {groupLabels[group] || group}
                  </h2>
                  <div className="divide-y divide-border">
                    {items.map((s) => (
                      <div key={s.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">{s.key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</Label>
                          {s.description && (
                            <p className="text-xs text-muted-foreground">{s.description}</p>
                          )}
                        </div>
                        <div className="mt-2">{renderField(s)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => handleSave(items, groupLabels[group] || group)}
                      disabled={savingGroups[groupKey]}
                      size="sm"
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {savingGroups[groupKey] ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                  </div>
                </div>
              )
            })}
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
