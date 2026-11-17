import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Phone, X } from 'lucide-react'
import { BUSINESS_PHONE, BUSINESS_PHONE_RAW } from '../data/services'
import { useSheet } from '../context/SheetContext'

/**
 * In-frame confirmation dialog for calling (239) 555-0189.
 * - Portaled into #sheet-portal strictly inside app shell
 * - Backdrop z-[60], dialog z-[70]
 * - Escape key to close, backdrop tap to close, auto-focus on open
 * - Hides TabBar smoothly while open
 */
export default function CallDialog({ isOpen, onClose, onConfirmCall }) {
  const [mounted, setMounted] = useState(false)
  const dialogRef = useRef(null)
  const { registerSheet } = useSheet()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-register with context to trigger bottom bar slide-down
  useEffect(() => {
    if (!isOpen) return
    const unregister = registerSheet?.()
    return () => {
      unregister?.()
    }
  }, [isOpen, registerSheet])

  // Escape key listener to close dialog
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Auto-focus dialog on open
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const portalTarget =
    mounted && typeof document !== 'undefined'
      ? document.getElementById('sheet-portal')
      : null

  const dialogElement = (
    <div
      className="absolute inset-0 z-[60] flex items-end justify-center p-4 pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-dialog-title"
    >
      <div
        onClick={onClose}
        className="animate-backdrop-in absolute inset-0 bg-black/45 backdrop-blur-xs z-[60] pointer-events-auto cursor-pointer"
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="animate-sheet-up relative z-[70] pointer-events-auto w-full max-w-[560px] mx-auto space-y-2.5 pb-[calc(1rem+env(safe-area-inset-bottom))] outline-none"
      >
        <div className="rounded-[24px] bg-white p-5 text-center shadow-[0_12px_36px_rgba(20,30,60,0.18)] border border-[#F0EAE0]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FDE4EA] text-[#EF5A78] ring-6 ring-[#FDE4EA]/50">
            <Phone className="h-6 w-6 stroke-[2.3]" />
          </div>

          <h2
            id="call-dialog-title"
            className="mt-3.5 text-[17px] font-extrabold text-[#121A2B]"
          >
            Call {BUSINESS_PHONE}?
          </h2>
          <p className="mt-1 text-[12px] font-medium text-[#7A8194]">
            Fort Myers dispatch, estimates &amp; crew assistance
          </p>

          <a
            href={`tel:${BUSINESS_PHONE_RAW}`}
            onClick={(e) => {
              e.preventDefault()
              onConfirmCall()
            }}
            className="mt-4 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#EF5A78] px-5 py-3 text-[13.5px] font-extrabold text-white shadow-[0_6px_18px_rgba(239,90,120,0.38)] hover:brightness-105 active:scale-[0.97] transition-all cursor-pointer"
          >
            <Phone className="h-4 w-4 stroke-[2.3]" />
            Call Now
          </a>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="min-h-[44px] w-full rounded-full bg-white py-3 text-[13.5px] font-extrabold text-[#7A8194] shadow-md hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer border border-[#F0EAE0]"
        >
          Cancel
        </button>
      </div>
    </div>
  )

  if (portalTarget) {
    return createPortal(dialogElement, portalTarget)
  }

  return dialogElement
}
