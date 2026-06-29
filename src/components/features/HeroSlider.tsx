import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'wouter'
import { ArrowRight, ImageIcon, Calendar, Sparkles, Tag } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useSiteSettings } from '../../hooks/use-site-settings'
import api from '../../lib/api'

interface HeroSlide {
  id: number
  type: 'brand' | 'product' | 'event'
  brand_key: string | null
  product_type: string | null
  theme: string
  title: string
  subtitle: string | null
  description: string | null
  button_text: string | null
  button_link: string | null
  hero_image: string | null
  logo: string | null
  logo_style: string
  label: string | null
  label_color: string | null
  event_date: string | null
  event_end_date: string | null
}

const THEME_COLORS: Record<string, { from: string; glow: string }> = {
  rose: { from: 'from-rose-500/20', glow: '#E8A0BF' },
  sky: { from: 'from-sky-400/20', glow: '#7DD3FC' },
  slate: { from: 'from-slate-800/20', glow: '#2C3E50' },
  amber: { from: 'from-amber-400/20', glow: '#FCD34D' },
  emerald: { from: 'from-emerald-400/20', glow: '#6EE7B7' },
}

const THEME_GRADIENTS: Record<string, string> = {
  rose: 'from-rose-400/20 to-pink-400/20',
  sky: 'from-sky-300/20 to-cyan-300/20',
  slate: 'from-slate-800/20 to-blue-900/20',
  amber: 'from-amber-300/20 to-orange-300/20',
  emerald: 'from-emerald-300/20 to-teal-300/20',
}

const BRAND_COLORS: Record<string, string> = {
  blisera: '#B76E79',
  fokka: '#4A5568',
  pijar_nala: '#C3E6FC',
}

const BRAND_LINKS: Record<string, string> = {
  blisera: '/brand/blisera',
  fokka: '/brand/fokka',
  pijar_nala: '/brand/pijar-nala',
}

export function HeroSlider() {
  const { settings } = useSiteSettings()
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({})
  const [heroErrors, setHeroErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    api.get('/heroes').then((res) => {
      if (res.data?.length) setSlides(res.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => { setMounted(true) }, [])

  const slide = slides[current]
  const themeColor = slide ? THEME_COLORS[slide.theme] || THEME_COLORS.rose : THEME_COLORS.rose
  const themeGradient = slide ? THEME_GRADIENTS[slide.theme] || THEME_GRADIENTS.rose : THEME_GRADIENTS.rose

  const heroUrl = slide?.hero_image || (slide?.brand_key ? settings[`hero_image_${slide.brand_key}`] : null)
  const logoUrl = slide?.logo || (slide?.brand_key ? settings[`logo_${slide.brand_key}`] : null)
  const logoStyle = slide?.logo_style || (slide?.brand_key ? settings[`logo_style_${slide.brand_key}`] : 'rounded')

  const showLogo = logoUrl && !logoErrors[`logo-${slide?.id}`]
  const showHero = heroUrl && !heroErrors[`hero-${slide?.id}`]
  const logoRounded = logoStyle === 'circle' ? 'rounded-full' : logoStyle === 'square' ? 'rounded-none' : 'rounded-lg'

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (!mounted || slides.length <= 1) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next, mounted, slides.length])

  const showSlider = !loading && slides.length > 0

  return (
    <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
      {showSlider ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${themeColor.from} via-background to-background`} />

              <div
                className="absolute inset-0 hidden md:block"
                style={{
                  maskImage: 'linear-gradient(100deg, transparent 15%, black 45%, black 100%)',
                  WebkitMaskImage: 'linear-gradient(100deg, transparent 15%, black 45%, black 100%)',
                }}
              >
                {showHero ? (
                  <img
                    src={heroUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    onError={() => setHeroErrors((prev) => ({ ...prev, [`hero-${slide.id}`]: true }))}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                    <ImageIcon className="h-20 w-20 text-primary/20" />
                  </div>
                )}
              </div>

              {showHero && (
                <div
                  className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full blur-3xl pointer-events-none hidden md:block"
                  style={{ background: `radial-gradient(circle, ${themeColor.glow}40, transparent 70%)` }}
                />
              )}
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
              <div className="max-w-lg bg-background/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl">
                {/* Label/Sash untuk product & event */}
                {(slide.type === 'product' || slide.type === 'event') && slide.label && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="mb-4"
                  >
                    <Badge
                      className="text-xs px-3 py-1 gap-1.5"
                      style={{
                        background: slide.label_color ? `${slide.label_color}20` : undefined,
                        color: slide.label_color || undefined,
                        borderColor: slide.label_color ? `${slide.label_color}40` : undefined,
                      }}
                    >
                      {slide.type === 'event' ? (
                        <Calendar className="h-3 w-3" />
                      ) : slide.product_type === 'featured' ? (
                        <Sparkles className="h-3 w-3" />
                      ) : (
                        <Tag className="h-3 w-3" />
                      )}
                      {slide.label}
                    </Badge>
                  </motion.div>
                )}

                {/* Brand + Logo untuk brand type */}
                {slide.type === 'brand' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex items-center gap-3 mb-4"
                  >
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
                      {slide.brand_key?.toUpperCase() || ''}
                    </span>
                    {showLogo && (
                      <div className="px-3 py-1 rounded-lg bg-white/70 backdrop-blur-sm shadow-sm">
                        <img
                          src={logoUrl}
                          alt="logo"
                          className={`h-8 w-auto ${logoRounded}`}
                          onError={() => setLogoErrors((prev) => ({ ...prev, [`logo-${slide.id}`]: true }))}
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Event date range */}
                {slide.type === 'event' && slide.event_date && (
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-xs text-muted-foreground mb-3"
                  >
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {new Date(slide.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {slide.event_end_date && ` - ${new Date(slide.event_end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                  </motion.p>
                )}

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance mb-3 drop-shadow-sm"
                  style={{ textShadow: '0 2px 8px hsl(var(--background) / 0.3)' }}
                >
                  {slide.title}
                </motion.h1>

                {slide.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-lg sm:text-xl font-medium text-primary mb-4 drop-shadow-sm"
                    style={{ textShadow: '0 1px 4px hsl(var(--background) / 0.3)' }}
                  >
                    {slide.subtitle}
                  </motion.p>
                )}

                {slide.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-base text-muted-foreground max-w-lg leading-relaxed mb-8"
                  >
                    {slide.description}
                  </motion.p>
                )}

                {slide.button_text && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <Link href={slide.button_link || (slide.brand_key ? BRAND_LINKS[slide.brand_key] : '/')}>
                      <Button size="lg" className="text-base gap-2">
                        {slide.button_text} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {slides.length > 1 && (
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
          )}
        </>
      ) : (
        /* Loading skeleton */
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="absolute inset-0 hidden md:block">
            <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
              <ImageIcon className="h-20 w-20 text-primary/10" />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
