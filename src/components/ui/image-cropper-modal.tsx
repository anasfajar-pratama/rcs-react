import { useState, useCallback, useEffect } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { Button } from './button'
import { toast } from 'sonner'

interface ImageCropperModalProps {
  file: File
  cropShape: 'round' | 'rect'
  aspectRatio?: number
  onCrop: (blob: Blob) => void
  onCancel: () => void
}

export function ImageCropperModal({ file, cropShape, aspectRatio = 1, onCrop, onCancel }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)
  const [freeAspect, setFreeAspect] = useState(false)
  const imageUrl = URL.createObjectURL(file)

  const locked = cropShape === 'round'

  useEffect(() => {
    return () => { URL.revokeObjectURL(imageUrl) }
  }, [imageUrl])

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleApply = async () => {
    if (!croppedAreaPixels) return
    setProcessing(true)
    try {
      const canvas = document.createElement('canvas')
      const image = new Image()
      image.src = imageUrl

      await Promise.race([
        new Promise<void>((resolve, reject) => {
          image.onload = () => resolve()
          image.onerror = () => reject(new Error('Gagal memuat gambar'))
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout memuat gambar')), 10000)
        ),
      ])

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context tidak tersedia')

      const { x, y, width, height } = croppedAreaPixels
      canvas.width = width
      canvas.height = height
      ctx.drawImage(image, x, y, width, height, 0, 0, width, height)

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b),
          file.type || 'image/jpeg',
          0.92
        )
      })

      if (!blob) throw new Error('Gagal memproses gambar')

      URL.revokeObjectURL(imageUrl)
      onCrop(blob)
    } catch (err: any) {
      toast.error(err?.message || 'Gagal memproses gambar')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-heading font-semibold text-lg">Atur Gambar</h3>
          <p className="text-sm text-muted-foreground">Zoom & geser untuk posisi yang pas</p>
        </div>

        <div className="relative w-full h-80 bg-black/90">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={locked ? aspectRatio : (freeAspect ? undefined : aspectRatio)}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-4 py-3 border-t border-border space-y-3">
          {!locked && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground shrink-0">Rasio</span>
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFreeAspect(false)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    !freeAspect ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Persegi
                </button>
                <button
                  type="button"
                  onClick={() => setFreeAspect(true)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    freeAspect ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Bebas
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground shrink-0">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-primary/20 accent-primary"
            />
            <span className="text-xs text-muted-foreground shrink-0 w-8 text-right">{zoom.toFixed(1)}x</span>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onCancel}>Batal</Button>
            <Button onClick={handleApply} disabled={processing}>
              {processing ? 'Memproses...' : 'Terapkan'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
