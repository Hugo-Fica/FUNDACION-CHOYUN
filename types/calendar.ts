export type CalendarStore = {
  leftDrawerOpen: boolean
  rightDrawerOpen: boolean
  toggleLeftDrawer: (isOpen: boolean) => void
  toggleRightDrawer: (isOpen: boolean) => void
}
