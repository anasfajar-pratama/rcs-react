import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, MessageCircle, Clock, Send, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion'
import { useSiteSettings } from '../hooks/use-site-settings'
import api from '../lib/api'
import { toast } from 'sonner'

export default function Contact() {
  const { settings } = useSiteSettings()
  const [form, setForm] = useState({ name: '', phone: '+62', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [faqs, setFaqs] = useState<{ id: number; question: string; answer: string }[]>([])
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [verifyDigits, setVerifyDigits] = useState<string[]>(['', '', '', ''])
  const [verifyError, setVerifyError] = useState('')
  const digitRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
    api.get('/faqs').then((res) => {
      setFaqs(res.data || [])
    }).catch(() => {
      console.warn('Gagal memuat FAQ — pastikan migrasi backend sudah dijalankan')
    })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.email || !form.message) {
      toast.error('Harap isi semua field')
      return
    }
    const last4 = form.phone.replace(/\D/g, '').slice(-4)
    if (last4.length < 4) {
      toast.error('Nomor HP tidak valid')
      return
    }
    setVerifyDigits(['', '', '', ''])
    setVerifyError('')
    setVerifyOpen(true)
    setTimeout(() => digitRefs.current[0]?.focus(), 100)
  }

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) return
    if (value && !/^\d$/.test(value)) return
    setVerifyError('')
    const next = [...verifyDigits]
    next[index] = value
    setVerifyDigits(next)
    if (value && index < 3) {
      digitRefs.current[index + 1]?.focus()
    }
  }

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verifyDigits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus()
    }
    if (e.key === 'Enter' && verifyDigits.every(d => d)) {
      handleVerifyConfirm()
    }
  }

  const handleVerifyConfirm = async () => {
    const last4 = form.phone.replace(/\D/g, '').slice(-4)
    if (verifyDigits.join('') !== last4) {
      setVerifyError('4 digit terakhir nomor HP tidak sesuai')
      return
    }
    setVerifyOpen(false)
    setSending(true)
    try {
      const res = await api.post('/contact-messages', form)
      setForm({ name: '', phone: '+62', email: '', message: '' })
      toast.success(res.data?.message || 'Pesan berhasil dikirim!')
    } catch {
      toast.error('Gagal mengirim pesan. Silakan coba lagi.')
    } finally {
      setSending(false)
    }
  }

  const contactEmail = settings.contact_email || 'hello@rindangcemarasukses.com'
  const contactPhone = settings.contact_phone || ''
  const contactAddress = settings.contact_address || ''
  const waNumber = settings.whatsapp_phone || ''
  const waMessage = encodeURIComponent('Halo, saya tertarik untuk mendalami produk Rindang Cemara Sukses.')

  const contactItems = [
    ...(contactAddress
      ? [{ icon: MapPin, label: 'Alamat', value: contactAddress }]
      : []),
    ...(contactPhone
      ? [{ icon: Phone, label: 'Telepon', value: contactPhone, href: `tel:${contactPhone}` }]
      : []),
    { icon: Mail, label: 'Email', value: contactEmail, href: `mailto:${contactEmail}` },
    ...(waNumber
      ? [{
          icon: MessageCircle,
          label: 'WhatsApp',
          value: waNumber,
          href: `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${waMessage}`,
          target: '_blank' as const,
        }]
      : []),
  ]

  const renderContactItem = (item: { icon: any; label: string; value: string; href?: string; target?: string }) => {
    const Icon = item.icon
    const content = (
      <div className="flex items-start gap-4 p-4 rounded-xl bg-background/60 border border-border hover:shadow-sm transition-shadow">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className="font-medium text-sm break-all">{item.value}</p>
        </div>
      </div>
    )

    if (item.href) {
      return (
        <a key={item.label} href={item.href} target={item.target || undefined} rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}>
          {content}
        </a>
      )
    }

    return <div key={item.label}>{content}</div>
  }

  return (
    <>
      {/* Header */}
      <section className="pt-24 pb-8 sm:pt-28 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Badge variant="outline" className="mb-4">Hubungi Kami</Badge>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">Kami Siap Membantu</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Punya pertanyaan atau butuh bantuan? Tim kami siap merespon dalam 1x24 jam.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Map + Contact Info */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {settings.contact_map_url && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="rounded-xl overflow-hidden h-full min-h-[300px]">
                  <iframe
                    src={settings.contact_map_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '300px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Toko"
                    className="w-full h-full"
                  />
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
              {contactItems.map(renderContactItem)}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-background/60 border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Jam Operasional</p>
                  <p className="font-medium text-sm">Sen - Jum: 08:00 - 17:00 WIB</p>
                  <p className="text-sm text-muted-foreground">Sabtu: 08:00 - 14:00 WIB</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Kirim Pesan */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-amber-50/40 to-rose-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="max-w-2xl mx-auto">
              <div className="border border-border rounded-2xl p-6 sm:p-8 bg-white shadow-sm">
                <h2 className="font-heading text-xl font-bold text-center mb-6">Kirim Pesan</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
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
                      <Label htmlFor="phone">No. HP</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+6281234567890"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                      />
                    </div>
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
                  <p className="text-xs text-muted-foreground text-center">
                    Pesan akan di balas paling lama 2x24 jam di hari kerja langsung ke nomor WhatsApp yang Anda inputkan.
                  </p>
                  <Button type="submit" className="w-full gap-2" disabled={sending}>
                    <Send className="h-4 w-4" /> {sending ? 'Mengirim...' : 'Kirim Pesan'}
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Verifikasi Modal */}
      <Dialog open={verifyOpen} onOpenChange={(open) => { setVerifyOpen(open); if (!open) setVerifyError('') }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Verifikasi
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Masukkan 4 digit terakhir nomor HP Anda
            </p>
            <div className="flex justify-center gap-3">
              {verifyDigits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { digitRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(i, e)}
                  className="w-12 h-14 text-center text-lg font-bold rounded-xl border border-border bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              ))}
            </div>
            {verifyError && (
              <p className="text-xs text-destructive text-center">{verifyError}</p>
            )}
            <Button
              className="w-full gap-2"
              disabled={verifyDigits.some(d => !d)}
              onClick={handleVerifyConfirm}
            >
              <ShieldCheck className="h-4 w-4" /> Konfirmasi
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-12 sm:py-16 bg-accent/[0.03]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="max-w-2xl mx-auto">
                <h2 className="font-heading text-xl font-bold text-center mb-6">Pertanyaan Umum</h2>
                <Accordion type="multiple" className="space-y-2">
                  {faqs.map((faq) => (
                    <AccordionItem key={faq.id} value={String(faq.id)} className="border border-border rounded-xl px-4 bg-white">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </>
  )
}
