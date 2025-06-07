import { CalendarStore } from '@/types/calendar'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useCalendarStore = create<CalendarStore>()(
  devtools(
    (set) => {
      return {
        leftDrawerOpen: true,
        rightDrawerOpen: true,
        toggleLeftDrawer: (isOpen) => {
          set({ leftDrawerOpen: isOpen }, false, 'SET_LEFT_DRAWER')
        },
        toggleRightDrawer: (isOpen) => {
          set({ rightDrawerOpen: isOpen }, false, 'SET_RIGHT_DRAWER')
        }
      }
    },
    { name: 'calendar' }
  )
)
