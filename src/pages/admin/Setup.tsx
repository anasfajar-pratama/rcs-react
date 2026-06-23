import { useState } from 'react'
import { Link } from 'wouter'
import { Shield, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import api from '../../lib/api'

export default function AdminSetup() {
  const [setupKey, setSetupKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await api.post('/admin/seed', { setupKey })
      setResult({ success: true, message: res.data.message || 'Data berhasil diinisialisasi!' })
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Terjadi kesalahan'
      setResult({ success: false, message: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Setup Awal</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Inisialisasi data awal untuk website
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="setupKey">Setup Key</Label>
            <Input
              id="setupKey"
              placeholder="Masukkan setup key"
              value={setupKey}
              onChange={(e) => setSetupKey(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Memproses...' : 'Inisialisasi Data'}
          </Button>
        </form>

        {result && (
          <div className={`p-4 rounded-xl border text-sm flex items-start gap-3 ${
            result.success
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {result.success ? <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" /> : <XCircle className="h-5 w-5 shrink-0 mt-0.5" />}
            <span>{result.message}</span>
          </div>
        )}

        {result?.success && (
          <div className="text-center">
            <Link href="/admin/login">
              <Button variant="outline">Login Sekarang</Button>
            </Link>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Sudah punya akun? <Link href="/admin/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
