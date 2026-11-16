import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * Computes current viewport device rules:
 * - Phone: width < 768px
 * - Tablet: (768px <= width <= 1024px) OR (1025px <= width <= 1366px AND pointer: coarse / touch)
 * - Desktop: >= 1025px with mouse (not coarse) OR > 1366px
 * Updates live on resize, orientationchange, and media query changes.
 */
export function computeViewportMode() {
  if (typeof window === 'undefined') {
    return {
      device: 'desktop',
      isPhone: false,
      isTablet: false,
      isDesktop: true,
      isLandscape: false,
      width: 1440,
      height: 900,
    }
  }

  const width = window.innerWidth
  const height = window.innerHeight
  const isLandscape = width > height

  // Check coarse pointer / touch-first device
  const isCoarse = window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false
  const hasTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
  const isTouchFirst = isCoarse || hasTouch

  const isPhone = width < 768
  const isTablet =
    (width >= 768 && width <= 1024) ||
    (width >= 1025 && width <= 1366 && isTouchFirst)
  const isDesktop = !isPhone && !isTablet

  const device = isPhone ? 'phone' : isTablet ? 'tablet' : 'desktop'

  return {
    device,
    isPhone,
    isTablet,
    isDesktop,
    isLandscape,
    width,
    height,
  }
}

function useViewportModeState() {
  const [mode, setMode] = useState(computeViewportMode)

  useEffect(() => {
    const update = () => {
      const next = computeViewportMode()
      setMode(next)
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-device', next.device)
        document.documentElement.setAttribute(
          'data-orientation',
          next.isLandscape ? 'landscape' : 'portrait'
        )
      }
    }

    // Run synchronously on mount
    update()

    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)

    // Watch media queries for device category, pointer, and orientation
    const queries = [
      '(max-width: 767.98px)',
      '(min-width: 768px) and (max-width: 1024.98px)',
      '(min-width: 1025px) and (max-width: 1366.98px)',
      '(min-width: 1367px)',
      '(pointer: coarse)',
      '(pointer: fine)',
      '(orientation: portrait)',
      '(orientation: landscape)',
    ]

    const mqls = queries.map((q) => {
      try {
        return window.matchMedia ? window.matchMedia(q) : null
      } catch {
        return null
      }
    }).filter(Boolean)

    const handleMql = () => update()

    mqls.forEach((mql) => {
      if (mql.addEventListener) {
        mql.addEventListener('change', handleMql)
      } else if (mql.addListener) {
        mql.addListener(handleMql)
      }
    })

    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
      mqls.forEach((mql) => {
        if (mql.removeEventListener) {
          mql.removeEventListener('change', handleMql)
        } else if (mql.removeListener) {
          mql.removeListener(handleMql)
        }
      })
    }
  }, [])

  return mode
}

const ViewportContext = createContext(computeViewportMode())

export function ViewportProvider({ children }) {
  const mode = useViewportModeState()
  return (
    <ViewportContext.Provider value={mode}>
      {children}
    </ViewportContext.Provider>
  )
}

export function useViewport() {
  return useContext(ViewportContext)
}

export default useViewport
