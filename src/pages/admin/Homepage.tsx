import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { RichEditor } from '../../components/ui/rich-editor'
import { ImageCropperModal } from '../../components/ui/image-cropper-modal'
import { AdminLayout, AdminLoader } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import { ImagePlus, Loader2 } from 'lucide-react'
import { validateFileSize } from '../../lib/compress-image'
import { useImageUpload } from '../../hooks/use-image-upload'

const sections = [
  {
    title: 'Koleksi Kategori',
    fields: [
      { key: 'section_kategori_title', label: 'Judul', multiline: false },
      { key: 'section_kategori_subtitle', label: 'Subtitle', multiline: true },
    ],
  },
  {
    title: 'Produk Unggulan',
    fields: [
      { key: 'section_unggulan_title', label: 'Judul', multiline: false },
      { key: 'section_unggulan_subtitle', label: 'Subtitle', multiline: true },
    ],
  },
  {
    title: 'Promo Spesial',
    fields: [
      { key: 'section_promo_title', label: 'Judul', multiline: false },
      { key: 'section_promo_subtitle', label: 'Subtitle', multiline: true },
    ],
  },
  {
    title: 'Produk Terbaru',
    fields: [
      { key: 'section_terbaru_title', label: 'Judul', multiline: false },
      { key: 'section_terbaru_subtitle', label: 'Subtitle', multiline: true },
    ],
  },
  {
    title: 'Mengapa Produk Kami?',
    fields: [
      { key: 'section_features_title', label: 'Judul', multiline: false },
      { key: 'section_features_subtitle', label: 'Subtitle', multiline: true },
    ],
  },
  {
    title: 'Testimoni',
    fields: [
      { key: 'section_testimonials_title', label: 'Judul', multiline: false },
      { key: 'section_testimonials_subtitle', label: 'Subtitle', multiline: true },
    ],
  },
  {
    title: 'Tentang Kami',
    fields: [
      { key: 'about_title', label: 'Judul', multiline: false },
      { key: 'about_text', label: 'Teks', richText: true },
      { key: 'about_quote', label: 'Kutipan', multiline: true },
    ],
    hasImage: true,
    imageKey: 'about_image',
  },
  {
    title: 'Newsletter',
    fields: [
      { key: 'newsletter_title', label: 'Judul', multiline: false },
      { key: 'newsletter_subtitle', label: 'Subtitle', multiline: false },
    ],
  },
]

export default function AdminHomepage() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    api.get('/admin/homepage-content').then((res) => {
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
      await api.post('/admin/homepage-content', content)
      toast.success('Konten homepage berhasil disimpan')
    } catch {
      toast.error('Gagal menyimpan konten')
    } finally {
      setSaving(false)
    }
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">Konten Homepage</h1>
            <p className="text-sm text-muted-foreground">Edit teks yang ditampilkan di setiap seksi halaman utama</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Semua'}
          </Button>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-heading text-lg font-bold mb-4 pb-3 border-b border-border">{section.title}</h2>
              {(section as any).hasImage && (
                <div className="mb-4 space-y-2">
                  <Label>Gambar</Label>
                  {(content as any)[(section as any).imageKey] && (
                    <img src={(content as any)[(section as any).imageKey]} alt="Tentang Kami" className="h-32 w-auto rounded-lg border border-border object-contain mb-2" />
                  )}
                  <div className="flex gap-2">
                    <input
                      ref={(el) => { (fileInputRefs.current as any)[(section as any).imageKey] = el }}
                      type="file" accept="image/*" className="hidden"
                      onChange={(e) => handleUploadClick((section as any).imageKey, e)}
                    />
                    <Button variant="outline" size="sm" className="gap-2" disabled={uploading} onClick={() => fileInputRefs.current[(section as any).imageKey]?.click()}>
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                      {uploading ? 'Mengupload...' : (content as any)[(section as any).imageKey] ? 'Ganti Gambar' : 'Upload Gambar'}
                    </Button>
                    {(content as any)[(section as any).imageKey] && (
                      <Button variant="ghost" size="sm" onClick={() => setContent((prev) => ({ ...prev, [(section as any).imageKey]: '' }))}>
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
                    {(field as any).richText ? (
                      <RichEditor
                        value={content[field.key] || ''}
                        onChange={(v) => setContent({ ...content, [field.key]: v })}
                        placeholder={`Tulis ${field.label.toLowerCase()}...`}
                      />
                    ) : field.multiline ? (
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
