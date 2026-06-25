import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'wouter'
import { ArrowRight } from 'lucide-react'
import { useSiteSettings } from '../../hooks/use-site-settings'
import { BRANDS } from '../../data/brands'

const categories = [
  { key: 'Wanita', img: '/images/women-skincare.png' },
  { key: 'Pria', img: '/images/men-skincare.png' },
  { key: 'Anak', img: '/images/kids-skincare.png' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

export function CategoryBentoGrid() {
  const { settings } = useSiteSettings()
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className="grid grid-cols-1 gap-8 md:grid-cols-3"
    >
      {categories.map((cat) => {
        const brand = BRANDS[cat.key]
        const logo = settings[`logo_${brand.key}`]
        const hero = settings[`hero_image_${brand.key}`]
        const brandName = settings[`brand_${brand.key}_name`] || brand.name
        const hasHero = hero && !imgErrors[brand.key]
        const imgSrc = hasHero ? hero : cat.img

        return (
          <motion.div
            variants={fadeUp}
            key={cat.key}
            className="group relative cursor-pointer overflow-hidden bg-secondary"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={imgSrc}
                alt={brandName}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={() => setImgErrors((prev) => ({ ...prev, [brand.key]: true }))}
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 text-white">
              <div className="flex flex-col items-start gap-3">
                {logo ? (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-primary bg-white/10 p-2 backdrop-blur-sm">
                    <img src={logo} alt={brandName} className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-primary"
                    style={{ background: `${brand.color}30` }}
                  >
                    <span className="text-xl font-bold text-white">{brandName.charAt(0)}</span>
                  </div>
                )}
                <h3 className="font-serif text-3xl font-bold">{brandName}</h3>
              </div>
              <div>
                <div className="mb-3 h-0.5 w-12 bg-primary" />
                <p className="text-sm text-white/80">{brand.description}</p>
                <Link
                  href={`/brand/${brand.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <span className="text-sm font-semibold uppercase tracking-wider">Jelajahi Koleksi</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
