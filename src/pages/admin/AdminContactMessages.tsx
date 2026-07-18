import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Inbox, MessageCircle, Trash2, MailOpen, Mail } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { AdminLayout, AdminLoader } from './AdminLayout'
import api from '../../lib/api'
import { toast } from 'sonner'
import type { ContactMessage } from '../../data/admin'

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const load = () => {
    setLoading(true)
    const params = filter === 'unread' ? '?is_read=0' : ''
    api.get(`/admin/contact-messages${params}`).then((res) => {
      setMessages(res.data || [])
    }).catch(() => {
      toast.error('Gagal memuat pesan')
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filter])

  const handleMarkRead = async (id: number) => {
    try {
      await api.patch(`/admin/contact-messages/${id}/read`)
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m))
    } catch {
      toast.error('Gagal menandai pesan')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus pesan ini?')) return
    try {
      await api.delete(`/admin/contact-messages/${id}`)
      setMessages((prev) => prev.filter((m) => m.id !== id))
      toast.success('Pesan dihapus')
    } catch {
      toast.error('Gagal menghapus pesan')
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">Pesan Masuk</h1>
            <p className="text-sm text-muted-foreground">Pesan dari pengunjung website</p>
          </div>
          <div className="flex gap-2">
            <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>
              <Mail className="h-4 w-4 mr-1.5" /> Semua
            </Button>
            <Button variant={filter === 'unread' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('unread')}>
              <MailOpen className="h-4 w-4 mr-1.5" /> Belum Dibaca
            </Button>
          </div>
        </div>

        {loading ? (
          <AdminLoader />
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Inbox className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Belum ada pesan masuk</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-2xl border border-border p-5 transition-colors ${!msg.is_read ? 'bg-primary/5 border-primary/20' : 'bg-white'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-medium text-sm">{msg.name}</span>
                      {!msg.is_read && (
                        <Badge variant="default" className="text-[10px] h-5">Baru</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                      <span>{msg.phone}</span>
                      <span>{msg.email}</span>
                      <span>{formatDate(msg.created_at)}</span>
                    </div>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
                      title="Balas via WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                    {!msg.is_read && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="w-9 h-9 rounded-xl bg-muted/30 text-muted-foreground hover:bg-muted/50 flex items-center justify-center transition-colors"
                        title="Tandai sudah dibaca"
                      >
                        <MailOpen className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  )
}
