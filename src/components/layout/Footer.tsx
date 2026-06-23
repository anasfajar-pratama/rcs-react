import { Link } from 'wouter'
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react'
import { useSiteSettings } from '../../hooks/use-site-settings'

export function Footer() {
  const { settings } = useSiteSettings()

  const siteName = settings.site_name || 'Rindang Cemara Sukses'
  const siteDesc = settings.site_description || 'Alat kecantikan premium dengan teknologi terkini untuk perawatan diri yang sempurna.'

  const socialLinks = [
    { label: 'Instagram', href: settings.social_instagram || '#', icon: Instagram },
    { label: 'Facebook', href: settings.social_facebook || '#', icon: Facebook },
    { label: 'Twitter', href: settings.social_twitter || '#', icon: Twitter },
    { label: 'Youtube', href: settings.social_youtube || '#', icon: Youtube },
  ]

  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            {settings.site_logo ? (
              <img src={settings.site_logo} alt={siteName} className="h-8 w-auto mb-4 brightness-0 invert" />
            ) : (
              <h3 className="font-heading text-xl font-bold mb-4">
                {siteName.split(' ')[0]} <span className="text-primary">{siteName.split(' ').slice(1).join(' ')}</span>
              </h3>
            )}
            <p className="text-sm text-white/60 leading-relaxed">{siteDesc}</p>
            {settings.contact_address && (
              <p className="text-sm text-white/40 mt-3 leading-relaxed">{settings.contact_address}</p>
            )}
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-3 uppercase tracking-wider text-white/80">Produk</h4>
            <ul className="space-y-2">
              {[{ label: 'BLISERA', href: '/brand/blisera' }, { label: 'FOKKA', href: '/brand/fokka' }, { label: 'PIJAR NALA', href: '/brand/pijar-nala' }].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-3 uppercase tracking-wider text-white/80">Kontak</h4>
            <ul className="space-y-2">
              {settings.contact_email && <li className="text-sm text-white/50">{settings.contact_email}</li>}
              {settings.contact_phone && <li className="text-sm text-white/50">{settings.contact_phone}</li>}
              <li><Link href="/contact" className="text-sm text-white/50 hover:text-primary transition-colors">Hubungi Kami</Link></li>
              <li><Link href="/about" className="text-sm text-white/50 hover:text-primary transition-colors">Tentang Kami</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-3 uppercase tracking-wider text-white/80">Ikuti Kami</h4>
            <div className="flex gap-3">
              {socialLinks.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label={s.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
