import { useState, useRef, useCallback } from 'react'

interface BeforeAfterSliderProps {
  beforeImage?: string
  afterImage?: string
  beforeLabel?: string
  afterLabel?: string
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Sebelum',
  afterLabel = 'Sesudah',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setSliderPosition((x / rect.width) * 100)
  }, [])

  const handleMouseDown = () => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const hasImages = beforeImage && afterImage

  return (
    <div className="space-y-3">
      {/* <h4 className="font-heading font-semibold text-sm">Before / After</h4> */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 cursor-ew-resize select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={(e) => {
          const touch = e.touches[0]
          if (touch) handleMove(touch.clientX)
        }}
        onTouchMove={(e) => {
          const touch = e.touches[0]
          if (touch) handleMove(touch.clientX)
        }}
      >
        {hasImages ? (
          <>
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
            </div>
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <img src={afterImage} alt="After" className="w-full h-full object-cover" />
            </div>
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            />
          </>
        )}

        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
            <div className="w-1 h-4 bg-muted-foreground rounded-full" />
          </div>
        </div>

        <span className="absolute top-3 left-3 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/80 text-foreground">
          {beforeLabel}
        </span>
        <span className="absolute top-3 right-3 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/80 text-foreground">
          {afterLabel}
        </span>
      </div>
    </div>
  )
}
