import { Link } from 'wouter'
import { useSiteSettings } from '../../hooks/use-site-settings'
import { BRANDS } from '../../data/brands'

const categories = [
  { key: 'Wanita', size: 'lg' as const },
  { key: 'Pria', size: 'sm' as const },
  { key: 'Anak', size: 'sm' as const },
]

export function CategoryBentoGrid() {
  const { settings } = useSiteSettings()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {categories.map((cat) => {
        const brand = BRANDS[cat.key]
        const isLarge = cat.size === 'lg'
        const logo = settings[`logo_${brand.key}`]
        const brandName = settings[`brand_${brand.key}_name`] || brand.name

        return (
          <Link
            key={cat.key}
            href={`/brand/${brand.slug}`}
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isLarge ? 'md:col-span-2 md:row-span-2 md:p-10' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${brand.colorLight} 0%, white 60%, ${brand.colorLight}40 100%)`,
              borderColor: `${brand.color}20`,
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(ellipse at top right, ${brand.color}15 0%, transparent 70%)`,
              }}
            />
            <div className="relative z-10 p-6 sm:p-8">
              {logo ? (
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <img
                    src={logo}
                    alt={brandName}
                    className={`max-w-full max-h-full object-contain ${
                      settings[`logo_style_${brand.key}`] === 'circle'
                        ? 'rounded-full'
                        : settings[`logo_style_${brand.key}`] === 'square'
                          ? 'rounded-none'
                          : 'rounded-xl'
                    }`}
                  />
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${brand.color}20` }}
                >
                  <span className="font-heading font-bold text-lg" style={{ color: brand.color }}>
                    {brandName.charAt(0)}
                  </span>
                </div>
              )}
              <h3
                className={`font-heading font-bold mb-2 ${isLarge ? 'text-2xl' : 'text-lg'}`}
                style={{ color: brand.colorDark }}
              >
                {brandName}
              </h3>
              <p className={`text-muted-foreground ${isLarge ? 'text-base' : 'text-sm'}`}>
                {brand.description}
              </p>
              <div
                className={`mt-4 text-sm font-medium transition-all flex items-center gap-2 group-hover:gap-3 ${isLarge ? 'text-base' : ''}`}
                style={{ color: brand.color }}
              >
                Jelajahi Koleksi
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
