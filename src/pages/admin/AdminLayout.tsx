import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import {
  LayoutDashboard, Package, Home, MessageSquare, Image,
  LogOut, Menu, ExternalLink, User, Layers, Settings, ClipboardList, Shield, Users, Palette, Info
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAdminPermission } from '../../hooks/use-admin-permission'
import { useSiteSettings } from '../../hooks/use-site-settings'

interface SidebarLink {
  href: string
  label: string
  icon: React.ComponentType<any>
  permission?: string
}

const sidebarLinks: SidebarLink[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produk', icon: Package, permission: 'view_products' },
  { href: '/admin/subcategories', label: 'Subkategori', icon: Layers, permission: 'view_subcategories' },
  { href: '/admin/homepage', label: 'Homepage', icon: Home, permission: 'view_homepage' },
  { href: '/admin/testimonials', label: 'Testimoni', icon: MessageSquare, permission: 'view_testimonials' },
  { href: '/admin/gallery', label: 'Galeri', icon: Image, permission: 'view_gallery' },
  { href: '/admin/brands', label: 'Brand', icon: Palette, permission: 'view_brands' },
  { href: '/admin/about', label: 'About', icon: Info, permission: 'view_about' },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings, permission: 'view_settings' },
  { href: '/admin/activity-logs', label: 'Log Aktivitas', icon: ClipboardList, permission: 'view_activity_logs' },
  { href: '/admin/admins', label: 'Admin', icon: Users, permission: 'view_admins' },
  { href: '/admin/roles', label: 'Roles', icon: Shield, permission: 'view_roles' },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const username = localStorage.getItem('admin_username') || 'Admin'
  const { hasPermission } = useAdminPermission()
  const { settings } = useSiteSettings()

  const siteName = settings.site_name || 'RCS Studio'

  const visibleLinks = sidebarLinks.filter((link) => !link.permission || hasPermission(link.permission))

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
    localStorage.removeItem('admin_permissions')
    window.location.href = '/admin/login'
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex flex-col items-center gap-1">
          {settings.site_logo ? (
            <img src={settings.site_logo} alt={siteName} className="h-10 w-auto" />
          ) : (
            <span className="font-heading text-lg font-bold text-white">RCS Studio</span>
          )}
          <span className="font-heading text-sm font-semibold text-white/80">RCS Studio</span>
          <span className="text-xs text-white/40">{username}</span>
        </div>

      <nav className="flex-1 min-h-0 overflow-y-auto px-3 space-y-1">
        {visibleLinks.map((link) => {
          const Icon = link.icon
          const isActive = location === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 space-y-2">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink className="h-4 w-4" />
          Lihat Website
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5 w-full transition-all"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col">
        <div className="flex flex-col h-full bg-foreground">
          <SidebarContent />
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-60 bg-foreground">
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="md:ml-60">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-white/80 backdrop-blur-sm px-4 h-14 md:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="font-heading font-bold text-sm">
            {siteName} Admin
          </h2>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
