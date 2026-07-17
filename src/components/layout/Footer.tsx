import { Link } from 'wouter'
import { Instagram, Facebook, Twitter, Youtube, Music2, Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
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
    { label: 'TikTok', href: settings.social_tiktok || '#', icon: Music2 },
  ]

  const waNumber = settings.whatsapp_phone || ''
  const waMessage = encodeURIComponent('Halo, saya tertarik untuk mendalami produk Rindang Cemara Sukses.')
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : '#'

  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            {settings.site_logo ? (
              <img src={settings.site_logo} alt={siteName} className="h-8 w-auto mb-4 brightness-0 invert" />
            ) : (
              <h3 className="font-heading text-xl font-bold mb-4">
                {siteName.split(' ')[0]} <span className="text-primary">{siteName.split(' ').slice(1).join(' ')}</span>
              </h3>
            )}
            <p className="text-sm text-white/60 leading-relaxed">{siteDesc}</p>
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
            <h4 className="font-heading font-semibold text-sm mb-3 uppercase tracking-wider text-white/80">Menu</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-white/50 hover:text-primary transition-colors">Beranda</Link></li>
              <li><Link href="/contact" className="text-sm text-white/50 hover:text-primary transition-colors">Hubungi Kami</Link></li>
              <li><Link href="/about" className="text-sm text-white/50 hover:text-primary transition-colors">Tentang Kami</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-3 uppercase tracking-wider text-white/80">Kontak</h4>
            <ul className="space-y-2">
              {settings.contact_email && (
                <li>
                  <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-2 text-sm text-white/50 hover:text-primary transition-colors">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings.contact_phone && (
                <li>
                  <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-2 text-sm text-white/50 hover:text-primary transition-colors">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {waNumber && (
                <li>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/50 hover:text-green-400 transition-colors">
                    <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                    {waNumber}
                  </a>
                </li>
              )}
              {settings.contact_address && (
                <li className="flex items-start gap-2 text-sm text-white/50">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  {settings.contact_address}
                </li>
              )}
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
