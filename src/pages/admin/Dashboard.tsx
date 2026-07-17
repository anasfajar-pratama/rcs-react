import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import { motion } from 'framer-motion'
import { Package, MessageSquare, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/card'
import { AdminLayout } from './AdminLayout'
import api from '../../lib/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, testimonials: 0 })

  useEffect(() => {
    api.get('/admin/stats').then((res) => {
      setStats(res.data)
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Produk', value: stats.products, icon: Package, href: '/admin/products', color: 'text-primary bg-primary/10' },
    { label: 'Total Testimoni', value: stats.testimonials, icon: MessageSquare, href: '/admin/testimonials', color: 'text-accent bg-accent/10' },
  ]

  const managementCards = [
    { title: 'Produk', desc: 'Kelola semua produk', href: '/admin/products', icon: Package },
    { title: 'Homepage', desc: 'Edit konten homepage', href: '/admin/homepage', icon: Package },
    { title: 'Testimoni', desc: 'Kelola testimoni pelanggan', href: '/admin/testimonials', icon: MessageSquare },
    { title: 'Galeri & Berita', desc: 'Atur galeri gambar & berita', href: '/admin/gallery', icon: Package },
  ]

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.label} href={card.href}>
                <Card className="hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <p className="font-heading text-2xl font-bold">{card.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <h2 className="font-heading text-lg font-bold mb-4">Menu Kelola</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {managementCards.map((mc) => {
            const Icon = mc.icon
            return (
              <Link key={mc.title} href={mc.href}>
                <Card className="hover:shadow-md transition-all cursor-pointer h-full">
                  <CardContent className="p-6 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold">{mc.title}</h3>
                      <p className="text-sm text-muted-foreground">{mc.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold">Lihat Website</h3>
              <p className="text-sm text-muted-foreground">Lihat tampilan publik website Anda</p>
            </div>
            <a href="/" target="_blank">
              <ExternalLink className="h-5 w-5 text-primary" />
            </a>
          </CardContent>
        </Card>
      </motion.div>
    </AdminLayout>
  )
}
