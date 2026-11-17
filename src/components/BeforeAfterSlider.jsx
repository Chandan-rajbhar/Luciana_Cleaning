import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronsLeftRight } from 'lucide-react'

/**
 * Feature 1: Before & After Clean Slider
 * - 24px-radius card with 4:3 aspect ratio
 * - Stacked "Before" (bottom) and "After" (top, clipped via inset(0 0 0 X%)) photos
 * - 40px round draggable handle with coral ChevronsLeftRight icon
 * - Pointer events + setPointerCapture with touch-action: pan-y for smooth scrolling
 * - Clamp between 4% and 96%
 * - Gentle snap to nearest 25%, 50%, 75% if released nearby (within 6%)
 * - Auto-demo sweep on first view (50% -> 70% -> 50%) unless prefers-reduced-motion is enabled
 * - Accessible keyboard slider controls (ArrowLeft / ArrowRight in 5% steps)
 */
export default function BeforeAfterSlider({
  scene = 'kitchen', // 'kitchen' or 'living'
  beforeImage,
  afterImage,
  title = 'See the difference',
  subtitle = 'Swipe to reveal the deep clean shine',
  className = '',
}) {
  const containerRef = useRef(null)
  const isDraggingRef = useRef(false)
  const [sliderPos, setSliderPos] = useState(50) // percentage 4% - 96%
  const [isTransitioning, setIsTransitioning] = useState(false)
  const hasAnimatedRef = useRef(false)

  // Default image pairs according to scene
  const defaultBefore =
    scene === 'living'
      ? '/images/living-before.jpg'
      : '/images/kitchen-before.jpg'
  const defaultAfter =
    scene === 'living'
      ? '/images/living-after.jpg'
      : '/images/kitchen-after.jpg'

  const fallbackBefore =
    scene === 'living' ? '/images/dusting-surfaces.jpg' : '/images/estimate-kitchen.jpg'
  const fallbackAfter =
    scene === 'living' ? '/images/hero-living-room.jpg' : '/images/deep-cleaning.jpg'

  const imgBeforeSrc = beforeImage || defaultBefore
  const imgAfterSrc = afterImage || defaultAfter

  // Auto-demo once on mount if reduced-motion is not preferred
  useEffect(() => {
    if (hasAnimatedRef.current) return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) return

    const timer = setTimeout(() => {
      hasAnimatedRef.current = true
      setIsTransitioning(true)
      setSliderPos(70)

      const backTimer = setTimeout(() => {
        setSliderPos(50)
        const stopTimer = setTimeout(() => {
          setIsTransitioning(false)
        }, 450)
        return () => clearTimeout(stopTimer)
      }, 550)

      return () => clearTimeout(backTimer)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  const calcPercentageFromClientX = useCallback((clientX) => {
    if (!containerRef.current) return 50
    const rect = containerRef.current.getBoundingClientRect()
    const relativeX = clientX - rect.left
    const percentage = (relativeX / rect.width) * 100
    return Math.min(Math.max(percentage, 4), 96)
  }, [])

  const handlePointerDown = (e) => {
    isDraggingRef.current = true
    setIsTransitioning(false)
    e.currentTarget.setPointerCapture(e.pointerId)
    const newPos = calcPercentageFromClientX(e.clientX)
    setSliderPos(newPos)
  }

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return
    const newPos = calcPercentageFromClientX(e.clientX)
    setSliderPos(newPos)
  }

  const snapToNearestStep = (pos) => {
    const snapPoints = [25, 50, 75]
    for (const p of snapPoints) {
      if (Math.abs(pos - p) <= 6) {
        return p
      }
    }
    return pos
  }

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Ignored if pointer capture was already released
    }

    const snapped = snapToNearestStep(sliderPos)
    if (snapped !== sliderPos) {
      setIsTransitioning(true)
      setSliderPos(snapped)
      setTimeout(() => setIsTransitioning(false), 260)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setIsTransitioning(true)
      setSliderPos((prev) => Math.max(prev - 5, 4))
      setTimeout(() => setIsTransitioning(false), 150)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setIsTransitioning(true)
      setSliderPos((prev) => Math.min(prev + 5, 96))
      setTimeout(() => setIsTransitioning(false), 150)
    }
  }

  return (
    <div className={`stagger-item w-full ${className}`}>
      {title && (
        <div className="mb-2.5 flex items-center justify-between">
          <div>
            <h3 className="text-[17px] font-extrabold text-[#121A2B]">{title}</h3>
            {subtitle && (
              <p className="text-[11.5px] font-medium text-[#7A8194]">{subtitle}</p>
            )}
          </div>
          <span className="rounded-full bg-[#FAF6F0] px-2.5 py-1 text-[10.5px] font-bold text-[#8A8FA3] border border-[#F0EAE0]">
            Interactive
          </span>
        </div>
      )}

      {/* Main 4:3 Card Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'pan-y' }}
        className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden rounded-[24px] bg-[#121A2B] shadow-[0_6px_22px_rgba(20,30,60,0.08)] border border-[#F0EAE0]"
      >
        {/* Layer 1: "Before" Image (Base layer, underneath) */}


        {/* Layer 2: "After" Image (Top layer, clipped to the right of divider) */}
        <div
          style={{
            clipPath: `inset(0 0 0 ${sliderPos}%)`,
            transition: isTransitioning
              ? 'clip-path 260ms cubic-bezier(0.25, 1, 0.5, 1)'
              : 'none',
          }}
          className="absolute inset-0 h-full w-full pointer-events-none select-none"
        >
          <img
            src={imgAfterSrc}
            alt="Room after deep cleaning"
            onError={(e) => {
              if (e.currentTarget.src !== fallbackAfter) {
                e.currentTarget.src = fallbackAfter
              }
            }}
            className="h-full w-full object-cover object-center pointer-events-none select-none"
          />
        </div>

        {/* Layer 3: Corner Pills ("Before" dark on left, "After" coral on right) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
          <span className="rounded-full bg-[#121A2B]/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm backdrop-blur-xs">
            Before
          </span>
          <span className="rounded-full bg-[#EF5A78] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
            After
          </span>
        </div>

        {/* Layer 4: Vertical Divider Line */}
        <div
          style={{
            left: `${sliderPos}%`,
            transition: isTransitioning
              ? 'left 260ms cubic-bezier(0.25, 1, 0.5, 1)'
              : 'none',
          }}
          className="absolute top-0 bottom-0 z-20 w-0.5 -ml-[1px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.35)] pointer-events-none"
        />

        {/* Layer 5: Draggable Center 40px Round Handle */}
        <div
          role="slider"
          aria-label="Before and after clean reveal slider"
          aria-valuenow={Math.round(sliderPos)}
          aria-valuemin={4}
          aria-valuemax={96}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{
            left: `${sliderPos}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            transition: isTransitioning
              ? 'left 260ms cubic-bezier(0.25, 1, 0.5, 1)'
              : 'none',
          }}
          className="absolute z-30 flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-white text-[#EF5A78] shadow-[0_4px_14px_rgba(0,0,0,0.28)] ring-2 ring-white/80 active:scale-95 focus:outline-none focus:ring-3 focus:ring-[#EF5A78] cursor-grab active:cursor-grabbing"
        >
          <ChevronsLeftRight className="h-5 w-5 stroke-[2.4]" />
        </div>
      </div>
    </div>
  )
}

