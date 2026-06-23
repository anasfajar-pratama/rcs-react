import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion'
import { toast } from 'sonner'

const contactInfo = [
  { icon: MapPin, label: 'Alamat', value: 'Jl. Kecantikan No. 123, Jakarta Selatan' },
  { icon: Phone, label: 'Telepon', value: '+62 812 3456 7890' },
  { icon: Mail, label: 'Email', value: 'hello@glowstudio.id' },
]

const faqs = [
  { q: 'Apakah produk Glow Studio aman?', a: 'Ya, semua produk kami telah teruji secara dermatologis dan menggunakan material food-grade yang aman untuk kulit.' },
  { q: 'Berapa lama garansi produk?', a: 'Setiap produk Glow Studio memiliki garansi 1 tahun untuk kerusakan produksi.' },
  { q: 'Bagaimana cara membersihkan alat?', a: 'Bersihkan dengan kain lembut dan alkohol 70% setelah pemakaian. Jangan merendam bagian elektronik.' },
  { q: 'Apakah ada toko fisik?', a: 'Saat ini kami melayani penjualan secara online. Namun kami akan segera membuka flagship store di beberapa kota besar.' },
  { q: 'Bagaimana cara pengembalian produk?', a: 'Hubungi customer service kami dalam 7 hari setelah penerimaan untuk pengembalian atau penukaran.' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Pesan berhasil dikirim! Kami akan menghubungi Anda segera.')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="pt-24 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Hubungi Kami</Badge>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">Kami Siap Membantu</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Punya pertanyaan atau butuh bantuan? Tim kami siap merespon dalam 1x24 jam.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  placeholder="Nama lengkap Anda"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@anda.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Pesan</Label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tulis pesan Anda di sini..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  className="flex w-full rounded-xl border border-border bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Send className="h-4 w-4" /> Kirim Pesan
              </Button>
            </form>
          </motion.div>

          {/* Info & FAQ */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="space-y-4">
              {contactInfo.map((info) => {
                const Icon = info.icon
                return (
                  <div key={info.label} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{info.label}</p>
                      <p className="font-medium text-sm">{info.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">Pertanyaan Umum</h3>
              <Accordion type="multiple" className="space-y-2">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={i.toString()} className="border border-border rounded-xl px-4">
                    <AccordionTrigger className="text-sm font-medium">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
