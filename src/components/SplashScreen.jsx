import React, { useEffect } from 'react'
import BrandLogo from './BrandLogo'

/**
 * Screen: Splash Screen
 * - Large 160px round logo badge with coral ring & soft shadow
 * - Pop-in scale animation
 * - Tagline "A cleaner home, one tap away." below
 * - Eliminates duplicate "Luciana" and "CLEANING SERVICES" text (since already inside logo)
 */
export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    if (!onFinish) return
    const timer = setTimeout(() => {
      onFinish()
    }, 1800)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div
      onClick={onFinish}
      className="flex h-full w-full flex-col items-center justify-center bg-[#FAF6F0] px-6 text-center select-none cursor-pointer"
    >
      {/* 160px Brand Logo Badge with pop-in animation */}
      <div className="animate-pop-in">
        <BrandLogo
          size={160}
          alt="Luciana Cleaning Services logo"
          className="shadow-[0_12px_36px_rgba(239,90,120,0.32)] ring-2 ring-[#EF5A78]"
        />
      </div>

      {/* Tagline */}
      <p className="mt-6 text-[15px] font-bold text-[#121A2B] tracking-tight">
        A cleaner home, one tap away.
      </p>

      {/* Subtle Florida subtitle */}
      <p className="mt-1 text-[12px] font-medium text-[#7A8194]">
        Fort Myers • Cape Coral, FL
      </p>
    </div>
  )
}

