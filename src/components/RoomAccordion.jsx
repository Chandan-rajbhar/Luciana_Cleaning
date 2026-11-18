import React, { useState } from 'react'
import {
  ChevronDown,
  Check,
  UtensilsCrossed,
  Bath,
  Armchair,
  BedDouble,
  Sparkles,
} from 'lucide-react'

const ROOM_DATA = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    Icon: UtensilsCrossed,
    color: 'text-[#D98A1E]',
    bg: 'bg-[#FFF1DE]',
    tasks: [
      'Inside microwave sanitized',
      'Stovetop degreased',
      'Sink polished',
      'Counters wiped and disinfected',
      'Floors mopped',
    ],
  },
  {
    id: 'bathrooms',
    name: 'Bathrooms',
    Icon: Bath,
    color: 'text-[#3567C9]',
    bg: 'bg-[#E6EEFB]',
    tasks: [
      'Tile descaled',
      'Mirrors buffed',
      'Fixtures sanitized',
      'Toilet deep cleaned',
      'Floors mopped',
    ],
  },
  {
    id: 'living',
    name: 'Living Areas',
    Icon: Armchair,
    color: 'text-[#2E9E5B]',
    bg: 'bg-[#E6F6EC]',
    tasks: [
      'Surfaces dusted',
      'Baseboards wiped',
      'Floors vacuumed',
      'Glass and frames cleaned',
      'Cushions straightened',
    ],
  },
  {
    id: 'bedrooms',
    name: 'Bedrooms',
    Icon: BedDouble,
    color: 'text-[#EF5A78]',
    bg: 'bg-[#FDE4EA]',
    tasks: [
      'Beds made',
      'Surfaces dusted',
      'Floors vacuumed',
      'Closet fronts wiped',
      'Trash emptied',
    ],
  },
]

/**
 * Feature 6: Room-by-Room Checklist Accordion
 * - 4 white collapsible cards (Kitchen, Bathrooms, Living Areas, Bedrooms)
 * - Single-open accordion with 250ms smooth expansion and chevron rotation
 * - Interactive preview checkmarks that fill coral with pop
 * - Progress chip on each card header ("3/5")
 * - Kitchen open by default
 */
export default function RoomAccordion({ className = '', middleContent = null }) {
  const [openRoomId, setOpenRoomId] = useState('kitchen')

  // Track checked state per room: { kitchen: { 0: true, 1: true }, ... }
  // Default: first 3 checked on kitchen as preview
  const [checkedTasks, setCheckedTasks] = useState({
    kitchen: { 0: true, 1: true, 2: true },
    bathrooms: { 0: true, 1: true },
    living: { 0: true, 1: true, 2: true, 3: true },
    bedrooms: { 0: true, 1: true },
  })

  const toggleRoom = (roomId) => {
    setOpenRoomId((prev) => (prev === roomId ? null : roomId))
  }

  const toggleTask = (roomId, taskIdx, e) => {
    e.stopPropagation()
    setCheckedTasks((prev) => {
      const roomChecks = { ...(prev[roomId] || {}) }
      if (roomChecks[taskIdx]) {
        delete roomChecks[taskIdx]
      } else {
        roomChecks[taskIdx] = true
      }
      return { ...prev, [roomId]: roomChecks }
    })
  }

  const renderRoomCard = (room) => {
    const isOpen = openRoomId === room.id
    const roomChecks = checkedTasks[room.id] || {}
    const completedCount = Object.keys(roomChecks).length
    const totalTasks = room.tasks.length
    const { Icon, bg, color } = room

    return (
      <div
        key={room.id}
        className="overflow-hidden rounded-[20px] bg-white shadow-[0_4px_16px_rgba(20,30,60,0.06)] border border-[#F0EAE0] transition-colors"
      >
        {/* Card Header (44px min-height target) */}
        <button
          type="button"
          onClick={() => toggleRoom(room.id)}
          aria-expanded={isOpen}
          className="flex min-h-[56px] w-full items-center justify-between p-3.5 text-left active:bg-[#FAF6F0]/60 transition-colors cursor-pointer focus:outline-none"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}
            >
              <Icon className="h-4.5 w-4.5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-[13.5px] font-extrabold text-[#121A2B]">
                {room.name}
              </h4>
              <span className="text-[11px] font-medium text-[#7A8194]">
                {totalTasks} deep cleaning tasks
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10.5px] font-extrabold transition-colors ${
                completedCount === totalTasks
                  ? 'bg-[#E6F6EC] text-[#2E9E5B]'
                  : 'bg-[#FDE4EA] text-[#EF5A78]'
              }`}
            >
              {completedCount}/{totalTasks}
            </span>

            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[#8A8FA3] transition-transform duration-250 ${
                isOpen ? 'rotate-180 text-[#EF5A78]' : 'rotate-0'
              }`}
            >
              <ChevronDown className="h-4 w-4 stroke-[2.4]" />
            </div>
          </div>
        </button>

        {/* Collapsible Content with 250ms smooth transition */}
        <div
          style={{
            maxHeight: isOpen ? '400px' : '0px',
            transition: 'max-height 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="overflow-hidden bg-[#FAF6F0]/40"
        >
          <div className="p-3.5 pt-1 space-y-2 border-t border-gray-100/80">
            {room.tasks.map((task, idx) => {
              const isChecked = Boolean(roomChecks[idx])
              return (
                <div
                  key={idx}
                  onClick={(e) => toggleTask(room.id, idx, e)}
                  className="group flex min-h-[44px] cursor-pointer items-center justify-between rounded-xl bg-white px-3 py-2 shadow-2xs border border-[#F0EAE0] hover:border-gray-300 active:scale-[0.98] transition-all"
                >
                  <span
                    className={`text-[12px] font-semibold transition-colors ${
                      isChecked ? 'text-[#121A2B]' : 'text-[#7A8194]'
                    }`}
                  >
                    {task}
                  </span>

                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                      isChecked
                        ? 'bg-[#EF5A78] text-white shadow-2xs scale-105'
                        : 'border border-gray-300 bg-white group-hover:border-[#EF5A78]'
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const firstRoom = ROOM_DATA[0]
  const remainingRooms = ROOM_DATA.slice(1)

  return (
    <div className={`stagger-item ${className}`}>
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-2.5">
        <div>
          <h3 className="text-[15px] font-extrabold text-[#121A2B]">
            What's Included
          </h3>
          <p className="text-[11.5px] font-medium text-[#7A8194]">
            Tap to preview what we clean room by room
          </p>
        </div>
        <span className="rounded-full bg-[#E6F6EC] px-2.5 py-0.5 text-[10.5px] font-bold text-[#2E9E5B]">
          100% Guaranteed
        </span>
      </div>

      {/* 2. First room (Kitchen) */}
      {renderRoomCard(firstRoom)}

      {/* 3. Middle Slot: "See the difference" slider with exact 20px spacing above & below */}
      {middleContent && (
        <div className="py-5">
          {middleContent}
        </div>
      )}

      {/* 4. Remaining rooms (Bathrooms, Living Areas, Bedrooms) */}
      <div className={`${middleContent ? '' : 'mt-2.5'} space-y-2.5`}>
        {remainingRooms.map(renderRoomCard)}
      </div>
    </div>
  )
}

