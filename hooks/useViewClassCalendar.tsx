import { ScheduleMongo } from '@/types/schedule'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import customParseFormat from 'dayjs/plugin/customParseFormat'

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

export const useViewClassCalendar = (data: ScheduleMongo[] | null) => {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    if (!data) return

    const weeksToShow = 8
    const today = dayjs().startOf('week')
    const recurrentEvents = []

    for (let week = 0; week < weeksToShow; week++) {
      const baseWeek = today.add(week, 'week')

      for (const horario of data) {
        const dayIndex = dayNameToIndex[horario.day]
        const date = baseWeek.startOf('week').add(dayIndex, 'day')

        const start = dayjs(
          `${date.format('YYYY-MM-DD')} ${horario.startTime}`,
          'YYYY-MM-DD hh:mm A'
        ).toDate()
        const end = dayjs(
          `${date.format('YYYY-MM-DD')} ${horario.endTime}`,
          'YYYY-MM-DD hh:mm A'
        ).toDate()
        recurrentEvents.push({
          title: horario.name,
          start,
          end,
          allDay: false
        })
      }
    }

    setEvents(recurrentEvents)
  }, [data])

  return { events }
}
