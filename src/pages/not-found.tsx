import { Link } from 'wouter'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="font-heading text-8xl sm:text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-heading text-2xl font-bold mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
        </p>
        <Link href="/">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  )
}
