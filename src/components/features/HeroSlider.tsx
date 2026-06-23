import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'wouter'
import { ArrowRight, ImageIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useSiteSettings } from '../../hooks/use-site-settings'

interface Slide {
  brand: string
  brandKey: string
  title: string
  subtitle: string
  tagline: string
  color: string
  cta: string
  gradient: string
  glowColor: string
}

const slides: Slide[] = [
  {
    brand: 'BLISERA',
    brandKey: 'blisera',
    title: 'Elegan & Mewah',
    subtitle: 'Untuk Wanita Modern',
    tagline: 'Rangkaian perawatan kulit premium dengan bahan alami terbaik untuk kecantikan yang bersinar.',
    color: 'from-rose-500/20',
    cta: 'Koleksi Wanita',
    gradient: 'from-rose-400/20 to-pink-400/20',
    glowColor: '#E8A0BF',
  },
  {
    brand: 'PIJAR NALA',
    brandKey: 'pijar_nala',
    title: 'Lembut & Aman',
    subtitle: 'Untuk Baby & Kids',
    tagline: 'Perawatan lembut dengan bahan alami yang aman untuk kulit si kecil.',
    color: 'from-yellow-400/20',
    cta: 'Koleksi Anak',
    gradient: 'from-yellow-300/20 to-green-300/20',
    glowColor: '#FFEAA7',
  },
  {
    brand: 'FOKKA',
    brandKey: 'fokka',
    title: 'Tegas & Percaya Diri',
    subtitle: 'Untuk Pria Tangguh',
    tagline: 'Perawatan pria modern yang praktis dan menyegarkan untuk aktivitas sehari-hari.',
    color: 'from-blue-900/20',
    cta: 'Koleksi Pria',
    gradient: 'from-blue-900/20 to-slate-800/20',
    glowColor: '#2C3E50',
  },
]

export function HeroSlider() {
  const { settings } = useSiteSettings()
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({})
  const [heroErrors, setHeroErrors] = useState<Record<string, boolean>>({})

  useEffect(() => { setMounted(true) }, [])

  const slide = slides[current]
  const logoUrl = settings[`logo_${slide.brandKey}`]
  const heroUrl = settings[`hero_image_${slide.brandKey}`]
  const showLogo = logoUrl && !logoErrors[slide.brandKey]
  const showHero = heroUrl && !heroErrors[slide.brandKey]

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next, mounted])

  return (
    <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} via-background to-background`} />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`slide-${current}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        >
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
                  {slide.brand}
                </span>
                {showLogo && (
                  <div className="px-3 py-1 rounded-lg bg-white/70 backdrop-blur-sm shadow-sm">
                    <img
                      src={logoUrl}
                      alt={`${slide.brand} logo`}
                      className={`h-8 w-auto ${settings[`logo_style_${slide.brandKey}`] === 'circle' ? 'rounded-full' : settings[`logo_style_${slide.brandKey}`] === 'square' ? 'rounded-none' : 'rounded-lg'}`}
                      onError={() => setLogoErrors((prev) => ({ ...prev, [slide.brandKey]: true }))}
                    />
                  </div>
                )}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance mb-3"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg sm:text-xl font-medium text-primary mb-4"
              >
                {slide.subtitle}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-base text-muted-foreground max-w-lg leading-relaxed mb-8"
              >
                {slide.tagline}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link href={`/brand/${slide.brandKey}`}>
                  <Button size="lg" className="text-base gap-2">
                    {slide.cta} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="hidden md:flex items-center justify-center relative"
            >
              <div className="relative w-full max-w-md aspect-square">
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-30"
                  style={{ background: `linear-gradient(135deg, ${slide.glowColor}, transparent)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10 pointer-events-none" />
                {showHero ? (
                  <img
                    src={heroUrl}
                    alt={slide.brand}
                    className="relative w-full h-full object-contain drop-shadow-2xl p-4 sm:p-8"
                    onError={() => setHeroErrors((prev) => ({ ...prev, [slide.brandKey]: true }))}
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-[2rem] bg-gradient-to-br from-primary/5 to-accent/5 border border-border/30 flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-primary/20" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-primary w-8' : 'bg-primary/30 hover:bg-primary/50'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
