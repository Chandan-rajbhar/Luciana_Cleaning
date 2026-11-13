import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Star, ChevronRight, AlertCircle } from 'lucide-react'
import { SERVICES, CATEGORIES } from '../data/services'

/**
 * Screen: Our Services (Section 3)
 * Opened from "Services" tab, Home "See all" link, or Category icons.
 * Features:
 * - Horizontal category filter chips: All, Cleaning, Repairing, Laundry, Painting, Washing
 * - Active chip smoothly scrolls into view (centered) so Painting/Washing are never cut off
 * - 150ms fade filter animation
 * - Empty state with "No services in this category yet" and "View all services" button
 * - Services tab in bottom bar remains active (coral)
 */
export default function ServicesScreen({
  initialCategory = 'all',
  onSelectService,
  onTriggerLoading,
}) {
  const [activeCategory, setActiveCategory] = useState(
    (initialCategory || 'all').toLowerCase()
  )
  const chipRefs = useRef({})

  // Sync state if initialCategory changes from outside navigation
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory.toLowerCase())
    }
  }, [initialCategory])

  // Scroll active chip into view (centered) so offscreen chips are visible
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeEl = chipRefs.current[activeCategory]
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        })
      }
    }, 60)
    return () => clearTimeout(timer)
  }, [activeCategory])

  const handleChipSelect = (catId) => {
    if (catId !== activeCategory) {
      onTriggerLoading?.(350)
      setActiveCategory(catId)
    }
  }

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return SERVICES
    return SERVICES.filter((s) => s.category === activeCategory)
  }, [activeCategory])

  return (
    <div className="flex flex-col text-[#121A2B] px-4 pt-3 space-y-3.5 pb-[calc(var(--bar-h)+16px+env(safe-area-inset-bottom))]">
      {/* Horizontal Category Filter Chips */}
      <div className="stagger-item flex gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              ref={(el) => (chipRefs.current[cat.id] = el)}
              type="button"
              onClick={() => handleChipSelect(cat.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold transition-all active:scale-[0.95] cursor-pointer ${
                isSelected
                  ? 'bg-[#EF5A78] text-white shadow-[0_2px_10px_rgba(239,90,120,0.35)]'
                  : 'bg-white text-[#7A8194] border border-[#F0EAE0] hover:text-[#121A2B]'
              }`}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Services List / Empty State */}
      <div className="stagger-item space-y-3 pt-1">
        {filteredServices.length === 0 ? (
          <div
            key={`empty-${activeCategory}`}
            className="flex flex-col items-center justify-center rounded-[24px] bg-white p-8 text-center shadow-[0_4px_16px_rgba(20,30,60,0.05)] border border-[#F0EAE0] animate-filter-fade"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FDE4EA] text-[#EF5A78]">
              <AlertCircle className="h-7 w-7 stroke-[2]" />
            </div>
            <h3 className="mt-3 text-[15px] font-extrabold text-[#121A2B]">
              No services in this category yet
            </h3>
            <p className="mt-1 max-w-[240px] text-[12px] font-medium text-[#7A8194]">
              Our specialized partner teams for this category are available upon direct request.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className="mt-4 rounded-full bg-[#EF5A78] px-5 py-2 text-[12px] font-extrabold text-white shadow-[0_3px_10px_rgba(239,90,120,0.3)] hover:brightness-105 active:scale-[0.96] transition-all cursor-pointer"
            >
              View all services
            </button>
          </div>
        ) : (
          <div
            key={activeCategory}
            className="space-y-3 animate-filter-fade"
          >
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className="group flex cursor-pointer items-center justify-between rounded-[20px] bg-white p-3.5 shadow-[0_4px_16px_rgba(20,30,60,0.06)] hover:shadow-[0_6px_20px_rgba(20,30,60,0.1)] active:scale-[0.985] transition-all border border-transparent hover:border-[#EF5A78]/20"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* 64px rounded photo */}
                  <div className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[16px] bg-gradient-to-br ${service.fallback}`}>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Service info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FFF1DE] px-2 py-0.5 text-[10px] font-bold text-[#D98A1E]">
                        <Star className="h-3 w-3 fill-[#D98A1E] text-[#D98A1E]" />
                        {service.rating}
                      </span>
                      {service.discount && (
                        <span className="rounded-full bg-[#FDE4EA] px-2 py-0.5 text-[10px] font-bold text-[#EF5A78]">
                          {service.discount}
                        </span>
                      )}
                    </div>

                    <h4 className="mt-1 truncate text-[14px] font-extrabold text-[#121A2B]">
                      {service.title}
                    </h4>
                    <p className="truncate text-[11.5px] font-medium text-[#7A8194]">
                      {service.subtitle}
                    </p>

                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-[14px] font-extrabold text-[#EF5A78]">
                        ${service.hourlyRate}
                      </span>
                      <span className="text-[11px] font-semibold text-[#7A8194]">
                        /h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Coral View > Link */}
                <div className="flex items-center gap-0.5 text-[12px] font-extrabold text-[#EF5A78] shrink-0 pl-2 group-hover:translate-x-0.5 transition-transform">
                  <span>View</span>
                  <ChevronRight className="h-3.5 w-3.5 stroke-[2.4]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
