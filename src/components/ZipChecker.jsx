import React, { useState, useEffect, useRef } from 'react'
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  LocateFixed,
  Loader2,
  Check,
  LocateOff,
} from 'lucide-react'
import { FORT_MYERS_ZIPS } from '../data/bookingDraft'

/**
 * Dev toggle constant:
 * Set to true to simulate permission denied state.
 * Developers can also simulate denied at runtime by holding Alt/Shift while clicking the button,
 * or by setting `window.__SIMULATE_GEO_DENIED = true` in the browser console.
 */
export const SIMULATE_LOCATION_DENIED = false

/**
 * Feature 7: Fort Myers Zip Code Service Checker Pill
 * - Placed directly below the header on the Home screen
 * - 48px pill search bar with pin icon on the left
 * - 40x40 round "Detect my location" icon button inside the right end
 * - States:
 *     1. idle: LocateFixed icon, soft primary tint
 *     2. loading (~1.4s): accent background, spinning Loader2, "Detecting your location…"
 *     3. success: green background with Check icon, auto-fills 33901, "Fort Myers, FL 33901. Great news, we clean in your area."
 *     4. denied: LocateOff icon, "Location access is off. Allow it in settings or type your zip code."
 * - Reset on typing: typing resets the button to idle and clears the location message
 * - Theme-ready: all colors sourced from CSS custom properties with brand fallbacks
 * - Responsive: overflow-safe at 360px viewport width
 */
export default function ZipChecker({ currentZip = '', onZipChange, onShowToast }) {
  const [zip, setZip] = useState(currentZip || '')
  const [status, setStatus] = useState(
    currentZip && currentZip.length === 5 && FORT_MYERS_ZIPS.includes(currentZip)
      ? 'served'
      : 'idle'
  )

  // Location detection states: 'idle' | 'loading' | 'success' | 'denied'
  const [geoState, setGeoState] = useState('idle')
  const [geoMessage, setGeoMessage] = useState('')
  const geoTimerRef = useRef(null)

  // Cleanup pending timer on unmount
  useEffect(() => {
    return () => {
      if (geoTimerRef.current) clearTimeout(geoTimerRef.current)
    }
  }, [])

  // Sync external zip changes
  useEffect(() => {
    if (currentZip !== undefined && currentZip !== zip) {
      setZip(currentZip || '')
      if (currentZip && currentZip.length === 5) {
        setStatus(FORT_MYERS_ZIPS.includes(currentZip) ? 'served' : 'unserved')
      } else {
        setStatus('idle')
      }
    }
  }, [currentZip])

  // Handle typing inside the input
  const handleChange = (e) => {
    // Reset location button to idle and hide location detection message when user types
    if (geoTimerRef.current) clearTimeout(geoTimerRef.current)
    if (geoState !== 'idle') {
      setGeoState('idle')
      setGeoMessage('')
    }

    const raw = e.target.value.replace(/\D/g, '').slice(0, 5)
    setZip(raw)

    if (raw.length === 5) {
      const isServed = FORT_MYERS_ZIPS.includes(raw)
      setStatus(isServed ? 'served' : 'unserved')
      if (isServed && onZipChange) {
        onZipChange(raw)
      }
    } else {
      setStatus('idle')
      if (onZipChange && zip.length === 5) {
        onZipChange('')
      }
    }
  }

  // Handle clearing input
  const handleClear = () => {
    if (geoTimerRef.current) clearTimeout(geoTimerRef.current)
    setZip('')
    setStatus('idle')
    setGeoState('idle')
    setGeoMessage('')
    if (onZipChange) {
      onZipChange('')
    }
  }

  // Handle "Detect my location" click
  const handleDetectLocation = (e) => {
    if (geoTimerRef.current) clearTimeout(geoTimerRef.current)

    // Check if permission denial is requested via constant, window flag, or Alt/Shift+Click dev shortcut
    const isDenied =
      SIMULATE_LOCATION_DENIED ||
      (typeof window !== 'undefined' && Boolean(window.__SIMULATE_GEO_DENIED)) ||
      (e && (e.altKey || e.shiftKey))

    setGeoState('loading')
    setGeoMessage('Detecting your location…')

    geoTimerRef.current = setTimeout(() => {
      if (isDenied) {
        setGeoState('denied')
        setGeoMessage('Location access is off. Allow it in settings or type your zip code.')
        return
      }

      // =========================================================================
      // TODO: Real Geolocation & Reverse Geocoding Implementation
      // When wiring up real device location, replace this simulated flow with:
      //
      // if (!('geolocation' in navigator)) {
      //   setGeoState('denied')
      //   setGeoMessage('Geolocation is not supported by your browser.')
      //   return
      // }
      //
      // navigator.geolocation.getCurrentPosition(
      //   async (position) => {
      //     try {
      //       const { latitude, longitude } = position.coords
      //       // Call reverse geocoding API / backend proxy:
      //       // const res = await fetch(`/api/reverse-geocode?lat=${latitude}&lng=${longitude}`)
      //       // const data = await res.json()
      //       // const detectedZip = data.zipCode // e.g. "33901"
      //       // setZip(detectedZip)
      //       // setGeoState('success')
      //       // ...
      //     } catch (err) {
      //       setGeoState('denied')
      //       setGeoMessage('Unable to retrieve location. Please enter zip manually.')
      //     }
      //   },
      //   (error) => {
      //     if (error.code === error.PERMISSION_DENIED) {
      //       setGeoState('denied')
      //       setGeoMessage('Location access is off. Allow it in settings or type your zip code.')
      //     } else {
      //       setGeoState('denied')
      //       setGeoMessage('Location unavailable. Please enter your zip code.')
      //     }
      //   },
      //   { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      // )
      // =========================================================================

      // Simulated successful detection for Fort Myers service area:
      const detectedZip = '33901'
      setZip(detectedZip)
      setGeoState('success')
      setGeoMessage('Fort Myers, FL 33901. Great news, we clean in your area.')

      // Run existing zip coverage check
      const isServed = FORT_MYERS_ZIPS.includes(detectedZip)
      setStatus(isServed ? 'served' : 'unserved')
      if (isServed && onZipChange) {
        onZipChange(detectedZip)
      }
    }, 1400)
  }

  const handleNotifyMe = (e) => {
    e.preventDefault()
    onShowToast?.("We'll let you know when we expand to your zip!")
  }

  // Dynamic border & ring using theme CSS variables with standard fallbacks
  const isGreenState = status === 'served' || geoState === 'success'
  const isOrangeState = status === 'unserved' || geoState === 'denied'

  const borderStyle = {
    borderColor: isGreenState
      ? 'var(--success, #2E9E5B)'
      : isOrangeState
      ? 'var(--warning, #EA580C)'
      : 'var(--border-color, #F0EAE0)',
    boxShadow: isGreenState
      ? '0 0 0 1px rgba(46, 158, 91, 0.2), 0 2px 12px rgba(20,30,60,0.05)'
      : isOrangeState
      ? '0 0 0 1px rgba(234, 88, 12, 0.2), 0 2px 12px rgba(20,30,60,0.05)'
      : '0 2px 12px rgba(20,30,60,0.05)',
  }

  // Dynamic left pin icon color
  const pinColor = isGreenState
    ? 'var(--success, #2E9E5B)'
    : isOrangeState
    ? 'var(--warning, #EA580C)'
    : 'var(--primary, #EF5A78)'

  // Dynamic button styles for the 4 states
  const locateButtonStyle =
    geoState === 'loading'
      ? {
          backgroundColor: 'var(--primary, #EF5A78)',
          color: '#FFFFFF',
        }
      : geoState === 'success'
      ? {
          backgroundColor: 'var(--success, #2E9E5B)',
          color: '#FFFFFF',
        }
      : geoState === 'denied'
      ? {
          backgroundColor: 'var(--warning-bg, #FFF4E5)',
          color: 'var(--warning, #EA580C)',
          border: '1px solid var(--warning-border, rgba(234, 88, 12, 0.25))',
        }
      : {
          backgroundColor: 'var(--primary-tint, rgba(239, 90, 120, 0.12))',
          color: 'var(--primary, #EF5A78)',
        }

  return (
    <div className="stagger-item w-full">
      {/* 48px Pill Search Bar */}
      <div
        style={borderStyle}
        className="relative flex h-12 w-full items-center rounded-full bg-[var(--bg-card,#FFFFFF)] pl-3.5 sm:pl-4 pr-1.5 transition-all duration-200 border"
      >
        {/* Left Pin Icon */}
        <MapPin
          style={{ color: pinColor }}
          className="h-4.5 w-4.5 shrink-0 stroke-[2.2] transition-colors"
          aria-hidden="true"
        />

        {/* Zip Code Input */}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
          value={zip}
          onChange={handleChange}
          placeholder="Enter your zip code (e.g. 33901)"
          aria-label="Service area zip code"
          className="ml-2.5 flex-1 min-w-0 bg-transparent text-[14.5px] sm:text-[16px] font-semibold text-[var(--text-primary,#121A2B)] placeholder:text-[var(--text-muted,#8A8FA3)] placeholder:font-normal placeholder:truncate focus:outline-none"
        />

        {/* Clear (X) Button (when input has text) */}
        {zip.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear zip code"
            title="Clear zip code"
            className="flex h-7 w-7 min-w-[28px] items-center justify-center rounded-full mr-1 text-[var(--text-muted,#8A8FA3)] hover:text-[var(--text-primary,#121A2B)] hover:bg-gray-100 active:scale-90 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary,#EF5A78)]"
          >
            <X className="h-4 w-4 stroke-[2.2]" />
          </button>
        )}

        {/* Round "Detect my location" Button (40x40 min tap target) */}
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={geoState === 'loading'}
          aria-label="Detect my location"
          title="Detect my location"
          style={locateButtonStyle}
          className="flex h-10 w-10 min-w-[40px] min-h-[40px] shrink-0 items-center justify-center rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary,#EF5A78)] focus-visible:ring-offset-2 active:scale-95 disabled:cursor-wait"
        >
          {geoState === 'loading' ? (
            <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" />
          ) : geoState === 'success' ? (
            <Check className="h-5 w-5 stroke-[2.8]" />
          ) : geoState === 'denied' ? (
            <LocateOff className="h-5 w-5 stroke-[2.2]" />
          ) : (
            <LocateFixed className="h-5 w-5 stroke-[2.2]" />
          )}
        </button>
      </div>

      {/* Message Area below the Bar (with aria-live="polite") */}
      <div aria-live="polite" className="w-full">
        {/* State 1: Location detecting message */}
        {geoState === 'loading' && (
          <div
            className="mt-2 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11.5px] font-bold animate-pop-in"
            style={{
              backgroundColor: 'var(--primary-tint, rgba(239, 90, 120, 0.12))',
              color: 'var(--primary, #EF5A78)',
              border: '1px solid var(--primary-border, rgba(239, 90, 120, 0.25))',
            }}
          >
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin motion-reduce:animate-none" />
            <span>{geoMessage || 'Detecting your location…'}</span>
          </div>
        )}

        {/* State 2: Location success message */}
        {geoState === 'success' && (
          <div
            className="mt-2 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-bold animate-pop-in"
            style={{
              backgroundColor: 'var(--success-bg, #E6F6EC)',
              color: 'var(--success, #2E9E5B)',
              border: '1px solid var(--success-border, rgba(46, 158, 91, 0.25))',
            }}
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
            <span>✓ {geoMessage || 'Fort Myers, FL 33901. Great news, we clean in your area.'}</span>
          </div>
        )}

        {/* State 3: Location denied message */}
        {geoState === 'denied' && (
          <div
            className="mt-2 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-bold animate-pop-in"
            style={{
              backgroundColor: 'var(--warning-bg, #FFF4E5)',
              color: 'var(--warning, #EA580C)',
              border: '1px solid var(--warning-border, rgba(234, 88, 12, 0.25))',
            }}
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
            <span>{geoMessage || 'Location access is off. Allow it in settings or type your zip code.'}</span>
          </div>
        )}

        {/* State 4: Standard manual typing served message (when not in a location detect state) */}
        {geoState === 'idle' && status === 'served' && (
          <div
            className="mt-2 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-bold animate-pop-in"
            style={{
              backgroundColor: 'var(--success-bg, #E6F6EC)',
              color: 'var(--success, #2E9E5B)',
              border: '1px solid var(--success-border, rgba(46, 158, 91, 0.25))',
            }}
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
            <span>✓ Great news! Luciana's crew services your neighborhood.</span>
          </div>
        )}

        {/* State 5: Standard manual typing unserved message */}
        {geoState === 'idle' && status === 'unserved' && (
          <div
            className="mt-2 flex items-center justify-between rounded-full px-3.5 py-1.5 text-[11.5px] font-bold animate-pop-in"
            style={{
              backgroundColor: 'var(--warning-bg, #FFF4E5)',
              color: 'var(--warning, #EA580C)',
              border: '1px solid var(--warning-border, rgba(234, 88, 12, 0.25))',
            }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
              <span className="truncate">We don't cover that area yet.</span>
            </div>
            <button
              type="button"
              onClick={handleNotifyMe}
              className="ml-2 shrink-0 text-[11.5px] font-extrabold underline hover:brightness-95 active:scale-95 cursor-pointer"
              style={{ color: 'var(--primary, #EF5A78)' }}
            >
              Notify me
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
