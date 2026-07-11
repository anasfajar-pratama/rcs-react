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
import { ImagePlus, Loader2, Trash2, RefreshCw, FileText } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { validateFileSize } from '../../lib/compress-image'
import { useImageUpload } from '../../hooks/use-image-upload'

const iconOptions = [
  'Sparkles', 'Shield', 'Leaf', 'Heart', 'Zap', 'Wind', 'Briefcase',
  'Smile', 'Star', 'Award', 'Crown', 'Gift', 'Trophy', 'Sun', 'Moon',
  'Users', 'Globe', 'Palette', 'ThumbsUp', 'Diamond',
]

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const SelectedIcon = value && (LucideIcons as any)[value] ? (LucideIcons as any)[value] : null

  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Ikon</Label>
      {SelectedIcon ? (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <SelectedIcon className="h-5 w-5 text-primary" />
          </div>
          <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>Ganti Ikon</Button>
          <Button variant="ghost" size="sm" onClick={() => onChange('')} className="text-destructive">Hapus</Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setOpen(!open)}>
          <ImagePlus className="h-4 w-4" /> Pilih Ikon
        </Button>
      )}
      {open && (
        <div className="border border-border rounded-xl p-3 bg-white mt-2">
          <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto">
            {iconOptions.map((name) => {
              const IconComp = (LucideIcons as any)[name]
              if (!IconComp) return null
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => { onChange(name); setOpen(false) }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    value === name ? 'bg-primary/15 text-primary ring-2 ring-primary/30' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  title={name}
                >
                  <IconComp className="h-4 w-4" />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function FieldInput({ field, content, setContent }: { field: any; content: Record<string, string>; setContent: any }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{field.label}</Label>
      {field.iconPicker ? (
        <IconPicker value={content[field.key] || ''} onChange={(v) => setContent({ ...content, [field.key]: v })} />
      ) : field.richText ? (
        <RichEditor value={content[field.key] || ''} onChange={(v) => setContent({ ...content, [field.key]: v })} placeholder={`Tulis ${field.label.toLowerCase()}...`} />
      ) : field.multiline ? (
        <textarea className="flex w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none" rows={3} value={content[field.key] || ''} onChange={(e) => setContent({ ...content, [field.key]: e.target.value })} />
      ) : (
        <Input value={content[field.key] || ''} onChange={(e) => setContent({ ...content, [field.key]: e.target.value })} />
      )}
    </div>
  )
}

const valueFields = (n: number) => `about_value_${n}`
const teamFields = (n: number) => `about_team_${n}`

export default function AdminAbout() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [teamUploading, setTeamUploading] = useState<Record<string, boolean>>({})
  const [pdfUploading, setPdfUploading] = useState<Record<string, boolean>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const teamInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const pdfInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

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

  const handleTeamImageUpload = async (memberKey: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }
    setTeamUploading((prev) => ({ ...prev, [memberKey]: true }))
    try {
      const { compressImage } = await import('../../lib/compress-image')
      const compressed = await compressImage(file)
      const fd = new FormData()
      fd.append('image', compressed)
      const { data } = await api.post('/admin/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setContent((prev) => ({ ...prev, [memberKey]: data.imageUrl }))
      toast.success('Gambar anggota berhasil diupload')
    } catch {
      toast.error('Gagal upload gambar')
    } finally {
      setTeamUploading((prev) => ({ ...prev, [memberKey]: false }))
    }
  }

  const handlePdfUpload = async (key: string, file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 20MB')
      return
    }
    setPdfUploading((prev) => ({ ...prev, [key]: true }))
    try {
      const fd = new FormData()
      fd.append('image', file)
      const { data } = await api.post('/admin/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setContent((prev) => ({ ...prev, [key]: data.imageUrl }))
      toast.success('Dokumen berhasil diupload')
    } catch {
      toast.error('Gagal upload dokumen')
    } finally {
      setPdfUploading((prev) => ({ ...prev, [key]: false }))
    }
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
        <AdminLoader />
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
          {/* Hero */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-heading text-lg font-bold mb-4 pb-3 border-b border-border">Hero</h2>
            <div className="grid grid-cols-1 gap-4">
              <FieldInput field={{ key: 'about_hero_title', label: 'Judul Hero' }} content={content} setContent={setContent} />
              <FieldInput field={{ key: 'about_hero_subtitle', label: 'Subtitle Hero', multiline: true }} content={content} setContent={setContent} />
            </div>
          </div>

          {/* Cerita Kami */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-heading text-lg font-bold mb-4 pb-3 border-b border-border">Cerita Kami</h2>
            <div className="mb-4 space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Gambar</Label>
              {content.about_story_image && (
                <img src={content.about_story_image} alt="Cerita Kami" className="h-32 w-auto rounded-lg border border-border object-contain mb-2" />
              )}
              <div className="flex gap-2">
                <input ref={(el) => { fileInputRefs.current.about_story_image = el }} type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadClick('about_story_image', e)} />
                <Button variant="outline" size="sm" className="gap-2" disabled={uploading} onClick={() => fileInputRefs.current.about_story_image?.click()}>
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                  {uploading ? 'Mengupload...' : content.about_story_image ? 'Ganti Gambar' : 'Upload Gambar'}
                </Button>
                {content.about_story_image && (
                  <Button variant="ghost" size="sm" onClick={() => setContent((prev) => ({ ...prev, about_story_image: '' }))}>Hapus</Button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <FieldInput field={{ key: 'about_story_heading', label: 'Judul' }} content={content} setContent={setContent} />
              <FieldInput field={{ key: 'about_story_text', label: 'Teks Cerita', richText: true }} content={content} setContent={setContent} />
            </div>
          </div>

          {/* Nilai-Nilai */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-heading text-lg font-bold mb-4 pb-3 border-b border-border">Nilai-Nilai</h2>
            <div className="mb-6">
              <FieldInput field={{ key: 'about_values_title', label: 'Judul H1' }} content={content} setContent={setContent} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="border border-border rounded-xl p-4 space-y-3">
                  <h3 className="font-heading font-semibold text-sm text-primary">Nilai {n}</h3>
                  <div className="border-t border-border pt-3 space-y-3">
                    <IconPicker value={content[`about_value_${n}_icon`] || ''} onChange={(v) => setContent({ ...content, [`about_value_${n}_icon`]: v })} />
                    <FieldInput field={{ key: `about_value_${n}_title`, label: 'Judul' }} content={content} setContent={setContent} />
                    <FieldInput field={{ key: `about_value_${n}_desc`, label: 'Nilai', multiline: true }} content={content} setContent={setContent} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tim */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-heading text-lg font-bold mb-4 pb-3 border-b border-border">Tim</h2>
            <div className="mb-6">
              <FieldInput field={{ key: 'about_team_title', label: 'Judul H1' }} content={content} setContent={setContent} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => {
                const imageKey = `about_team_${n}_image`
                const uploading_ = teamUploading[imageKey]
                return (
                  <div key={n} className="border border-border rounded-xl p-4 space-y-3">
                    <h3 className="font-heading font-semibold text-sm text-primary">Anggota {n}</h3>
                    <div className="border-t border-border pt-3 space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Pict</Label>
                        <div className="relative group w-24 h-24 rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-primary/20 to-accent/20">
                          {content[imageKey] ? (
                            <>
                              <img src={content[imageKey]} alt={`Anggota ${n}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                                <button type="button" onClick={() => teamInputRefs.current[imageKey]?.click()} className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"><RefreshCw className="h-3.5 w-3.5" /></button>
                                <button type="button" onClick={() => setContent((prev) => ({ ...prev, [imageKey]: '' }))} className="w-7 h-7 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center cursor-pointer" onClick={() => teamInputRefs.current[imageKey]?.click()}>
                              {uploading_ ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : <ImagePlus className="h-5 w-5 text-muted-foreground" />}
                            </div>
                          )}
                        </div>
                        <input ref={(el) => { teamInputRefs.current[imageKey] = el }} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleTeamImageUpload(imageKey, f); e.target.value = '' }} />
                      </div>
                      <FieldInput field={{ key: `about_team_${n}_name`, label: 'Nama Anggota' }} content={content} setContent={setContent} />
                      <FieldInput field={{ key: `about_team_${n}_role`, label: 'Jabatan' }} content={content} setContent={setContent} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {/* Perizinan */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-heading text-lg font-bold mb-4 pb-3 border-b border-border">Perizinan</h2>
            <div className="mb-6">
              <FieldInput field={{ key: 'about_permit_title', label: 'Judul H1' }} content={content} setContent={setContent} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => {
                const urlKey = `about_permit_${n}_url`
                const uploading_ = pdfUploading[urlKey]
                return (
                  <div key={n} className="border border-border rounded-xl p-4 space-y-3">
                    <h3 className="font-heading font-semibold text-sm text-primary">Dokumen {n}</h3>
                    <div className="border-t border-border pt-3 space-y-3">
                      <FieldInput field={{ key: `about_permit_${n}_title`, label: 'Judul Dokumen' }} content={content} setContent={setContent} />
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">File PDF</Label>
                        {content[urlKey] ? (
                          <div className="flex items-center gap-3">
                            <a href={content[urlKey]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/30 hover:bg-muted transition-colors text-sm">
                              <FileText className="h-4 w-4 text-destructive" />
                              <span className="text-foreground truncate max-w-[200px]">{content[`about_permit_${n}_title`] || `Dokumen ${n}`}</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => pdfInputRefs.current[urlKey]?.click()}
                              className="w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center hover:bg-muted transition-colors"
                              title="Ganti PDF"
                            >
                              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setContent((prev) => ({ ...prev, [urlKey]: '' }))}
                              className="w-7 h-7 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                              title="Hapus PDF"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div
                            className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/40 transition-colors"
                            onClick={() => pdfInputRefs.current[urlKey]?.click()}
                          >
                            {uploading_ ? (
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            ) : (
                              <>
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Upload PDF</span>
                              </>
                            )}
                          </div>
                        )}
                        <input
                          ref={(el) => { pdfInputRefs.current[urlKey] = el }}
                          type="file" accept="application/pdf" className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0]
                            if (f) handlePdfUpload(urlKey, f)
                            e.target.value = ''
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
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
