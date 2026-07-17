import { useEffect, useState } from 'react'
import { Plus, Edit3, Trash2, Star, Camera, X, Loader2, MessageSquare, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Switch } from '../../components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog'
import { Badge } from '../../components/ui/badge'
import { AdminLayout, AdminLoader } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'

interface Testimonial {
  id: number
  name: string
  content: string
  rating: string
  phone?: string
  email?: string
  avatarUrl?: string
  isActive: boolean
  isAdminCreated?: boolean
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', content: '', rating: '5', phone: '', email: '', avatarUrl: '', isActive: true })
  const [saving, setSaving] = useState(false)
  const [reviewPhoto, setReviewPhoto] = useState<string | null>(null)
  const [waReplyMessage, setWaReplyMessage] = useState('')

  const load = () => {
    setLoading(true)
    api.get('/admin/testimonials').then((res) => {
      setTestimonials(res.data || [])
    }).catch((err) => {
      console.error('Gagal muat testimoni:', err.response?.data || err.message)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', content: '', rating: '5', phone: '', email: '', avatarUrl: '', isActive: true })
    setModalOpen(true)
  }

  const openEdit = (t: Testimonial) => {
    setEditing(t)
    setForm({ name: t.name, content: t.content, rating: t.rating, phone: t.phone || '', email: t.email || '', avatarUrl: t.avatarUrl || '', isActive: t.isActive })
    setWaReplyMessage(defaultWaMessage(t.name))
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/admin/testimonials/${editing.id}`, form)
        toast.success('Testimoni diperbarui')
      } else {
        await api.post('/admin/testimonials', form)
        toast.success('Testimoni ditambahkan')
      }
      setModalOpen(false)
      load()
    } catch (err: any) {
      console.error('Testimonial save error:', err.response?.data || err.message)
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  const openReview = (url: string) => {
    setModalOpen(false)
    setTimeout(() => setReviewPhoto(url), 150)
  }

  const closeReview = () => {
    setReviewPhoto(null)
    setTimeout(() => setModalOpen(true), 150)
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/testimonials/${id}`)
      toast.success('Testimoni dihapus')
      load()
    } catch {
      toast.error('Gagal menghapus')
    }
  }

  const toggleActive = async (t: Testimonial) => {
    try {
      await api.put(`/admin/testimonials/${t.id}`, { isActive: !t.isActive })
      load()
    } catch (err: any) {
      console.error('Toggle active error:', err.response?.data || err.message)
      toast.error('Gagal mengubah status')
    }
  }

  const defaultWaMessage = (name: string) =>
    `Halo ${name}!

Terima kasih banyak telah meluangkan waktu untuk memberikan ulasan produk kami. Kami senang sekali mendengar pengalaman positifmu menggunakan produk Rindang Cemara Sukses! 😊

Semoga produk kami terus memberikan manfaat terbaik. Jangan ragu untuk menghubungi kami lagi jika ada pertanyaan atau perlu rekomendasi produk lainnya.

Salam hangat,
Tim Rindang Cemara Sukses 🌸`

  const formatText = (before: string, after: string) => {
    const el = document.getElementById('wa-reply-textarea') as HTMLTextAreaElement
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = waReplyMessage.substring(start, end) || 'teks'
    const next = waReplyMessage.substring(0, start) + before + selected + after + waReplyMessage.substring(end)
    setWaReplyMessage(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + before.length, start + before.length + selected.length)
    })
  }

  const handleSendWaReply = () => {
    let phone = form.phone.replace(/\D/g, '')
    if (phone.startsWith('0')) phone = '62' + phone.slice(1)
    if (!phone.startsWith('62')) phone = '62' + phone
    const text = encodeURIComponent(waReplyMessage)
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">Testimoni</h1>
            <p className="text-sm text-muted-foreground">{testimonials.length} total testimoni</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Testimoni
          </Button>
        </div>

        {loading ? (
          <AdminLoader />
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Belum ada testimoni</p>
            <Button onClick={openCreate}>Tambah Testimoni Pertama</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {testimonials.map((t) => (
              <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border">
                {t.avatarUrl && (
                  <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{t.name}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: Number(t.rating) }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                      ))}
                    </div>
                    <Badge variant={t.isActive ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                      {t.isActive ? 'Aktif' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{t.content}</p>
                  {(t.phone || t.email) && (
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                      {t.phone && <span>📞 {t.phone}</span>}
                      {t.email && <span>✉ {t.email}</span>}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Switch checked={t.isActive} onCheckedChange={() => toggleActive(t)} />
                  <Button variant="ghost" size="icon" onClick={() => openEdit(t)}>
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
                        <AlertDialogTitle>Hapus Testimoni</AlertDialogTitle>
                        <AlertDialogDescription>Yakin ingin menghapus testimoni dari {t.name}?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(t.id)} className="bg-destructive">Hapus</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center gap-3">
                  {editing ? 'Detail Testimoni' : 'Tambah Testimoni'}
                  {editing && (
                    <Badge variant={editing.isAdminCreated ? 'default' : 'secondary'} className="text-[10px] px-2 py-0.5 font-normal">
                      {editing.isAdminCreated ? 'oleh Admin' : 'oleh User'}
                    </Badge>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nama</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Testimoni</Label>
                <textarea
                  className="flex w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telepon</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+62" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@contoh.com" />
                </div>
              </div>
              <div className="space-y-2">
                    <Label>Foto</Label>
                <div className="flex items-center gap-3">
                  {form.avatarUrl ? (
                    <div className="relative group">
                      <img src={form.avatarUrl} alt="Foto" className="w-16 h-16 rounded-full object-cover border border-border" />
                      <button
                        type="button"
                        onClick={() => openReview(form.avatarUrl!)}
                        className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="text-white text-[10px] font-medium">Review</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border border-border">
                      <Camera className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                  )}
                  {form.avatarUrl && (
                    <Button variant="ghost" size="sm" onClick={() => openReview(form.avatarUrl!)}>
                      Review
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <Select value={form.rating} onValueChange={(v) => setForm({ ...form, rating: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['1', '2', '3', '4', '5'].map((r) => (
                        <SelectItem key={r} value={r}>{r} Bintang</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Aktif</Label>
                  <div className="flex items-center h-10">
                    <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
                  </div>
                </div>
              </div>
              {editing && form.phone && (
                <div className="space-y-2 pt-2 border-t border-border">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-4 w-4 text-primary" /> Balas via WhatsApp
                  </Label>
                  <div className="flex items-center gap-1 p-1.5 rounded-xl border border-border bg-muted/30">
                    <button
                      type="button" onClick={() => formatText('*', '*')}
                      className="w-8 h-8 rounded-lg text-sm font-bold hover:bg-white hover:shadow-sm transition-all"
                      title="Tebal"
                    >B</button>
                    <span className="w-px h-5 bg-border" />
                    <button
                      type="button" onClick={() => formatText('_', '_')}
                      className="w-8 h-8 rounded-lg text-sm italic font-serif hover:bg-white hover:shadow-sm transition-all"
                      title="Miring"
                    >I</button>
                    <span className="w-px h-5 bg-border" />
                    <button
                      type="button" onClick={() => formatText('~', '~')}
                      className="w-8 h-8 rounded-lg text-sm underline hover:bg-white hover:shadow-sm transition-all"
                      title="Coret"
                    >U</button>
                  </div>
                  <textarea
                    id="wa-reply-textarea"
                    className="flex w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none leading-relaxed"
                    rows={8}
                    value={waReplyMessage}
                    onChange={(e) => setWaReplyMessage(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSendWaReply} className="gap-2">
                      <Send className="h-4 w-4" /> Kirim via WhatsApp
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
                <Button onClick={handleSave} disabled={saving || !form.name || !form.content} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {saving ? 'Menyimpan...' : editing ? 'Simpan' : 'Tambah'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Review Photo Overlay */}
        {reviewPhoto && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
            onClick={closeReview}
          >
            <div className="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="relative flex items-center justify-center p-2 min-h-[50vh]">
                <span
                  onClick={closeReview}
                  className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 transition-colors cursor-pointer z-10"
                >
                  <X className="h-4 w-4" />
                </span>
                <img src={reviewPhoto} alt="Review" className="max-h-[70vh] w-auto rounded-lg object-contain" />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  )
}
