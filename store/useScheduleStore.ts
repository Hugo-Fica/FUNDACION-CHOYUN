import { ScheduleStore } from '@/types/schedule'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useScheduleStore = create<ScheduleStore>()(
  devtools(
    persist(
      (set) => {
        return {
          schedules: null,
          setSchedules: (schedules) => {
            set({ schedules }, false, 'SET_SCHEDULES')
          },
          classes: null,
          setClasses: (classes) => {
            set({ classes }, false, 'SET_CLASSES')
          },
          classesUser: null,
          setClassesUser: (classesUser) => {
            set({ classesUser }, false, 'SET_CLASSES_USER')
          }
        }
      },
      { name: 'schedule-store' }
    )
  )
)
