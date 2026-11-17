import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { SheetBubbles } from './VisualEffects'
import { useSheet } from '../context/SheetContext'

/**
 * Shared BottomSheet Component:
 * - Renders through a portal into the app shell (#sheet-portal)
 * - Backdrop: absolute inset-0, z-[60], bg-black/45, backdrop-blur-xs
 * - Sheet container: absolute bottom-0 inset-x-0, z-[70], max-h-[92%], flex flex-col
 * - (a) Fixed top (shrink-0) with grab handle and header
 * - (b) Middle area with flex-1, min-h-0, overflow-y-auto and overscroll-contain
 * - (c) Fixed footer (shrink-0) with top border, white bg, and 1rem + env(safe-area-inset-bottom)
 * - Accessibility: role="dialog", aria-modal="true", Escape key to close, backdrop tap to close, auto-focus on open
 * - Automatically notifies SheetContext so TabBar slides down and hides smoothly
 */
export default function BottomSheet({
  isOpen = false,
  onClose,
  title,
  ariaLabel,
  className = '',
  contentClassName = '',
  maxHeight = 'max-h-[92%]',
  showGrabHandle = true,
  showBubbles = true,
  header,
  children,
  footer,
}) {
  const [mounted, setMounted] = useState(false)
  const sheetRef = useRef(null)
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

  // Escape key listener to close sheet
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

  // Auto-focus sheet container on open for keyboard accessibility
  useEffect(() => {
    if (isOpen && sheetRef.current) {
      sheetRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const portalTarget =
    mounted && typeof document !== 'undefined'
      ? document.getElementById('sheet-portal')
      : null

  const sheetElement = (
    <div
      className="absolute inset-0 z-[60] flex flex-col justify-end pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || (typeof title === 'string' ? title : undefined)}
    >
      {/* Blurred Backdrop */}
      <div
        onClick={onClose}
        className="animate-backdrop-in absolute inset-0 bg-black/45 backdrop-blur-xs z-[60] pointer-events-auto cursor-pointer"
        aria-hidden="true"
      />

      {/* Main Sheet Container: max-h-[92dvh], flex flex-col */}
      <div
        ref={sheetRef}
        tabIndex={-1}
        className={`animate-sheet-up relative z-[70] pointer-events-auto w-full max-w-[560px] mx-auto rounded-t-[28px] bg-[#FAF6F0] shadow-[0_-12px_40px_rgba(20,30,60,0.22)] border-t border-[#F0EAE0] flex flex-col ${maxHeight} overflow-hidden outline-none ${className}`}
      >
        {showBubbles && <SheetBubbles />}

        {/* (a) Fixed Top Header: shrink-0 */}
        <div className="shrink-0 bg-[#FAF6F0] px-5 pt-3 pb-3 border-b border-[#EAE3D8] rounded-t-[28px]">
          {showGrabHandle && (
            <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-gray-300" aria-hidden="true" />
          )}
          {header}
        </div>

        {/* (b) Middle Area: flex-1, min-h-0, overflow-y-auto, overscroll-contain */}
        <div
          className={`flex-1 min-h-0 overflow-y-auto no-scrollbar [overscroll-behavior:contain] ${
            contentClassName || 'px-5 py-4 space-y-4'
          }`}
        >
          {children}
        </div>

        {/* (c) Fixed Footer: shrink-0, border-t, bg-white, 1rem + env(safe-area-inset-bottom) */}
        {footer && (
          <div className="shrink-0 border-t border-[#F0EAE0] bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  if (portalTarget) {
    return createPortal(sheetElement, portalTarget)
  }

  return sheetElement
}
