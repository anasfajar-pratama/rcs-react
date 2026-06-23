import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, Shield } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog'
import { AdminLayout } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import type { Role, Permission } from '../../data/admin'

export default function AdminRoles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Role | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', description: '', permission_ids: [] as number[] })

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get('/admin/roles').catch(() => ({ data: [] })),
      api.get('/admin/permissions').catch(() => ({ data: {} })),
    ]).then(([rolesRes, permsRes]) => {
      setRoles(rolesRes.data || [])
      setPermissions(permsRes.data || {})
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', slug: '', description: '', permission_ids: [] })
    setModalOpen(true)
  }

  const openEdit = (r: Role) => {
    setEditing(r)
    setForm({
      name: r.name, slug: r.slug, description: r.description || '',
      permission_ids: r.permissions.map((p) => p.id),
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.slug) { toast.error('Nama dan slug harus diisi'); return }
    try {
      const payload = { ...form }
      if (editing) {
        await api.put(`/admin/roles/${editing.id}`, payload)
        toast.success('Role berhasil diperbarui')
      } else {
        await api.post('/admin/roles', payload)
        toast.success('Role berhasil ditambahkan')
      }
      setModalOpen(false)
      load()
    } catch {
      toast.error('Gagal menyimpan role')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/roles/${id}`)
      toast.success('Role berhasil dihapus')
      load()
    } catch {
      toast.error('Gagal menghapus role')
    }
  }

  const togglePermission = (permId: number) => {
    setForm((prev) => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permId)
        ? prev.permission_ids.filter((id) => id !== permId)
        : [...prev.permission_ids, permId],
    }))
  }

  const selectGroup = (group: string, permIds: number[], select: boolean) => {
    setForm((prev) => ({
      ...prev,
      permission_ids: select
        ? [...new Set([...prev.permission_ids, ...permIds])]
        : prev.permission_ids.filter((id) => !permIds.includes(id)),
    }))
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">Roles & Permissions</h1>
            <p className="text-sm text-muted-foreground">{roles.length} total role</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Role
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Memuat...</div>
        ) : roles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Belum ada role</p>
            <Button onClick={openCreate}>Tambah Role Pertama</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {roles.map((r) => (
              <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.slug}{r.description ? ` — ${r.description}` : ''}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{r.permissions?.length || 0} permissions</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  {r.slug !== 'super-admin' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Role</AlertDialogTitle>
                          <AlertDialogDescription>Yakin ingin menghapus role {r.name}?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(r.id)} className="bg-destructive">Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Role' : 'Tambah Role'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Role</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Editor" />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Contoh: editor" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div>
                <Label>Permissions</Label>
                <div className="mt-3 space-y-4 max-h-80 overflow-y-auto">
                  {Object.entries(permissions).map(([group, perms]) => {
                    const groupPermIds = perms.map((p) => p.id)
                    const allSelected = groupPermIds.every((id) => form.permission_ids.includes(id))
                    const someSelected = groupPermIds.some((id) => form.permission_ids.includes(id))
                    return (
                      <div key={group} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected }}
                            onChange={(e) => selectGroup(group, groupPermIds, e.target.checked)}
                            className="rounded border-border"
                          />
                          <span className="text-sm font-medium capitalize">{group.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 ml-5">
                          {perms.map((p) => (
                            <label key={p.id} className="flex items-center gap-2 text-xs cursor-pointer py-0.5">
                              <input
                                type="checkbox"
                                checked={form.permission_ids.includes(p.id)}
                                onChange={() => togglePermission(p.id)}
                                className="rounded border-border"
                              />
                              {p.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
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
