import { Link } from 'wouter'
import { Instagram, Facebook, Twitter, Youtube, Music2, Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react'
import { useSiteSettings } from '../../hooks/use-site-settings'

export function Footer() {
  const { settings } = useSiteSettings()

  const siteName = settings.site_name || 'Rindang Cemara Sukses'
  const siteDesc = settings.site_description || 'Alat kecantikan premium dengan teknologi terkini untuk perawatan diri yang sempurna.'

  const socialLinks = [
    { label: 'Instagram', href: settings.social_instagram || '#', icon: Instagram, hoverBg: '#E4405F' },
    { label: 'Facebook', href: settings.social_facebook || '#', icon: Facebook, hoverBg: '#1877F2' },
    { label: 'Twitter', href: settings.social_twitter || '#', icon: Twitter, hoverBg: '#1DA1F2' },
    { label: 'Youtube', href: settings.social_youtube || '#', icon: Youtube, hoverBg: '#FF0000' },
    { label: 'TikTok', href: settings.social_tiktok || '#', icon: Music2, hoverBg: '#25F4EE' },
  ]

  const waNumber = settings.whatsapp_phone || ''
  const waMessage = encodeURIComponent('Halo, saya tertarik untuk mendalami produk Rindang Cemara Sukses.')
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : '#'

  const brandProducts = [
    { label: 'BLISERA', href: '/brand/blisera' },
    { label: 'FOKKA', href: '/brand/fokka' },
    { label: 'PIJAR NALA', href: '/brand/pijar-nala' },
  ]

  return (
    <footer>
      {/* Decorative top gradient line */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="bg-foreground text-white relative overflow-hidden">
        {/* Subtle radial glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,165,116,0.12)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Main grid */}
          <div className="grid grid-cols-2 md:grid-cols-10 gap-8 md:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-3 text-center">
              {settings.site_logo ? (
                <div className="mb-4 flex justify-center">
                  <img src={settings.site_logo} alt={siteName} className="h-36 w-auto brightness-0 invert opacity-90" />
                </div>
              ) : (
                <h3 className="font-heading text-xl font-bold mb-4">
                  {siteName.split(' ')[0]} <span className="text-primary">{siteName.split(' ').slice(1).join(' ')}</span>
                </h3>
              )}
              <p className="text-sm text-white/50 leading-relaxed italic">&ldquo;{siteDesc}&rdquo;</p>
            </div>

            {/* Produk & Menu */}
            <div className="md:col-span-2">
              <h4 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wider text-white/70">Produk & Menu</h4>
              <ul className="space-y-3">
                {brandProducts.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm text-white/40 hover:text-primary transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3 mt-4 pt-4 border-t border-white/10">
                <li><Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm text-white/40 hover:text-primary transition-colors duration-200">Beranda</Link></li>
                <li><Link href="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm text-white/40 hover:text-primary transition-colors duration-200">Hubungi Kami</Link></li>
                <li><Link href="/about" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm text-white/40 hover:text-primary transition-colors duration-200">Tentang Kami</Link></li>
              </ul>
            </div>

            {/* Kontak */}
            <div className="md:col-span-3">
              <h4 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wider text-white/70">Kontak</h4>
              <ul className="space-y-3">
                {settings.contact_email && (
                  <li>
                    <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-2.5 text-sm text-white/40 hover:text-primary transition-colors duration-200 group">
                      <Mail className="h-4 w-4 shrink-0 text-white/20 group-hover:text-primary transition-colors duration-200" />
                      {settings.contact_email}
                    </a>
                  </li>
                )}
                {settings.contact_phone && (
                  <li>
                    <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-2.5 text-sm text-white/40 hover:text-primary transition-colors duration-200 group">
                      <Phone className="h-4 w-4 shrink-0 text-white/20 group-hover:text-primary transition-colors duration-200" />
                      {settings.contact_phone}
                    </a>
                  </li>
                )}
                {waNumber && (
                  <li>
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-white/40 hover:text-green-400 transition-colors duration-200 group">
                      <MessageCircle className="h-4 w-4 shrink-0 text-white/20 group-hover:text-green-400 transition-colors duration-200" />
                      {waNumber}
                    </a>
                  </li>
                )}
                {settings.contact_address && (
                  <li className="flex items-start gap-2.5 text-sm text-white/40">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-white/20" />
                    <span>{settings.contact_address}</span>
                  </li>
                )}
                <li className="flex items-start gap-2.5 text-sm text-white/30">
                  <Clock className="h-4 w-4 shrink-0 mt-0.5 text-white/20" />
                  <div>
                    <p>Sen - Jum: 08:00 - 17:00 WIB</p>
                    <p className="text-xs text-white/20 mt-0.5">Sabtu: 08:00 - 14:00 WIB</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="md:col-span-2">
              <h4 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wider text-white/70">Ikuti Kami</h4>
              <div className="flex gap-2.5 flex-wrap">
                {socialLinks.map((s) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = s.hoverBg }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '' }}
                      aria-label={s.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="mt-10 pt-6 border-t border-white/10">
            <p className="text-xs text-white/25 text-center">
              &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
