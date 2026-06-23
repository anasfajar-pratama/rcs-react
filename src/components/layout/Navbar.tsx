import { Link, useLocation } from 'wouter'
import { Heart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { useWishlist } from '../../hooks/use-wishlist'
import { useSiteSettings } from '../../hooks/use-site-settings'
import { cn } from '../../lib/utils'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/brand/blisera', label: 'BLISERA' },
  { href: '/brand/fokka', label: 'FOKKA' },
  { href: '/brand/pijar-nala', label: 'PIJAR NALA' },
  { href: '/about', label: 'Tentang' },
  { href: '/contact', label: 'Kontak' },
]

export function Navbar() {
  const [location] = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const { items } = useWishlist()
  const { settings } = useSiteSettings()

  const siteName = settings.site_name || 'Rindang Cemara Sukses'
  const brandFirst = siteName.split(' ')[0] || 'Rindang'
  const brandRest = siteName.split(' ').slice(1).join(' ')

  const showLogo = settings.site_logo && !logoError

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-solid border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-3">
            {showLogo && <img src={settings.site_logo} alt={siteName} className="h-8 w-auto" onError={() => setLogoError(true)} />}
            <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {brandFirst}{brandRest ? <span className="text-primary"> {brandRest}</span> : ''}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  location === link.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/wishlist" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className={cn('h-5 w-5', items.length > 0 ? 'fill-primary text-primary' : '')} />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block text-sm font-medium transition-colors hover:text-primary',
                  location === link.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
