import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const listeners: Set<(toast: Toast) => void> = new Set()

export function toast(toast: Omit<Toast, 'id'>) {
  const id = genId()
  const newToast = { ...toast, id }
  listeners.forEach((listener) => listener(newToast))
  return id
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((t: Toast) => {
    setToasts((prev) => [...prev, t])
    setTimeout(() => {
      setToasts((prev) => prev.filter((p) => p.id !== t.id))
    }, 4000)
  }, [])

  useState(() => {
    listeners.add(addToast)
    return () => { listeners.delete(addToast) }
  })

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { toasts, toast, dismiss }
}
