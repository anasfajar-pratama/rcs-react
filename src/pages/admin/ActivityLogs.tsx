import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { AdminLayout } from './AdminLayout'
import api from '../../lib/api'
import type { ActivityLog } from '../../data/admin'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const actionLabels: Record<string, string> = {
  login: 'Login',
  create: 'Buat',
  update: 'Update',
  delete: 'Hapus',
}

const actionColors: Record<string, string> = {
  login: 'bg-blue-50 text-blue-600 border-blue-200',
  create: 'bg-green-50 text-green-600 border-green-200',
  update: 'bg-amber-50 text-amber-600 border-amber-200',
  delete: 'bg-red-50 text-red-600 border-red-200',
}

export default function AdminActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [filterAction, setFilterAction] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')

  const load = (p = 1) => {
    setLoading(true)
    const params = new URLSearchParams({ per_page: '30', page: String(p) })
    if (filterAction) params.set('action', filterAction)
    if (filterFrom) params.set('from', filterFrom)
    if (filterTo) params.set('to', filterTo)

    api.get(`/admin/activity-logs?${params}`).then((res) => {
      setLogs(res.data.data || [])
      setPage(res.data.current_page || 1)
      setLastPage(res.data.last_page || 1)
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleFilter = () => load(1)

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">Log Aktivitas</h1>
            <p className="text-sm text-muted-foreground">Riwayat aktivitas admin</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 p-4 rounded-xl bg-white border border-border">
          <div className="space-y-1">
            <Label className="text-xs">Aksi</Label>
            <Select value={filterAction} onValueChange={(v) => { setFilterAction(v); setTimeout(() => load(1), 0) }}>
              <SelectTrigger className="w-32"><SelectValue placeholder="Semua" /></SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Semua</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="create">Buat</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Hapus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Dari</Label>
            <Input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className="w-40" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Sampai</Label>
            <Input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className="w-40" />
          </div>
          <div className="flex items-end">
            <button onClick={handleFilter} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90">
              Filter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Memuat...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Belum ada aktivitas</div>
        ) : (
          <>
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${actionColors[log.action] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {actionLabels[log.action] || log.action}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{log.description || `${log.action} ${log.subject_type}`}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {log.admin?.name || log.admin?.username || 'System'} • {log.ip_address || '-'}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {log.created_at ? format(new Date(log.created_at), 'dd MMM yyyy HH:mm', { locale: id }) : '-'}
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => load(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-lg text-sm border border-border bg-white disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <span className="text-sm text-muted-foreground">{page} / {lastPage}</span>
                <button
                  onClick={() => load(page + 1)}
                  disabled={page >= lastPage}
                  className="px-3 py-1.5 rounded-lg text-sm border border-border bg-white disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </AdminLayout>
  )
}
