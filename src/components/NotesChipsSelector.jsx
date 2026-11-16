import React from 'react'
import { Check, Trash2, Edit3 } from 'lucide-react'
import { ENTRY_NOTE_CHIPS } from '../data/bookingDraft'

/**
 * Feature 4: Quick-Tap Entry & Pet Notes Chips
 * - Wrap-style rows of emoji chips
 * - Two-way sync with "Booking instructions" textarea
 * - Manual edits in textarea are preserved when toggling chips
 * - "Clear" link resets both chips and notes
 */
export default function NotesChipsSelector({
  selectedChips = [],
  notesText = '',
  onChange,
  className = '',
}) {
  const handleToggleChip = (chipText) => {
    const isSelected = selectedChips.includes(chipText)
    const newChips = isSelected
      ? selectedChips.filter((c) => c !== chipText)
      : [...selectedChips, chipText]

    // Sync with textarea lines
    let lines = notesText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

    if (isSelected) {
      // Remove this chip's line
      lines = lines.filter((l) => l !== chipText)
    } else {
      // Add this chip's line if not already present
      if (!lines.includes(chipText)) {
        lines.push(chipText)
      }
    }

    const newText = lines.join('\n')
    onChange?.({ chips: newChips, customNotes: newText })
  }

  const handleTextChange = (e) => {
    const val = e.target.value
    // Detect which chips remain in the typed text
    const activeChips = ENTRY_NOTE_CHIPS.filter((chip) => val.includes(chip))
    onChange?.({ chips: activeChips, customNotes: val })
  }

  const handleClearAll = (e) => {
    e.preventDefault()
    onChange?.({ chips: [], customNotes: '' })
  }

  return (
    <div
      className={`stagger-item rounded-[22px] bg-white p-4 shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] ${className}`}
    >
      <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
        <div>
          <h3 className="text-[14.5px] font-extrabold text-[#121A2B]">
            Notes for your cleaner
          </h3>
          <p className="text-[11px] font-medium text-[#7A8194]">
            Tap quick tags or type custom entry instructions
          </p>
        </div>

        {(selectedChips.length > 0 || notesText.trim().length > 0) && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[11.5px] font-bold text-[#EF5A78] hover:underline active:scale-95 transition-all cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Selectable Emoji Chips (text-based emoji) */}
      <div className="mt-3 flex flex-wrap gap-2">
        {ENTRY_NOTE_CHIPS.map((chip) => {
          const isSelected = selectedChips.includes(chip)
          return (
            <button
              key={chip}
              type="button"
              onClick={() => handleToggleChip(chip)}
              aria-pressed={isSelected}
              className={`group flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-bold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border border-[#EF5A78] bg-[#FDE4EA] text-[#EF5A78] shadow-xs scale-[1.02]'
                  : 'border border-[#E5E0D8] bg-white text-[#121A2B] hover:border-gray-300 active:scale-95'
              }`}
            >
              <span>{chip}</span>
              {isSelected && (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EF5A78] text-white animate-pop-in">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Booking instructions textarea */}
      <div className="mt-3">
        <label
          htmlFor="booking-notes-input"
          className="block text-[11px] font-bold text-[#7A8194] mb-1.5"
        >
          Booking instructions
        </label>
        <div className="relative rounded-2xl bg-[#FAF6F0] p-3 border border-[#F0EAE0] focus-within:border-[#EF5A78] focus-within:ring-2 focus-within:ring-[#EF5A78]/20 transition-all">
          <textarea
            id="booking-notes-input"
            rows={3}
            value={notesText}
            onChange={handleTextChange}
            placeholder="E.g., Gate code #4821, key under floral mat, please do not ring doorbell..."
            className="w-full resize-none bg-transparent text-[12.5px] font-medium leading-relaxed text-[#121A2B] placeholder:text-[#8A8FA3] focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}

