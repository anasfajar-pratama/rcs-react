import { useEffect, useState } from 'react'
import { Plus, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { ImageCropperModal } from '../../components/ui/image-cropper-modal'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog'
import { Badge } from '../../components/ui/badge'
import { AdminLayout } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import { useImageUpload } from '../../hooks/use-image-upload'

interface GalleryItem {
  id: number
  imageUrl: string
  altText: string | null
  isActive: boolean
  sortOrder: string
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [form, setForm] = useState({ imageUrl: '', altText: '', isActive: true, sortOrder: '0' })

  const load = () => {
    setLoading(true)
    api.get('/admin/gallery').then((res) => {
      setItems(res.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCropResult = async (blob: Blob) => {
    setUploading(true)
    try {
      const { compressImage } = await import('../../lib/compress-image')
      const compressed = await compressImage(
        new File([blob], 'gallery.jpg', { type: 'image/jpeg' })
      )
      const fd = new FormData()
      fd.append('image', compressed)
      const res = await api.post('/admin/upload', fd)
      setForm({ ...form, imageUrl: res.data.imageUrl })
      toast.success('Gambar berhasil diupload')
    } catch {
      toast.error('Gagal upload gambar')
    } finally {
      setUploading(false)
      setCropFile(null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }
    setCropFile(file)
  }

  const handleSave = async () => {
    try {
      await api.post('/admin/gallery', form)
      toast.success('Gambar ditambahkan')
      setModalOpen(false)
      setForm({ imageUrl: '', altText: '', isActive: true, sortOrder: '0' })
      load()
    } catch {
      toast.error('Gagal menyimpan')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/gallery/${id}`)
      toast.success('Gambar dihapus')
      load()
    } catch {
      toast.error('Gagal menghapus')
    }
  }

  const toggleActive = async (item: GalleryItem) => {
    try {
      await api.put(`/admin/gallery/${item.id}`, { isActive: !item.isActive })
      load()
    } catch {
      toast.error('Gagal mengubah status')
    }
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">Galeri</h1>
            <p className="text-sm text-muted-foreground">{items.length} total gambar</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Gambar
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Memuat...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">Belum ada gambar</p>
            <Button onClick={() => setModalOpen(true)}>Tambah Gambar Pertama</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-border bg-muted/10">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.altText || ''}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => toggleActive(item)}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
                  >
                    {item.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Gambar</AlertDialogTitle>
                        <AlertDialogDescription>Yakin ingin menghapus gambar ini?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive">Hapus</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant={item.isActive ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                    {item.isActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Gambar</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Gambar</Label>
                <Input type="file" accept="image/*" onChange={handleFileSelect} disabled={uploading} />
                {uploading && <p className="text-xs text-muted-foreground">Mengupload...</p>}
              </div>
              {form.imageUrl && (
                <div className="aspect-video rounded-xl bg-muted/10 overflow-hidden border border-border">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-2">
                <Label>URL Gambar</Label>
                <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input value={form.altText} onChange={(e) => setForm({ ...form, altText: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Aktif</Label>
                  <div className="flex items-center h-10">
                    <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
                <Button onClick={handleSave} disabled={!form.imageUrl}>Tambah</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
      {cropFile && (
        <ImageCropperModal
          file={cropFile}
          cropShape="rect"
          aspectRatio={1}
          onCrop={handleCropResult}
          onCancel={() => setCropFile(null)}
        />
      )}
    </AdminLayout>
  )
}
