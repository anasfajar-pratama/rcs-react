import imageCompression from 'browser-image-compression'

const MAX_SIZE_MB = 5

interface CompressOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  onProgress?: (progress: number) => void
}

export async function compressImage(file: File, options: CompressOptions = {}): Promise<File> {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.8, onProgress } = options

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Ukuran file maksimal ${MAX_SIZE_MB}MB`)
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: Math.max(maxWidth, maxHeight),
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: quality,
    onProgress,
  })

  return compressed
}

export function validateFileSize(file: File): boolean {
  return file.size <= MAX_SIZE_MB * 1024 * 1024
}
