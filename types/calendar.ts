export type CalendarStore = {
  leftDrawerOpen: boolean
  rightDrawerOpen: boolean
  toggleLeftDrawer: (isOpen: boolean) => void
  toggleRightDrawer: (isOpen: boolean) => void
}

export type EventoCalendar = {
  title: string
  start: Date
  end: Date
  allDay: boolean
  backgroundColor: string
  extendedProps: {
    classId: string
    teacherId: string[]
    studentId: string[]
    description: string
  }
}

export type EventoCalendarUser = {
  title: string
  start: Date
  end: Date
  allDay: boolean
  backgroundColor: string
  extendedProps: {
    classId: string
    teacherId: string | null
    studentId: string | null
    description: string
  }
}
