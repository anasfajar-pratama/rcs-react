import { useEffect, useState, useRef } from 'react'
import { Link } from 'wouter'
import { ArrowRight, Sparkles, Shield, Leaf, Star, Gift, Clock, Trophy, MessageSquare, Camera, X, Loader2, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { ProductCard } from '../components/features/ProductCard'
import { HeroSlider } from '../components/features/HeroSlider'
import { CategoryBentoGrid } from '../components/features/CategoryBentoGrid'
import { ProductQuickView } from '../components/features/ProductQuickView'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import api from '../lib/api'
import { fallbackProducts, fallbackTestimonials, fallbackHomepageContent, type Product, type Testimonial } from '../data/products'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
}

const features = [
  { icon: Sparkles, title: 'Teknologi Terkini', desc: 'Inovasi terbaru untuk hasil maksimal' },
  { icon: Shield, title: 'Material Premium', desc: 'Bahan berkualitas tinggi, aman & tahan lama' },
  { icon: Leaf, title: 'Ramah Lingkungan', desc: 'Komitmen kami untuk bumi yang lebih hijau' },
  { icon: Star, title: 'Teruji Klinis', desc: 'Terbukti aman dan efektif secara ilmiah' },
]

export default function Home() {
  const [pageLoading, setPageLoading] = useState(true)
  const [testimonialEnabled, setTestimonialEnabled] = useState(false)
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials)
  const [content, setContent] = useState(fallbackHomepageContent)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formData, setFormData] = useState({ name: '', content: '', rating: '5', phone: '', email: '' })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [liveFaceDetected, setLiveFaceDetected] = useState(false)
  const [camReady, setCamReady] = useState(false)
  const [faceDetecting, setFaceDetecting] = useState(false)
  const [faceVerified, setFaceVerified] = useState(false)
  const [adminWhatsApp, setAdminWhatsApp] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    Promise.all([
      api.get('/heroes').catch(() => {}),
      api.get('/products').then((res) => {
        if (res.data?.length) setProducts(res.data)
      }),
      api.get('/testimonials').then((res) => {
        if (res.data?.length) setTestimonials(res.data)
      }),
      api.get('/homepage-content').then((res) => {
        if (res.data) setContent((prev) => ({ ...prev, ...res.data }))
      }),
      api.get('/settings').then((res) => {
        if (res.data) {
          setTestimonialEnabled(res.data.testimonial_enabled === '1')
          if (res.data.whatsapp_phone) setAdminWhatsApp(res.data.whatsapp_phone)
        }
      }),
    ]).catch(() => {}).finally(() => setPageLoading(false))
  }, [])

  const promoProducts = products.filter((p) => p.isPromo).slice(0, 4)
  const newProducts = products.filter((p) => p.isNew).slice(0, 4)
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4)

  const startCamera = async () => {
    setPhotoError(null)
    setPhotoPreview(null)
    setPhotoFile(null)
    setLiveFaceDetected(false)
    setCamReady(false)
    setFaceVerified(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      })
      setCameraStream(stream)
      setShowCamera(true)
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream
      }, 100)
    } catch {
      setPhotoError('Gagal mengakses kamera. Pastikan izin kamera diberikan.')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop())
      setCameraStream(null)
    }
    setShowCamera(false)
    setCamReady(false)
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)

    canvas.toBlob(async (blob) => {
      if (!blob) return
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
      const preview = URL.createObjectURL(blob)
      setPhotoPreview(preview)
      setPhotoFile(file)
      setFaceDetecting(true)
      stopCamera()

      try {
        const faceapi = await import('@vladmandic/face-api')
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
        const result = await faceapi.tinyFaceDetector(canvas, new faceapi.TinyFaceDetectorOptions())
        const detections = Array.isArray(result) ? result : (result as any)?.detections || []
        if (detections.length > 0 && detections[0].score > 0.5) {
          setFaceVerified(true)
        } else {
          setPhotoError('Wajah tidak terdeteksi. Ambil ulang foto.')
        }
      } catch {
        setPhotoError('Gagal memproses foto. Ambil ulang.')
      } finally {
        setFaceDetecting(false)
      }
    }, 'image/jpeg', 0.9)
  }

  // Live face detection while camera is active
  useEffect(() => {
    if (!showCamera) {
      setLiveFaceDetected(false)
      setCamReady(false)
      return
    }
    const readyTimer = setTimeout(() => setCamReady(true), 600)
    return () => clearTimeout(readyTimer)
  }, [showCamera])

  useEffect(() => {
    if (!camReady) return
    let cancelled = false
    const detect = async () => {
      const video = videoRef.current
      if (!video) return
      try {
        const faceapi = await import('@vladmandic/face-api')
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
        if (cancelled) return
        const result = await faceapi.tinyFaceDetector(video, new faceapi.TinyFaceDetectorOptions())
        if (cancelled) return
        const detections = Array.isArray(result) ? result : (result as any)?.detections || []
        setLiveFaceDetected(detections.length > 0 && detections[0].score > 0.5)
      } catch {
        if (!cancelled) setLiveFaceDetected(false)
      }
      if (!cancelled) setTimeout(detect, 2000)
    }
    detect()
    return () => { cancelled = true }
  }, [camReady])

  const handleSubmitTestimonial = async () => {
    if (!formData.name || !formData.content) return
    setSubmitting(true)
    try {
      const payload = new FormData()
      payload.append('name', formData.name)
      payload.append('content', formData.content)
      payload.append('rating', formData.rating)
      if (formData.phone) payload.append('phone', formData.phone)
      if (formData.email) payload.append('email', formData.email)
      if (photoFile) payload.append('photo', photoFile)

      await api.post('/testimonials', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setSubmitSuccess(true)

      if (adminWhatsApp) {
        const stars = '⭐'.repeat(Number(formData.rating))
        const now = new Date().toLocaleDateString('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
        const lines = [
          'Halo Kak Admin Rindang Cemara Sukses! 🌸',
          '',
          'Aku mau berbagi cerita manis buat kita nih:',
          '',
          '*Nama:* ' + formData.name,
          '*Rating:* ' + stars,
          '"' + formData.content + '"',
        ]
        if (formData.phone) lines.push('', '*Kontak:* ' + formData.phone)
        lines.push('', '*Waktu:* ' + now)
        lines.push('', 'Terima kasih ya, Kak! 💖')

        const text = encodeURIComponent(lines.join('\n'))
        window.open(`https://wa.me/${adminWhatsApp}?text=${text}`, '_blank')
      }

      setTimeout(() => {
        setShowForm(false)
        setSubmitSuccess(false)
        setFormData({ name: '', content: '', rating: '5', phone: '', email: '' })
        setPhotoFile(null)
        setPhotoPreview(null)
        setPhotoError(null)
        setFaceVerified(false)
      }, 2500)
    } catch {
      setPhotoError('Gagal mengirim testimoni. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    stopCamera()
    setShowForm(false)
    setSubmitSuccess(false)
    setFormData({ name: '', content: '', rating: '5', phone: '', email: '' })
    setPhotoFile(null)
    setPhotoPreview(null)
    setPhotoError(null)
    setFaceVerified(false)
  }

  const pageLogoSrc = 'http://localhost:8000/storage/uploads/251cf1fd-1a6b-42c4-8bc9-8e2972c54a88.webp'

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <img src={pageLogoSrc} alt="Logo" className="h-14 w-auto mx-auto animate-pulse" />
          <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Category Bento Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">{content.section_kategori_title || 'Koleksi Berdasarkan Kategori'}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {content.section_kategori_subtitle || 'Temukan alat kecantikan yang sesuai dengan kebutuhanmu'}
            </p>
          </motion.div>
          <CategoryBentoGrid />
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 sm:py-20 bg-gradient-to-r from-amber-50/40 to-rose-50/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-10">
              <Badge variant="default" className="mb-4 px-4 py-1.5">
                <Trophy className="h-3.5 w-3.5 mr-1.5" /> Produk Unggulan
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-2">{content.section_unggulan_title || 'Pilihan Terbaik Kami'}</h2>
              <p className="text-muted-foreground">{content.section_unggulan_subtitle || 'Rekomendasi produk terbaik yang wajib kamu coba'}</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product, i) => {
                const rank = i < 4 ? i + 1 : undefined
                const prices = [
                  { price: 149000, original: 179000, rating: 4.8, sold: 1240 },
                  { price: 179000, original: 219000, rating: 4.6, sold: 890 },
                  { price: 129000, original: 159000, rating: 4.7, sold: 560 },
                  { price: 79000, original: 119000, rating: 4.9, sold: 2100 },
                ]
                const fallback = prices[Math.min(i, prices.length - 1)]
                const productWithHardcoded = {
                  ...product,
                  price: Number(product.price) || fallback.price,
                  originalPrice: Number(product.originalPrice) || fallback.original,
                  rating: Number(product.rating) || fallback.rating,
                  soldCount: Number(product.soldCount) || fallback.sold,
                }
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <ProductCard product={productWithHardcoded} rank={rank} onQuickView={setQuickViewProduct} />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Promo Section */}
      {promoProducts.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-10">
              <Badge variant="default" className="mb-4 px-4 py-1.5">
                <Gift className="h-3.5 w-3.5 mr-1.5" /> Promo Spesial
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-2">{content.section_promo_title || 'Penawaran Terbatas'}</h2>
              <p className="text-muted-foreground">{content.section_promo_subtitle || 'Dapatkan produk favorit dengan harga spesial sebelum kehabisan!'}</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {promoProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <ProductCard product={product} onQuickView={setQuickViewProduct} showPromoBadge />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newcomer Section */}
      {newProducts.length > 0 && (
        <section className="py-16 sm:py-20 bg-gradient-to-r from-rose-50/80 to-amber-50/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-10">
              <Badge variant="accent" className="mb-3">
                <Clock className="h-3.5 w-3.5 mr-1.5" /> Baru Datang
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-2">{content.section_terbaru_title || 'Produk Terbaru'}</h2>
              <p className="text-muted-foreground">{content.section_terbaru_subtitle || 'Kenalan dengan produk-produk baru kami'}</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <ProductCard product={product} onQuickView={setQuickViewProduct} showNewBadge />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features / Why Us */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">{content.section_features_title || 'Mengapa Produk Kami?'}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {content.section_features_subtitle || 'Kami berkomitmen menghadirkan yang terbaik untuk kecantikan Anda'}
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Card className="text-center p-6 h-full">
                    <CardContent className="p-0 space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/[0.03] to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-accent/[0.03] to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div {...fadeUp} className="relative">
              <div className="absolute -top-6 -left-6 text-[10rem] sm:text-[12rem] font-heading font-bold text-primary/[0.04] leading-none select-none pointer-events-none">
                {content.about_title?.charAt(0) || 'I'}
              </div>
              <Badge variant="outline" className="mb-6 tracking-[0.15em] text-[11px] uppercase px-4 py-1.5 rounded-full border-primary/20 text-primary">
                Tentang Kami
              </Badge>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-8 text-balance">
                {content.about_title || 'Inovasi untuk Kecantikan'}
              </h2>
              <div className="w-12 h-0.5 bg-primary/30 mb-8" />
              <div className="text-muted-foreground leading-[1.9] text-[15px] sm:text-[16px] mb-10 text-justify [&_p]:mb-4" dangerouslySetInnerHTML={{ __html: content.about_text || 'Rindang Cemara Sukses menghadirkan alat kecantikan berkualitas tinggi yang menggabungkan teknologi modern dengan desain elegan.' }} />
              {content.about_quote && (
                <blockquote className="relative pl-10 italic text-foreground/70 font-heading font-medium text-lg sm:text-xl leading-relaxed">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-px bg-primary/40" />
                  <span className="text-primary/50 text-2xl mr-1 font-serif">&ldquo;</span>
                  {content.about_quote}
                  <span className="text-primary/50 text-2xl ml-1 font-serif">&rdquo;</span>
                </blockquote>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-[2.5rem] blur-2xl" />
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                {content.about_image ? (
                  <img src={content.about_image} alt="Tentang Rindang Cemara Sukses" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/[0.04] to-accent/[0.04] flex items-center justify-center">
                    <span className="font-heading text-7xl sm:text-8xl font-bold text-primary/[0.08] tracking-tight">
                      RCS
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-primary/10 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 border-2 border-accent/10 rounded-full -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonialEnabled && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">{content.section_testimonials_title || 'Apa Kata Mereka'}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {content.section_testimonials_subtitle || 'Testimoni dari pelanggan setia Rindang Cemara Sukses'}
              </p>
            </motion.div>
            {testimonials.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {testimonials.slice(0, 8).map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex gap-0.5">
                          {Array.from({ length: Number(t.rating) }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">"{t.content}"</p>
                        <p className="text-sm font-semibold">— {t.name}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Button variant="outline" size="lg" className="gap-2 rounded-full" onClick={() => setShowForm(true)}>
                <MessageSquare className="h-4 w-4" />
                Tulis Testimoni
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimoni Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) resetForm() }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {submitSuccess ? (
                <div className="p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-primary fill-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-2">Terima Kasih!</h3>
                  <p className="text-sm text-muted-foreground">Testimoni Anda akan ditinjau oleh admin sebelum ditampilkan.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
                    <h3 className="font-heading text-lg font-bold">Tulis Testimoni</h3>
                    <button type="button" onClick={resetForm} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Rating */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Rating</Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, rating: String(star) }))}
                            className={`p-1 rounded-lg transition-all ${Number(formData.rating) >= star ? 'text-primary scale-110' : 'text-muted-foreground/30 hover:text-muted-foreground/60'}`}
                          >
                            <Star className={`h-7 w-7 ${Number(formData.rating) >= star ? 'fill-primary' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Testimoni */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Testimoni</Label>
                      <textarea
                        className="flex w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                        rows={4} placeholder="Ceritakan pengalaman Anda..."
                        value={formData.content}
                        onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                      />
                    </div>

                    {/* Nama */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Nama</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Nama Anda"
                      />
                    </div>

                    {/* Telepon & Email */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Telepon</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="+62"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Email</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="email@contoh.com"
                        />
                      </div>
                    </div>

                    {/* Foto */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Foto Verifikasi</Label>
                      <p className="text-xs text-muted-foreground">Ambil foto diri anda plus produk . Foto harus memperlihatkan wajah dan produk dengan jelas.</p>

                      <canvas ref={canvasRef} className="hidden" />

                      {showCamera ? (
                        <div className="rounded-xl border border-border overflow-hidden bg-black relative">
                          <div className="relative w-full h-64">
                            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                            <div
                              className="absolute inset-0 z-10"
                              style={{
                                background: `radial-gradient(ellipse 180px 240px at 50% 50%, transparent 48%, ${
                                  liveFaceDetected ? 'rgba(34,197,94,0.45)' : 'rgba(239,68,68,0.55)'
                                } 50%)`,
                              }}
                            />
                            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                              <div className="w-[180px] h-[240px] rounded-full border-2 border-dashed border-white/40"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-3 p-3 bg-black/60">
                            <Button size="sm" variant="secondary" onClick={stopCamera} className="gap-2">
                              <X className="h-4 w-4" /> Tutup
                            </Button>
                            <Button size="sm" onClick={capturePhoto} className="gap-2">
                              <Camera className="h-4 w-4" /> Ambil Foto
                            </Button>
                          </div>
                        </div>
                      ) : photoPreview ? (
                        <div className="relative rounded-xl border border-border overflow-hidden">
                          <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
                          {faceDetecting && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Loader2 className="h-8 w-8 animate-spin text-white" />
                            </div>
                          )}
                          {faceVerified && (
                            <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Wajah terverifikasi
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => { setPhotoFile(null); setPhotoPreview(null); setPhotoError(null); setFaceVerified(false) }}
                            className="absolute bottom-2 right-2 bg-black/50 text-white p-1.5 rounded-lg hover:bg-black/70 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="flex flex-col items-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/40 transition-colors"
                          onClick={startCamera}
                        >
                          <Camera className="h-8 w-8 text-muted-foreground/50" />
                          <span className="text-sm text-muted-foreground">Klik untuk buka kamera</span>
                        </div>
                      )}

                      {!faceVerified && !showCamera && photoFile && (
                        <Button variant="outline" size="sm" onClick={startCamera} className="gap-2">
                          <Camera className="h-4 w-4" /> Ambil Ulang
                        </Button>
                      )}

                      {photoError && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <X className="h-3 w-3" /> {photoError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-border">
                    <Button variant="outline" onClick={resetForm}>Batal</Button>
                    <Button
                      onClick={handleSubmitTestimonial}
                      disabled={submitting || !formData.name || !formData.content || showCamera || faceDetecting || (photoFile !== null && !faceVerified)}
                      className="gap-2"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                      {submitting ? 'Mengirim...' : 'Kirim Testimoni'}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Newsletter */}
      {/* <section className="py-16 sm:py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3">
              {content.newsletter_title || 'Dapatkan Update Terbaru'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {content.newsletter_subtitle || 'Berlangganan untuk info produk baru dan penawaran eksklusif.'}
            </p>
            <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 h-12 px-4 rounded-xl border border-border bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-sm"
              />
              <Button type="submit" size="lg">Subscribe</Button>
            </form>
          </motion.div>
        </div>
      </section> */}

      {quickViewProduct && (
        <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  )
}
