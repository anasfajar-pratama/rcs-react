import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Save, Loader2, Trash2, GripVertical, ImagePlus,
  FileText, Upload, X, ChevronUp, ChevronDown,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { AdminLayout, AdminLoader } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import { validateFileSize } from '../../lib/compress-image'
import type { Setting } from '../../data/admin'

interface LegalItem {
  title: string
  description: string
  date: string
  url: string
}

export default function AdminLegalAchievements() {
  const [settingId, setSettingId] = useState<number | null>(null)
  const [items, setItems] = useState<LegalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    api.get('/admin/settings').then((res) => {
      const all: Setting[] = res.data || []
      const setting = all.find((s: Setting) => s.key === 'legal_achievements')
      if (setting) {
        setSettingId(setting.id)
        try {
          const parsed = JSON.parse(setting.value || '[]')
          setItems(Array.isArray(parsed) ? parsed : [])
        } catch {
          setItems([])
        }
      }
    }).catch(() => {
      toast.error('Gagal memuat data')
    }).finally(() => setLoading(false))
  }, [])

  const addItem = () => {
    setItems((prev) => [...prev, { title: '', description: '', date: '', url: '' }])
  }

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateItem = (idx: number, field: keyof LegalItem, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)))
  }

  const moveItem = (idx: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? idx - 1 : idx + 1
    if (target < 0 || target >= items.length) return
    setItems((prev) => {
      const next = [...prev]
      const temp = next[idx]
      next[idx] = next[target]
      next[target] = temp
      return next
    })
  }

  const handleUpload = async (idx: number, file: File) => {
    if (!validateFileSize(file)) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }
    setUploadingIdx(idx)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const { data } = await api.post('/admin/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      updateItem(idx, 'url', data.imageUrl)
      toast.success('File berhasil diupload')
    } catch {
      toast.error('Gagal upload file')
    } finally {
      setUploadingIdx(null)
    }
  }

  const handleSave = async () => {
    if (!settingId) return
    setSaving(true)
    try {
      await api.put(`/admin/settings/${settingId}`, {
        value: JSON.stringify(items),
      })
      toast.success('Data legal & achievement berhasil disimpan')
    } catch {
      toast.error('Gagal menyimpan data')
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Legal & Achievement</h1>
            <p className="text-sm text-muted-foreground">
              {items.length} item — kelola dokumen legal dan sertifikat penghargaan
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={addItem} className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Item
            </Button>
            <Button onClick={handleSave} disabled={saving || !settingId} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Belum ada item. Klik "Tambah Item" untuk menambahkan legal atau sertifikat.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl border border-border p-5"
                >
                  <div className="flex items-start gap-3">
                    {/* Drag handle + move */}
                    <div className="flex flex-col items-center gap-0.5 pt-1">
                      <div className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <button type="button" onClick={() => moveItem(idx, 'up')} disabled={idx === 0} className="text-muted-foreground/50 hover:text-muted-foreground disabled:opacity-20">
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => moveItem(idx, 'down')} disabled={idx === items.length - 1} className="text-muted-foreground/50 hover:text-muted-foreground disabled:opacity-20">
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Item {idx + 1}</span>
                        <button type="button" onClick={() => removeItem(idx)} className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex gap-5">
                        {/* File preview — left */}
                        <div className="shrink-0 w-64 space-y-2">
                          <Label className="text-xs text-muted-foreground">File</Label>
                          <input
                            ref={(el) => { fileRefs.current[`file_${idx}`] = el }}
                            type="file" accept="image/*,application/pdf" className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0]
                              if (f) handleUpload(idx, f)
                              e.target.value = ''
                            }}
                          />
                          <div
                            className="aspect-[3/4] rounded-xl overflow-hidden border border-border bg-muted/10 cursor-pointer"
                            onClick={() => fileRefs.current[`file_${idx}`]?.click()}
                          >
                            {uploadingIdx === idx ? (
                              <div className="w-full h-full flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                              </div>
                            ) : item.url ? (
                              item.url.match(/\.pdf$/i) ? (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                  <FileText className="h-10 w-10 text-destructive" />
                                  <span className="text-[10px] text-center px-1">PDF</span>
                                </div>
                              ) : (
                                <img src={item.url} alt="" className="w-full h-full object-cover" />
                              )
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-muted-foreground/60">
                                <ImagePlus className="h-8 w-8" />
                                <span className="text-[10px] text-center px-1">Upload</span>
                              </div>
                            )}
                          </div>
                          {item.url && (
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => fileRefs.current[`file_${idx}`]?.click()}
                                className="flex-1 h-7 rounded-lg border border-border text-[11px] text-muted-foreground hover:bg-muted transition-colors"
                              >
                                Ganti
                              </button>
                              <button
                                type="button"
                                onClick={() => updateItem(idx, 'url', '')}
                                className="flex-1 h-7 rounded-lg border border-destructive/30 text-[11px] text-destructive hover:bg-red-50 transition-colors"
                              >
                                Hapus
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Form fields — right */}
                        <div className="flex-1 space-y-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Judul</Label>
                            <Input value={item.title} onChange={(e) => updateItem(idx, 'title', e.target.value)} placeholder="Nama legal / sertifikat" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Tanggal Diterima</Label>
                            <Input type="date" value={item.date} onChange={(e) => updateItem(idx, 'date', e.target.value)} />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Deskripsi</Label>
                            <textarea
                              className="flex w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                              rows={3} value={item.description}
                              onChange={(e) => updateItem(idx, 'description', e.target.value)}
                              placeholder="Deskripsi singkat..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={addItem} className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Item Lagi
              </Button>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSave} disabled={saving || !settingId} size="lg" className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Menyimpan...' : 'Simpan Semua'}
            </Button>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  )
}
