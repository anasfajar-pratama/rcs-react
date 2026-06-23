import { useEffect, useState } from 'react'
import { Plus, Edit3, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog'
import { AdminLayout } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import { fallbackSubcategories, type Subcategory } from '../../data/products'

const categories = ['Wanita', 'Pria', 'Anak']

export default function AdminSubcategories() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Subcategory | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', category: 'Wanita' })

  const load = () => {
    setLoading(true)
    api.get('/subcategories').then((res) => {
      setSubcategories(res.data || [])
    }).catch(() => {
      setSubcategories(fallbackSubcategories)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', slug: '', category: 'Wanita' })
    setModalOpen(true)
  }

  const openEdit = (s: Subcategory) => {
    setEditing(s)
    setForm({ name: s.name, slug: s.slug, category: s.category })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.slug) {
      toast.error('Nama dan slug harus diisi')
      return
    }
    try {
      if (editing) {
        await api.put(`/admin/subcategories/${editing.id}`, form)
        toast.success('Subkategori berhasil diperbarui')
      } else {
        await api.post('/admin/subcategories', form)
        toast.success('Subkategori berhasil ditambahkan')
      }
      setModalOpen(false)
      load()
    } catch {
      toast.error('Gagal menyimpan subkategori')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/subcategories/${id}`)
      toast.success('Subkategori berhasil dihapus')
      load()
    } catch {
      toast.error('Gagal menghapus subkategori')
    }
  }

  const grouped = categories.map((cat) => ({
    category: cat,
    items: subcategories.filter((s) => s.category === cat),
  }))

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">Subkategori</h1>
            <p className="text-sm text-muted-foreground">{subcategories.length} total subkategori</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Subkategori
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Memuat...</div>
        ) : (
          <div className="space-y-6">
            {grouped.map(({ category, items }) => (
              <div key={category}>
                <h3 className="font-heading font-semibold text-lg mb-3">{category}</h3>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground ml-1">Belum ada subkategori</p>
                ) : (
                  <div className="space-y-2">
                    {items.map((s) => (
                      <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl bg-white border border-border">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.slug}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Subkategori</AlertDialogTitle>
                                <AlertDialogDescription>Yakin ingin menghapus {s.name}?</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(s.id)} className="bg-destructive">Hapus</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Subkategori' : 'Tambah Subkategori'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nama</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Serum" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Contoh: serum" />
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
                <Button onClick={handleSave}>{editing ? 'Simpan' : 'Tambah'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AdminLayout>
  )
}
