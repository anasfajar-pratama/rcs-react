'use client'

import { Toaster as SonnerToaster } from 'sonner'

function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #E5E0DB',
          borderRadius: '12px',
          color: '#1C1917',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      }}
    />
  )
}

export { Toaster }
