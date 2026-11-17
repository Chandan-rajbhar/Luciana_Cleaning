import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'

const SheetContext = createContext({
  registerSheet: () => () => {},
  unregisterSheet: () => {},
  isAnySheetOpen: false,
})

export function SheetProvider({ children, extraOpen = false }) {
  const [openCount, setOpenCount] = useState(0)

  const registerSheet = useCallback(() => {
    setOpenCount((c) => c + 1)
    let cleanedUp = false
    return () => {
      if (!cleanedUp) {
        cleanedUp = true
        setOpenCount((c) => Math.max(0, c - 1))
      }
    }
  }, [])

  const unregisterSheet = useCallback(() => {
    setOpenCount((c) => Math.max(0, c - 1))
  }, [])

  const isAnySheetOpen = useMemo(() => {
    return openCount > 0 || Boolean(extraOpen)
  }, [openCount, extraOpen])

  const value = useMemo(
    () => ({ registerSheet, unregisterSheet, isAnySheetOpen }),
    [registerSheet, unregisterSheet, isAnySheetOpen]
  )

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
}

export function useSheet() {
  return useContext(SheetContext)
}
export default SheetContext
