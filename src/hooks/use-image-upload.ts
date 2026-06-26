import { useState, useRef, useCallback } from 'react'
import api from '../lib/api'
import { compressImage } from '../lib/compress-image'
import { toast } from 'sonner'

interface CropState {
  file: File
  shape: 'round' | 'rect'
  aspectRatio: number
  onResult: (url: string) => void
}

export function useImageUpload() {
  const [cropState, setCropState] = useState<CropState | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const cropRef = useRef<CropState | null>(null)

  const startCrop = (
    file: File,
    shape: 'round' | 'rect' = 'rect',
    aspectRatio: number = 1,
    onResult: (url: string) => void
  ) => {
    const state = { file, shape, aspectRatio, onResult }
    cropRef.current = state
    setCropState(state)
  }

  const cancelCrop = () => {
    cropRef.current = null
    setCropState(null)
  }

  const handleCropResult = useCallback(async (blob: Blob) => {
    const state = cropRef.current
    if (!state) return
    setUploading(true)
    setProgress(0)
    try {
      const compressed = await compressImage(
        new File([blob], state.file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }),
        { onProgress: setProgress }
      )
      setProgress(95)
      const safeFile = new File([compressed], state.file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' })
      const fd = new FormData()
      fd.append('image', safeFile)
      const res = await api.post('/admin/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const imageUrl: string = res.data?.imageUrl
      if (!imageUrl || !imageUrl.includes('/storage/uploads/')) {
        throw new Error('URL gambar tidak valid dari server')
      }
      setProgress(100)
      state.onResult(imageUrl)
      toast.success('Gambar berhasil diupload')
    } catch (err: any) {
      toast.error(err?.message || 'Gagal upload gambar')
    } finally {
      setUploading(false)
      setProgress(0)
      cropRef.current = null
      setCropState(null)
    }
  }, [])

  const directUpload = async (file: File, onResult: (url: string) => void) => {
    setUploading(true)
    setProgress(0)
    try {
      const compressed = await compressImage(file, { onProgress: setProgress })
      setProgress(95)
      const safeFile = new File([compressed], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' })
      const fd = new FormData()
      fd.append('image', safeFile)
      const res = await api.post('/admin/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const imageUrl: string = res.data?.imageUrl
      if (!imageUrl || !imageUrl.includes('/storage/uploads/')) {
        throw new Error('URL gambar tidak valid dari server')
      }
      setProgress(100)
      onResult(imageUrl)
      toast.success('Gambar berhasil diupload')
    } catch (err: any) {
      toast.error(err?.message || 'Gagal upload gambar')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return { cropState, uploading, progress, startCrop, cancelCrop, handleCropResult, directUpload }
}
