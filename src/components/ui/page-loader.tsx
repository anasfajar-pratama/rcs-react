import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface PageLoaderProps {
  logo?: string | null
  variant?: 'fullscreen' | 'inline'
}

export function PageLoader({ logo, variant = 'fullscreen' }: PageLoaderProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center bg-background',
      variant === 'fullscreen' ? 'fixed inset-0 z-[100]' : 'py-24'
    )}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        {logo ? (
          <motion.img
            src={logo}
            alt="Logo"
            className="h-16 w-auto"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : (
          <motion.div
            className="font-heading text-3xl font-bold tracking-tight"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span>Rindang</span>
            <span className="text-primary"> Cemara Sukses</span>
          </motion.div>
        )}
        <motion.div
          className="w-8 h-1 rounded-full bg-primary"
          animate={{ scaleX: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  )
}
