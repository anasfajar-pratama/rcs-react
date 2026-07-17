import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { RichEditor } from '../../components/ui/rich-editor'
import { ImageCropperModal } from '../../components/ui/image-cropper-modal'
import { AdminLayout, AdminLoader } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import { ImagePlus, Loader2, Sparkles, Shield, Leaf, Star, Award, Heart, BadgeCheck, Gem, Flower2, Droplets, Palette, Smile, Sparkle, Feather, Wind, Sun } from 'lucide-react'
import { validateFileSize } from '../../lib/compress-image'
import { useImageUpload } from '../../hooks/use-image-upload'

const sections = [
  {
    title: 'Koleksi Kategori',
    span: 'full',
    fields: [
      { key: 'section_kategori_title', label: 'Judul', multiline: false },
      { key: 'section_kategori_subtitle', label: 'Subtitle', multiline: true },
    ],
    brands: [
      { name: 'BLISERA', key: 'blisera', imageKey: 'category_hero_blisera', descKey: 'category_desc_blisera', color: '#B76E79' },
      { name: 'FOKKA', key: 'fokka', imageKey: 'category_hero_fokka', descKey: 'category_desc_fokka', color: '#4A5568' },
      { name: 'PIJAR NALA', key: 'pijar_nala', imageKey: 'category_hero_pijar_nala', descKey: 'category_desc_pijar_nala', color: '#C3E6FC' },
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
    span: 'full',
    layout: 'features',
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
    title: 'Galeri & Berita',
    fields: [
      { key: 'section_gallery_title', label: 'Judul', multiline: false },
      { key: 'section_gallery_subtitle', label: 'Subtitle', multiline: true },
    ],
  },
  {
    title: 'Tentang Kami',
    span: 'full',
    layout: 'about',
    fields: [
      { key: 'about_title', label: 'Judul', multiline: false },
      { key: 'about_text', label: 'Teks', richText: true },
      { key: 'about_quote', label: 'Kutipan', multiline: true },
    ],
    hasImage: true,
    imageKey: 'about_image',
  },
]

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Shield, Leaf, Star, Award, Heart, BadgeCheck, Gem,
  Flower2, Droplets, Palette, Smile, Sparkle, Feather, Wind, Sun,
}

export default function AdminHomepage() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [savingSection, setSavingSection] = useState<string | null>(null)
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

  const collectSectionKeys = (section: any): string[] => {
    const keys: string[] = []
    for (const field of section.fields || []) keys.push(field.key)
    if (section.imageKey) keys.push(section.imageKey)
    if (section.layout === 'features') keys.push('features_cards')
    for (const brand of section.brands || []) {
      keys.push(brand.imageKey)
      keys.push(brand.descKey)
    }
    return keys
  }

  const handleSaveSection = async (section: any) => {
    setSavingSection(section.title)
    try {
      const keys = collectSectionKeys(section)
      const payload: Record<string, string> = {}
      for (const key of keys) {
        if (content[key] !== undefined) payload[key] = content[key]
      }
      await api.post('/admin/homepage-content', payload)
      toast.success(`"${section.title}" berhasil disimpan`)
    } catch {
      toast.error(`Gagal menyimpan "${section.title}"`)
    } finally {
      setSavingSection(null)
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
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold">Konten Homepage</h1>
          <p className="text-sm text-muted-foreground">Edit teks yang ditampilkan di setiap seksi halaman utama</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className={`col-span-12 ${(section as any).span === 'full' ? 'md:col-span-12' : 'md:col-span-6'} bg-white rounded-2xl border border-border p-6 flex flex-col`}
            >
              <h2 className="font-heading text-lg font-bold mb-4 pb-3 border-b border-border">{section.title}</h2>
              {(section as any).layout === 'features' ? (
                <FeatureCardsEditor
                  section={section}
                  content={content}
                  setContent={setContent}
                />
              ) : (section as any).layout === 'about' ? (
                <div className="flex-1 grid md:grid-cols-3 gap-8 items-start">
                  <div className="md:col-span-2 space-y-5">
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
                            rows={4}
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
                  <div className="space-y-3">
                    <Label>Gambar</Label>
                    <div className="aspect-[4/5] rounded-xl overflow-hidden border border-border bg-muted/10">
                      {content[(section as any).imageKey] ? (
                        <img src={content[(section as any).imageKey]} alt="Tentang Kami" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-sm">
                          Belum ada gambar
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        ref={(el) => { (fileInputRefs.current as any)[(section as any).imageKey] = el }}
                        type="file" accept="image/*" className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          if (!validateFileSize(file)) {
                            toast.error('Ukuran file maksimal 5MB')
                            e.target.value = ''
                            return
                          }
                          startCrop(file, 'rect', 4 / 5, (url) => {
                            setContent((prev) => ({ ...prev, [(section as any).imageKey]: url }))
                          })
                        }}
                      />
                      <Button variant="outline" size="sm" className="gap-2" disabled={uploading} onClick={() => fileInputRefs.current[(section as any).imageKey]?.click()}>
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                        {uploading ? 'Mengupload...' : content[(section as any).imageKey] ? 'Ganti Gambar' : 'Upload Gambar'}
                      </Button>
                      {content[(section as any).imageKey] && (
                        <Button variant="ghost" size="sm" onClick={() => setContent((prev) => ({ ...prev, [(section as any).imageKey]: '' }))}>
                          Hapus
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 space-y-4">
                  {(section as any).hasImage && (
                    <div className="space-y-2">
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
                  <div className="space-y-4">
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

                  {(section as any).brands && (
                    <div className="pt-4 border-t border-border space-y-4">
                      <Label className="text-sm font-semibold">Hero & Deskripsi Tiap Brand</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(section as any).brands.map((brand: any) => (
                          <div key={brand.name} className="space-y-3 p-4 rounded-xl border border-border bg-muted/20">
                            <Label className="font-semibold" style={{ color: brand.color }}>{brand.name}</Label>

                            <div className="aspect-[4/5] rounded-xl overflow-hidden border border-border bg-muted/10">
                              {content[brand.imageKey] ? (
                                <img src={content[brand.imageKey]} alt={brand.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-sm">
                                  Belum ada gambar
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <input
                                ref={(el) => { (fileInputRefs.current as any)[brand.imageKey] = el }}
                                type="file" accept="image/*" className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (!file) return
                                  if (!validateFileSize(file)) {
                                    toast.error('Ukuran file maksimal 5MB')
                                    e.target.value = ''
                                    return
                                  }
                                  startCrop(file, 'rect', 4 / 5, (url) => {
                                    setContent((prev) => ({ ...prev, [brand.imageKey]: url }))
                                  })
                                }}
                              />
                              <Button variant="outline" size="sm" className="gap-2" disabled={uploading} onClick={() => fileInputRefs.current[brand.imageKey]?.click()}>
                                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                                {uploading ? 'Mengupload...' : content[brand.imageKey] ? 'Ganti' : 'Upload'}
                              </Button>
                              {content[brand.imageKey] && (
                                <Button variant="ghost" size="sm" onClick={() => setContent((prev) => ({ ...prev, [brand.imageKey]: '' }))}>
                                  Hapus
                                </Button>
                              )}
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Deskripsi</Label>
                              <RichEditor
                                value={content[brand.descKey] || ''}
                                onChange={(v) => setContent({ ...content, [brand.descKey]: v })}
                                placeholder="Deskripsi brand..."
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-border flex justify-end">
                <Button onClick={() => handleSaveSection(section)} disabled={savingSection === section.title} size="sm">
                  {savingSection === section.title ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </div>
          ))}
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

function FeatureCardsEditor({
  section,
  content,
  setContent,
}: {
  section: any
  content: Record<string, string>
  setContent: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) {
  const [openPicker, setOpenPicker] = useState<number | null>(null)

  const cards: Array<{ icon: string; title: string; desc: string }> = (() => {
    try { return JSON.parse(content['features_cards'] || '[]') }
    catch { return [] }
  })()

  const updateCard = (idx: number, field: string, value: string) => {
    const next = [...cards]
    while (next.length <= idx) next.push({ icon: '', title: '', desc: '' })
    next[idx] = { ...next[idx], [field]: value }
    setContent((prev) => ({ ...prev, features_cards: JSON.stringify(next) }))
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="space-y-4">
        {section.fields.map((field: any) => (
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

      <div className="pt-4 border-t border-border">
        <Label className="text-sm font-semibold">Kelola Card Fitur</Label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
          {[0, 1, 2, 3].map((idx) => {
            const card = cards[idx] || { icon: '', title: '', desc: '' }
            return (
              <div key={idx} className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                <Label>Card {idx + 1}</Label>

                <div className="space-y-1 relative">
                  <Label className="text-xs text-muted-foreground">Icon</Label>
                  <button
                    type="button"
                    onClick={() => setOpenPicker(openPicker === idx ? null : idx)}
                    className="flex items-center gap-2 h-9 w-full rounded-xl border border-border bg-white px-3 py-1 text-sm hover:bg-muted/50 transition-colors"
                  >
                    {card.icon && ICON_MAP[card.icon] ? (
                      <>
                        {React.createElement(ICON_MAP[card.icon], { className: 'w-4 h-4 shrink-0' })}
                        <span className="text-xs">{card.icon}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground text-xs">Pilih icon...</span>
                    )}
                  </button>
                  {openPicker === idx && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenPicker(null)} />
                      <div className="absolute top-full left-0 mt-1 z-50 w-64 p-2 rounded-xl border border-border bg-white shadow-lg grid grid-cols-4 gap-1">
                        {Object.entries(ICON_MAP).map(([name, Icon]) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => { updateCard(idx, 'icon', name); setOpenPicker(null) }}
                            className={`p-2 rounded-lg border transition-colors ${
                              card.icon === name ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border hover:bg-muted'
                            }`}
                            title={name}
                          >
                            <Icon className="w-4 h-4 mx-auto" />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Judul</Label>
                  <Input
                    value={card.title}
                    onChange={(e) => updateCard(idx, 'title', e.target.value)}
                    placeholder="Judul card..."
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Deskripsi</Label>
                  <textarea
                    className="flex w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                    rows={2}
                    value={card.desc}
                    onChange={(e) => updateCard(idx, 'desc', e.target.value)}
                    placeholder="Deskripsi card..."
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
