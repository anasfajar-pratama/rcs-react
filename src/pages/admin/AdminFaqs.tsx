import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, HelpCircle, Pencil, Trash2, ChevronUp, ChevronDown, Power } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch as Toggle } from '../../components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog'
import { AdminLayout, AdminLoader } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import type { Faq } from '../../data/admin'

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Faq | null>(null)
  const [form, setForm] = useState({ question: '', answer: '', is_active: true })

  const load = () => {
    setLoading(true)
    api.get('/admin/faqs').then((res) => {
      setFaqs(res.data || [])
    }).catch(() => {
      toast.error('Gagal memuat FAQ')
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ question: '', answer: '', is_active: true })
    setModal(true)
  }

  const openEdit = (faq: Faq) => {
    setEditing(faq)
    setForm({ question: faq.question, answer: faq.answer, is_active: faq.is_active })
    setModal(true)
  }

  const handleSave = async () => {
    if (!form.question || !form.answer) {
      toast.error('Harap isi pertanyaan dan jawaban')
      return
    }

    try {
      if (editing) {
        await api.put(`/admin/faqs/${editing.id}`, form)
        toast.success('FAQ diperbarui')
      } else {
        await api.post('/admin/faqs', form)
        toast.success('FAQ ditambahkan')
      }
      setModal(false)
      load()
    } catch {
      toast.error('Gagal menyimpan FAQ')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus FAQ ini?')) return
    try {
      await api.delete(`/admin/faqs/${id}`)
      setFaqs((prev) => prev.filter((f) => f.id !== id))
      toast.success('FAQ dihapus')
    } catch {
      toast.error('Gagal menghapus FAQ')
    }
  }

  const handleReorder = async (id: number, direction: 'up' | 'down') => {
    const idx = faqs.findIndex((f) => f.id === id)
    if (idx === -1) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= faqs.length) return

    const newFaqs = [...faqs]
    const temp = newFaqs[idx].sort_order
    newFaqs[idx].sort_order = newFaqs[swapIdx].sort_order
    newFaqs[swapIdx].sort_order = temp
    newFaqs[idx] = { ...newFaqs[idx] }
    newFaqs[swapIdx] = { ...newFaqs[swapIdx] }
    newFaqs.sort((a, b) => a.sort_order - b.sort_order)
    setFaqs(newFaqs)

    try {
      await api.post('/admin/faqs/reorder', {
        items: newFaqs.map((f, i) => ({ id: f.id, sort_order: i })),
      })
    } catch {
      toast.error('Gagal menyimpan urutan')
      load()
    }
  }

  const handleToggleActive = async (faq: Faq) => {
    try {
      await api.put(`/admin/faqs/${faq.id}`, { is_active: !faq.is_active })
      setFaqs((prev) => prev.map((f) => f.id === faq.id ? { ...f, is_active: !f.is_active } : f))
      toast.success(faq.is_active ? 'FAQ dinonaktifkan' : 'FAQ diaktifkan')
    } catch {
      toast.error('Gagal mengubah status FAQ')
    }
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">Kelola FAQ</h1>
            <p className="text-sm text-muted-foreground">Atur pertanyaan yang sering diajukan</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Tambah FAQ
          </Button>
        </div>

        {loading ? (
          <AdminLoader />
        ) : faqs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Belum ada FAQ</p>
            <Button variant="outline" className="mt-4" onClick={openCreate}>Tambah FAQ</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={faq.id} className="rounded-2xl border border-border bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground font-mono">#{faq.sort_order}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${faq.is_active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-red-700'}`}>
                        {faq.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm mb-1">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleReorder(faq.id, 'up')}
                      disabled={idx === 0}
                      className="w-8 h-8 rounded-lg bg-muted/20 text-muted-foreground hover:bg-muted/40 flex items-center justify-center transition-colors disabled:opacity-30"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleReorder(faq.id, 'down')}
                      disabled={idx === faqs.length - 1}
                      className="w-8 h-8 rounded-lg bg-muted/20 text-muted-foreground hover:bg-muted/40 flex items-center justify-center transition-colors disabled:opacity-30"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(faq)}
                      className="w-8 h-8 rounded-lg bg-muted/20 text-muted-foreground hover:bg-muted/40 flex items-center justify-center transition-colors"
                      title={faq.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      <Power className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => openEdit(faq)}
                      className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={modal} onOpenChange={setModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit FAQ' : 'Tambah FAQ'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Ubah pertanyaan dan jawaban FAQ' : 'Buat pertanyaan dan jawaban FAQ baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Pertanyaan</Label>
                <Input
                  id="question"
                  placeholder="Masukkan pertanyaan"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Jawaban</Label>
                <textarea
                  id="answer"
                  rows={4}
                  placeholder="Masukkan jawaban"
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  className="flex w-full rounded-xl border border-border bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <Toggle checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <span className="text-sm text-muted-foreground">{form.is_active ? 'Aktif' : 'Nonaktif'}</span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setModal(false)}>Batal</Button>
                <Button onClick={handleSave}>{editing ? 'Simpan' : 'Tambah'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AdminLayout>
  )
}
