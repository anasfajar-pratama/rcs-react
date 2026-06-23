import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Eye, EyeOff, LogIn, Sparkles } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { useSiteSettings } from '../../hooks/use-site-settings'
import api from '../../lib/api'

export default function AdminLogin() {
  const [, navigate] = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { settings } = useSiteSettings()

  const siteName = settings.site_name || 'Rindang Cemara Sukses'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/admin/login', { username, password })
      localStorage.setItem('admin_token', res.data.token)
      localStorage.setItem('admin_username', res.data.username)
      if (res.data.permissions) {
        localStorage.setItem('admin_permissions', JSON.stringify(res.data.permissions))
      } else {
        // fallback: fetch permissions
        try {
          const meRes = await api.get('/admin/me')
          if (meRes.data?.permissions) {
            localStorage.setItem('admin_permissions', JSON.stringify(meRes.data.permissions))
          }
        } catch {}
      }
      navigate('/admin')
    } catch {
      setError('Username atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 to-accent/20 items-center justify-center p-12">
          <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-white/60 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                {settings.site_logo ? (
                  <img src={settings.site_logo} alt={siteName} className="h-12 w-auto" />
                ) : (
                  <Sparkles className="h-10 w-10 text-primary" />
                )}
              </div>
              <h1 className="font-heading text-4xl font-bold mb-3">
                {siteName.split(' ')[0]} <span className="text-primary">{siteName.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-muted-foreground max-w-sm">
                Kelola produk, testimoni, dan konten website dengan mudah.
              </p>
            </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="font-heading text-2xl font-bold">Login Admin</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Masuk untuk mengelola website
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              <LogIn className="h-4 w-4" />
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Belum punya data? <Link href="/admin/setup" className="text-primary hover:underline">Setup Awal</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
