import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'wouter'
import {
  LayoutDashboard, Package, Home, MessageSquare, Image,
  LogOut, Menu, ExternalLink, User, Layers, Settings,
  ClipboardList, Shield, Users, Palette, Info, ChevronDown,
  SlidersHorizontal, ScrollText
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

interface SidebarGroup {
  label: string
  items: SidebarLink[]
}

const sidebarGroups: SidebarGroup[] = [
  { label: '', items: [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  ]},
  { label: 'Kelola Produk', items: [
    { href: '/admin/products', label: 'Produk', icon: Package, permission: 'view_products' },
    { href: '/admin/subcategories', label: 'Subkategori', icon: Layers, permission: 'view_subcategories' },
  ]},
  { label: 'Kelola Konten Umum', items: [
    { href: '/admin/homepage', label: 'Homepage', icon: Home, permission: 'view_homepage' },
    { href: '/admin/heroes', label: 'Hero', icon: SlidersHorizontal, permission: 'view_heroes' },
    { href: '/admin/testimonials', label: 'Testimoni', icon: MessageSquare, permission: 'view_testimonials' },
    { href: '/admin/gallery', label: 'Galeri & Berita', icon: Image, permission: 'view_gallery' },
    { href: '/admin/brands', label: 'Brand', icon: Palette, permission: 'view_brands' },
    { href: '/admin/about', label: 'About', icon: Info, permission: 'view_about' },
    { href: '/admin/legal-achievements', label: 'Legal & Achievement', icon: ScrollText, permission: 'view_about' },
  ]},
  { label: 'Kelola Admin', items: [
    { href: '/admin/settings', label: 'Pengaturan', icon: Settings, permission: 'view_settings' },
    { href: '/admin/activity-logs', label: 'Log Aktivitas', icon: ClipboardList, permission: 'view_activity_logs' },
    { href: '/admin/admins', label: 'Admin', icon: Users, permission: 'view_admins' },
    { href: '/admin/roles', label: 'Roles', icon: Shield, permission: 'view_roles' },
  ]},
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const username = localStorage.getItem('admin_username') || 'Admin'
  const { hasPermission } = useAdminPermission()
  const { settings } = useSiteSettings()

  const siteName = settings.site_name || 'RCS Studio'

  const isActive = (href: string) => location === href

  const hasVisibleItems = (group: SidebarGroup) =>
    group.items.some((link) => !link.permission || hasPermission(link.permission))

  const isGroupActive = (group: SidebarGroup) =>
    group.items.some((link) => isActive(link.href))

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

      <nav className="sidebar-scroll flex-1 min-h-0 overflow-y-auto px-3 space-y-1">
        {sidebarGroups.map((group) => {
          if (!hasVisibleItems(group)) return null
          if (!group.label) {
            return group.items.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive(link.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })
          }

          const groupActive = isGroupActive(group)

          return (
            <CollapsibleGroup
              key={group.label}
              label={group.label}
              defaultOpen={groupActive}
            >
              {group.items.map((link) => {
                if (link.permission && !hasPermission(link.permission)) return null
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ml-2',
                      isActive(link.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {link.label}
                  </Link>
                )
              })}
            </CollapsibleGroup>
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

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
    localStorage.removeItem('admin_permissions')
    window.location.href = '/admin/login'
  }

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

function CollapsibleGroup({
  label,
  defaultOpen,
  children,
}: {
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen ?? true)

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold text-white/40 hover:text-white/60 transition-colors uppercase tracking-wider"
      >
        {label}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? 'auto' : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="space-y-0.5 pb-1">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export function AdminLoader() {
  const { settings } = useSiteSettings()
  return (
    <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        {settings.site_logo ? (
          <motion.img
            src={settings.site_logo}
            alt="Logo"
            className="h-16 w-auto"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : (
          <motion.div
            className="font-heading text-3xl font-bold tracking-tight"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span>Rindang</span>
            <span className="text-primary"> Cemara Sukses</span>
          </motion.div>
        )}
        <motion.div
          className="w-8 h-1 rounded-full bg-primary"
          animate={{ scaleX: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  )
}
