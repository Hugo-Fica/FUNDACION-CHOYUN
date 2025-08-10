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
  backgroudColor: string
  extendedProps: {
    classId: string
    teacherId: string[]
    studentId: string[]
    description: string
  }
}
