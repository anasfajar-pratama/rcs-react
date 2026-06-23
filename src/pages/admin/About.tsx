import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { ImageCropperModal } from '../../components/ui/image-cropper-modal'
import { AdminLayout } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import { ImagePlus, Loader2 } from 'lucide-react'
import { validateFileSize } from '../../lib/compress-image'
import { useImageUpload } from '../../hooks/use-image-upload'

const sections = [
  {
    title: 'Hero',
    fields: [
      { key: 'about_hero_title', label: 'Judul Hero', multiline: false },
      { key: 'about_hero_subtitle', label: 'Subtitle Hero', multiline: true },
    ],
  },
  {
    title: 'Cerita Kami',
    hasImage: true,
    imageKey: 'about_story_image',
    fields: [
      { key: 'about_story_heading', label: 'Judul', multiline: false },
      { key: 'about_story_text1', label: 'Paragraf 1', multiline: true },
      { key: 'about_story_text2', label: 'Paragraf 2', multiline: true },
      { key: 'about_story_text3', label: 'Paragraf 3', multiline: true },
    ],
  },
  {
    title: 'Nilai-Nilai',
    fields: [
      { key: 'about_values_title', label: 'Judul', multiline: false },
      { key: 'about_value_1_title', label: 'Nilai 1 — Judul', multiline: false },
      { key: 'about_value_1_desc', label: 'Nilai 1 — Deskripsi', multiline: true },
      { key: 'about_value_2_title', label: 'Nilai 2 — Judul', multiline: false },
      { key: 'about_value_2_desc', label: 'Nilai 2 — Deskripsi', multiline: true },
      { key: 'about_value_3_title', label: 'Nilai 3 — Judul', multiline: false },
      { key: 'about_value_3_desc', label: 'Nilai 3 — Deskripsi', multiline: true },
      { key: 'about_value_4_title', label: 'Nilai 4 — Judul', multiline: false },
      { key: 'about_value_4_desc', label: 'Nilai 4 — Deskripsi', multiline: true },
    ],
  },
  {
    title: 'Tim',
    fields: [
      { key: 'about_team_title', label: 'Judul', multiline: false },
      { key: 'about_team_1_name', label: 'Anggota 1 — Nama', multiline: false },
      { key: 'about_team_1_role', label: 'Anggota 1 — Jabatan', multiline: false },
      { key: 'about_team_2_name', label: 'Anggota 2 — Nama', multiline: false },
      { key: 'about_team_2_role', label: 'Anggota 2 — Jabatan', multiline: false },
      { key: 'about_team_3_name', label: 'Anggota 3 — Nama', multiline: false },
      { key: 'about_team_3_role', label: 'Anggota 3 — Jabatan', multiline: false },
      { key: 'about_team_4_name', label: 'Anggota 4 — Nama', multiline: false },
      { key: 'about_team_4_role', label: 'Anggota 4 — Jabatan', multiline: false },
    ],
  },
]

export default function AdminAbout() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    api.get('/admin/about-content').then((res) => {
      if (res.data) setContent(res.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

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
      setContent((prev) => ({ ...prev, [key]: url }))
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.post('/admin/about-content', content)
      toast.success('Konten about berhasil disimpan')
    } catch {
      toast.error('Gagal menyimpan konten')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-muted-foreground">Memuat...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">Konten Halaman About</h1>
            <p className="text-sm text-muted-foreground">Edit teks yang ditampilkan di halaman /about</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Semua'}
          </Button>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-heading text-lg font-bold mb-4 pb-3 border-b border-border">{section.title}</h2>
              {'hasImage' in section && section.hasImage && (
                <div className="mb-4 space-y-2">
                  <Label>Gambar</Label>
                  {content[section.imageKey] && (
                    <img src={content[section.imageKey]} alt={section.title} className="h-32 w-auto rounded-lg border border-border object-contain mb-2" />
                  )}
                  <div className="flex gap-2">
                    <input
                      ref={(el) => { fileInputRefs.current[section.imageKey] = el }}
                      type="file" accept="image/*" className="hidden"
                      onChange={(e) => handleUploadClick(section.imageKey, e)}
                    />
                    <Button variant="outline" size="sm" className="gap-2" disabled={uploading} onClick={() => fileInputRefs.current[section.imageKey]?.click()}>
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                      {uploading ? 'Mengupload...' : content[section.imageKey] ? 'Ganti Gambar' : 'Upload Gambar'}
                    </Button>
                    {content[section.imageKey] && (
                      <Button variant="ghost" size="sm" onClick={() => setContent((prev) => ({ ...prev, [section.imageKey]: '' }))}>
                        Hapus
                      </Button>
                    )}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label>{field.label}</Label>
                    {field.multiline ? (
                      <textarea
                        className="flex w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                        rows={3}
                        value={content[field.key] || ''}
                        onChange={(e) => setContent({ ...content, [field.key]: e.target.value })}
                      />
                    ) : (
                      <Input
                        value={content[field.key] || ''}
                        onChange={(e) => setContent({ ...content, [field.key]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
          </Button>
        </div>
      </motion.div>
      {cropState && (
        <ImageCropperModal
          file={cropState.file}
          cropShape={cropState.shape}
          aspectRatio={cropState.aspectRatio}
          onCrop={handleCropResult}
          onCancel={cancelCrop}
        />
      )}
    </AdminLayout>
  )
}
