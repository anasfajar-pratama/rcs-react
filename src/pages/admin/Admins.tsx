import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, Shield } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog'
import { AdminLayout, AdminLoader } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import type { AdminUser, Role } from '../../data/admin'

export default function AdminAdmins() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    username: '', name: '', email: '', password: '', is_active: true, role_ids: [] as number[],
  })

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get('/admin/admins').catch(() => ({ data: [] })),
      api.get('/admin/roles').catch(() => ({ data: [] })),
    ]).then(([adminsRes, rolesRes]) => {
      setAdmins(adminsRes.data || [])
      setRoles(rolesRes.data || [])
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ username: '', name: '', email: '', password: '', is_active: true, role_ids: [] })
    setModalOpen(true)
  }

  const openEdit = (a: AdminUser) => {
    setEditing(a)
    setForm({
      username: a.username, name: a.name || '', email: a.email || '',
      password: '', is_active: a.is_active, role_ids: a.roles.map((r) => r.id),
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.username) { toast.error('Username harus diisi'); return }
    if (!editing && !form.password) { toast.error('Password harus diisi'); return }

    const payload: any = {
      username: form.username,
      name: form.name || undefined,
      email: form.email || undefined,
      is_active: form.is_active,
      role_ids: form.role_ids,
    }
    if (form.password) payload.password = form.password

    try {
      if (editing) {
        await api.put(`/admin/admins/${editing.id}`, payload)
        toast.success('Admin berhasil diperbarui')
      } else {
        await api.post('/admin/admins', payload)
        toast.success('Admin berhasil ditambahkan')
      }
      setModalOpen(false)
      load()
    } catch {
      toast.error('Gagal menyimpan admin')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/admins/${id}`)
      toast.success('Admin berhasil dihapus')
      load()
    } catch {
      toast.error('Gagal menghapus admin')
    }
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">Admin</h1>
            <p className="text-sm text-muted-foreground">{admins.length} total admin</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Admin
          </Button>
        </div>

        {loading ? (
          <AdminLoader />
        ) : admins.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Belum ada admin</p>
            <Button onClick={openCreate}>Tambah Admin Pertama</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {admins.map((a) => (
              <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-heading font-bold text-primary text-sm">
                    {(a.name || a.username).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{a.name || a.username}</p>
                    {!a.is_active && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Nonaktif</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">@{a.username}{a.email ? ` • ${a.email}` : ''}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {a.roles.map((r) => (
                      <span key={r.id} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10">
                        {r.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(a)}>
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
                        <AlertDialogTitle>Hapus Admin</AlertDialogTitle>
                        <AlertDialogDescription>Yakin ingin menghapus {a.username}?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(a.id)} className="bg-destructive">Hapus</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Admin' : 'Tambah Admin'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Nama</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Password {editing ? '(kosongkan jika tidak diubah)' : ''}</Label>
                <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {roles.map((r) => (
                    <label key={r.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.role_ids.includes(r.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({ ...form, role_ids: [...form.role_ids, r.id] })
                          } else {
                            setForm({ ...form, role_ids: form.role_ids.filter((id) => id !== r.id) })
                          }
                        }}
                        className="rounded border-border"
                      />
                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                      {r.name}
                    </label>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-border" />
                Aktif
              </label>
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
