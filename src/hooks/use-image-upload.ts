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
    try {
      const compressed = await compressImage(
        new File([blob], state.file.name, { type: state.file.type || 'image/jpeg' })
      )
      const safeFile = new File([compressed], state.file.name, { type: compressed.type || 'image/jpeg' })
      const fd = new FormData()
      fd.append('image', safeFile)
      const res = await api.post('/admin/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const imageUrl: string = res.data?.imageUrl
      if (!imageUrl || !imageUrl.includes('/storage/uploads/')) {
        throw new Error('URL gambar tidak valid dari server')
      }
      state.onResult(imageUrl)
      toast.success('Gambar berhasil diupload')
    } catch (err: any) {
      toast.error(err?.message || 'Gagal upload gambar')
    } finally {
      setUploading(false)
      cropRef.current = null
      setCropState(null)
    }
  }, [])

  return { cropState, uploading, startCrop, cancelCrop, handleCropResult }
}
