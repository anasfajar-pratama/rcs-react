import { useState, useEffect } from 'react'
import { Route, Switch } from 'wouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from './components/ui/toaster'
import { PageLoader } from './components/ui/page-loader'
import { useSiteSettings } from './hooks/use-site-settings'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Wishlist from './pages/Wishlist'
import Quiz from './pages/Quiz'
import NotFound from './pages/not-found'
import BrandPage from './pages/brands/BrandPage'
import AdminLogin from './pages/admin/Login'
import AdminSetup from './pages/admin/Setup'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminProductEdit from './pages/admin/ProductEdit'
import AdminSubcategories from './pages/admin/Subcategories'
import AdminHomepage from './pages/admin/Homepage'
import AdminTestimonials from './pages/admin/Testimonials'
import AdminGallery from './pages/admin/Gallery'
import AdminSettings from './pages/admin/Settings'
import AdminBrands from './pages/admin/Brands'
import AdminAbout from './pages/admin/About'
import AdminActivityLogs from './pages/admin/ActivityLogs'
import AdminAdmins from './pages/admin/Admins'
import AdminRoles from './pages/admin/Roles'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

function requireAdmin(Component: React.ComponentType) {
  return function ProtectedRoute() {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      window.location.href = '/admin/login'
      return null
    }
    const perms = localStorage.getItem('admin_permissions')
    if (!perms || perms === '[]' || perms === 'null') {
      import('./lib/api').then(({ default: api }) => {
        api.get('/admin/me').then((res) => {
          if (res.data?.permissions) {
            localStorage.setItem('admin_permissions', JSON.stringify(res.data.permissions))
            window.location.reload()
          }
        }).catch(() => {
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_username')
          localStorage.removeItem('admin_permissions')
          window.location.href = '/admin/login'
        })
      })
    }
    return <Component />
  }
}

export default function App() {
  const { settings } = useSiteSettings()
  const [ready, setReady] = useState(() => !!sessionStorage.getItem('app_loaded'))

  useEffect(() => {
    sessionStorage.setItem('app_loaded', '1')
    const timer = setTimeout(() => setReady(true), 600)
    return () => clearTimeout(timer)
  }, [])

  if (!ready) {
    return <PageLoader logo={settings.site_logo} />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Switch>
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin/setup" component={AdminSetup} />
            <Route path="/admin" component={requireAdmin(AdminDashboard)} />
            <Route path="/admin/products" component={requireAdmin(AdminProducts)} />
            <Route path="/admin/products/edit/:id?" component={requireAdmin(AdminProductEdit)} />
            <Route path="/admin/subcategories" component={requireAdmin(AdminSubcategories)} />
            <Route path="/admin/homepage" component={requireAdmin(AdminHomepage)} />
            <Route path="/admin/testimonials" component={requireAdmin(AdminTestimonials)} />
            <Route path="/admin/gallery" component={requireAdmin(AdminGallery)} />
            <Route path="/admin/settings" component={requireAdmin(AdminSettings)} />
            <Route path="/admin/brands" component={requireAdmin(AdminBrands)} />
            <Route path="/admin/about" component={requireAdmin(AdminAbout)} />
            <Route path="/admin/activity-logs" component={requireAdmin(AdminActivityLogs)} />
            <Route path="/admin/admins" component={requireAdmin(AdminAdmins)} />
            <Route path="/admin/roles" component={requireAdmin(AdminRoles)} />
            <Route path="/">
              <PublicLayout><Home /></PublicLayout>
            </Route>
            <Route path="/brand/blisera">
              <PublicLayout><BrandPage slug="blisera" /></PublicLayout>
            </Route>
            <Route path="/brand/fokka">
              <PublicLayout><BrandPage slug="fokka" /></PublicLayout>
            </Route>
            <Route path="/brand/pijar-nala">
              <PublicLayout><BrandPage slug="pijar-nala" /></PublicLayout>
            </Route>
            <Route path="/product/:id">
              <PublicLayout><ProductDetail /></PublicLayout>
            </Route>
            <Route path="/about">
              <PublicLayout><About /></PublicLayout>
            </Route>
            <Route path="/contact">
              <PublicLayout><Contact /></PublicLayout>
            </Route>
            <Route path="/wishlist">
              <PublicLayout><Wishlist /></PublicLayout>
            </Route>
            <Route path="/quiz">
              <PublicLayout><Quiz /></PublicLayout>
            </Route>
            <Route>
              <PublicLayout><NotFound /></PublicLayout>
            </Route>
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
