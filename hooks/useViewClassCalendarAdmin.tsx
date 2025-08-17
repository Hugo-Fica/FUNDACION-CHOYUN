import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ClassAPI } from '@/types/class'
import { EventoCalendar } from '@/types/calendar'

dayjs.extend(weekday)
dayjs.extend(customParseFormat)

const dayNameToIndex: Record<string, number> = {
  Lunes: 0,
  Martes: 1,
  Miércoles: 2,
  Jueves: 3,
  Viernes: 4,
  Sábado: 5,
  Domingo: 6
}

export const useViewClassCalendarAdmin = (data: ClassAPI[] | null) => {
  const [events, setEvents] = useState<EventoCalendar[]>([])

  useEffect(() => {
    if (!data) return

    const today = dayjs().startOf('week')
    const recurrentEvents: EventoCalendar[] = []

    for (const classItem of data) {
      const weekToShow = classItem.duration || 1
      for (let week = 0; week < weekToShow; week++) {
        const baseWeek = today.add(week, 'week')
        for (const schedule of classItem.schedules) {
          const dayIndex = dayNameToIndex[schedule.day]
          const date = baseWeek.startOf('week').add(dayIndex, 'day')

          const start = dayjs(
            `${date.format('YYYY-MM-DD')} ${schedule.startTime}`,
            'YYYY-MM-DD hh:mm A'
          ).toDate()

          const end = dayjs(
            `${date.format('YYYY-MM-DD')} ${schedule.endTime}`,
            'YYYY-MM-DD hh:mm A'
          ).toDate()

          recurrentEvents.push({
            title: classItem.name,
            start,
            end,
            allDay: false,
            backgroundColor: classItem.color,
            extendedProps: {
              classId: classItem.id,
              teacherId: classItem.teacherUsers.map((t) => t.id),
              studentId: classItem.studentUsers.map((s) => s.id),
              description: classItem.description
            }
          })
        }
      }
    }

    setEvents(recurrentEvents)
  }, [data])

  return { events }
}
