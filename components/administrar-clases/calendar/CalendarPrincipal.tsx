'use client'

import { Card, CardContent } from '@/components/ui/card'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { Calendar, dayjsLocalizer, View, Views } from 'react-big-calendar'
import { es } from 'date-fns/locale'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AdminClassSidebar } from '../sidebar/admin/AdminClassSidebar'
import { useScheduleClass } from '@/hooks/useScheduleClass'
import { useQuery } from '@tanstack/react-query'
import { useScheduleStore } from '@/store/useScheduleStore'
import { useViewClassCalendar } from '@/hooks/useViewClassCalendar'

const locales = {
  es: es
}
const DnDCalendar = withDragAndDrop(Calendar)
const localizer = dayjsLocalizer(dayjs)
export const CalendarPrincipal = () => {
  const [date, setDate] = useState<Date>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [view, setView] = useState<View>(Views.MONTH)
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false)
  const { getClass, getScheduleClass } = useScheduleClass()
  const { setSchedules, setClasses, classes, schedules } = useScheduleStore((state) => state)

  const { data: dataClass, isPending: isPendingClass } = useQuery({
    queryKey: ['getClass'],
    queryFn: getClass
  })

  const { data: dataSchedules, isPending: isPendingSchedules } = useQuery({
    queryKey: ['getScheduleClass'],
    queryFn: getScheduleClass
  })
  useEffect(() => {
    if (dataSchedules?.data) {
      setSchedules(dataSchedules.data)
    }
  }, [dataSchedules, isPendingSchedules, setSchedules])

  const { events: e } = useViewClassCalendar(schedules)
  useEffect(() => {
    if (dataClass?.data) {
      setClasses(dataClass.data)
    }
  }, [dataClass, isPendingClass, setClasses])
  return (
    <SidebarProvider className='md:min-h-[95%]'>
      <SidebarInset className='p-10'>
        {/* <div className="h-full flex flex-col p-4"> */}

        {isPendingClass ? (
          isPendingClass && (
            <div className='flex justify-center items-center h-full'>
              <Loader2 className='animate-spin ' />
              Cargando...
            </div>
          )
        ) : (
          <Card className=''>
            <CardContent className='p-0 '>
              <DnDCalendar
                localizer={localizer}
                events={e}
                // startAccessor='start'
                // endAccessor='end'
                style={{ height: '45rem' }}
                views={['month', 'week', 'day', 'agenda']}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                selectable
                resizable
                // onSelectSlot={handleSelectSlot}
                // onSelectEvent={handleSelectEvent}
                // onEventDrop={handleEventDrop}
                // onEventResize={handleEventResize}
                // eventPropGetter={eventPropGetter}
                // components={components}
                culture='es'
                messages={{
                  today: 'Hoy',
                  previous: 'Anterior',
                  next: 'Siguiente',
                  month: 'Mes',
                  week: 'Semana',
                  day: 'Día',
                  agenda: 'Agenda',
                  date: 'Fecha',
                  time: 'Hora',
                  event: 'Evento',
                  showMore: (total) => `+ Ver más (${total})`
                }}
                popup
              />
            </CardContent>
          </Card>
        )}
      </SidebarInset>
      <AdminClassSidebar />
    </SidebarProvider>
  )
}
