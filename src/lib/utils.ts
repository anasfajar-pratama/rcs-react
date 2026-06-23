import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price?: number): string {
  if (!price) return ''
  return 'Rp ' + price.toLocaleString('id-ID')
}
