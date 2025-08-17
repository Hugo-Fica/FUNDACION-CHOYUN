'use client'

import { Card, CardContent } from '@/components/ui/card'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { Calendar, dayjsLocalizer, View, Views } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useScheduleClass } from '@/hooks/useScheduleClass'
import { useQuery } from '@tanstack/react-query'
import { useScheduleStore } from '@/store/useScheduleStore'
import { EventoCalendar } from '@/types/calendar'
import { useUserAuthStore } from '@/store/userAuthStore'
import { useViewClassCalendarUser } from '@/hooks/useViewCalendarUser'

const DnDCalendar = withDragAndDrop(Calendar)
const localizer = dayjsLocalizer(dayjs)

export const CalendarPrincipalUser = () => {
  const userId = useUserAuthStore((state) => state.user_id)
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<View>(Views.MONTH)
  const { getClassByUserId, getScheduleClass } = useScheduleClass()
  const { setSchedules, setClassesUser, classesUser } = useScheduleStore((state) => state)

  const { data: dataClass, isPending: isPendingClass } = useQuery({
    queryKey: ['getClass'],
    queryFn: () => getClassByUserId(userId)
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

  const { events } = useViewClassCalendarUser(classesUser)

  useEffect(() => {
    if (dataClass) {
      setClassesUser(dataClass)
    }
  }, [dataClass, isPendingClass, setClassesUser])

  return (
    <SidebarProvider className='md:min-h-[95%]'>
      <SidebarInset className='p-10'>
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
                events={events}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: (event as EventoCalendar).backgroundColor
                  }
                })}
                style={{ height: '45rem' }}
                views={['month', 'week', 'day', 'agenda']}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                selectable
                resizable
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
      {/* <AdminClassSidebar /> */}
    </SidebarProvider>
  )
}
