import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ClassUserAPI } from '@/types/class'
import { EventoCalendarUser } from '@/types/calendar'

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

export const useViewClassCalendarUser = (data: ClassUserAPI[] | null) => {
  const [events, setEvents] = useState<EventoCalendarUser[]>([])

  useEffect(() => {
    if (!data) return

    // ← Only include classes where the *student* can view
    const classes = data.filter((c) => c?.studentUsers?.view === true)

    const today = dayjs().startOf('week') // (Sunday-based; switch if you need Monday)
    const recurrentEvents: EventoCalendarUser[] = []

    for (const classItem of classes) {
      const weekToShow = classItem.duration || 1

      for (let week = 0; week < weekToShow; week++) {
        const baseWeek = today.add(week, 'week')

        for (const schedule of classItem.schedules) {
          const dayIndex = dayNameToIndex[schedule.day]
          if (dayIndex == null) continue

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
            backgroundColor: classItem.color, // <- typo fixed
            extendedProps: {
              classId: classItem.id,
              teacherId: classItem.teacherUsers?.id || null,
              studentId: classItem.studentUsers?.id || null,
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
