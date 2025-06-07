import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma'
import { RouteParams } from '@/types/global'
import { UpdateScheduleRequest } from '@/types/schedule'

// GET - Obtener un horario específico por ID
export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = params

    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        day: true,
        classes: {
          include: {
            teacherUsers: {
              include: {
                teacher: {
                  select: {
                    id: true,
                    names: true,
                    lastnames: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    return NextResponse.json(schedule)
  } catch (error: any) {
    console.error('Error fetching schedule:', error)
    return NextResponse.json(
      { error: 'Error fetching schedule', details: error.message },
      { status: 500 }
    )
  }
}

// Método PUT corregido
export async function PUT(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = params
    const body: UpdateScheduleRequest = await request.json()
    const { startTime, endTime, dayId, classIds } = body

    // Verificar que el horario existe
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id },
      include: { classes: true }
    })

    if (!existingSchedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    // Si se cambia el día, verificar que existe
    if (dayId && dayId !== existingSchedule.dayId) {
      const dayExists = await prisma.day.findUnique({
        where: { id: dayId }
      })

      if (!dayExists) {
        return NextResponse.json({ error: 'Day not found' }, { status: 404 })
      }
    }

    // Datos para actualizar
    const updateData: any = {}
    if (startTime !== undefined) updateData.startTime = startTime
    if (endTime !== undefined) updateData.endTime = endTime
    if (dayId !== undefined) updateData.dayId = dayId

    // Si se proporcionan nuevas clases
    if (classIds) {
      // Validar que las clases existen
      const existingClasses = await prisma.class.findMany({
        where: {
          id: {
            in: classIds
          }
        }
      })

      if (existingClasses.length !== classIds.length) {
        return NextResponse.json({ error: 'One or more class IDs are invalid' }, { status: 400 })
      }

      // Eliminar el horario de las clases anteriores que ya no están en la lista
      const oldClassIds = existingSchedule.classIds || []
      const classIdsToRemove = oldClassIds.filter((oldId) => !classIds.includes(oldId))

      if (classIdsToRemove.length > 0) {
        for (const classId of classIdsToRemove) {
          // Primero obtenemos la clase actual para acceder a su array de scheduleIds
          const currentClass = await prisma.class.findUnique({
            where: { id: classId }
          })

          if (currentClass && currentClass.scheduleIds) {
            // Filtramos el array en memoria y luego lo asignamos directamente
            const updatedScheduleIds = currentClass.scheduleIds.filter(
              (scheduleId) => scheduleId !== id
            )

            // Actualizamos con el nuevo array
            await prisma.class.update({
              where: { id: classId },
              data: {
                scheduleIds: updatedScheduleIds
              }
            })
          }
        }
      }

      // Añadir el horario a las nuevas clases
      const newClassIds = classIds.filter((newId) => !oldClassIds.includes(newId))

      if (newClassIds.length > 0) {
        for (const classId of newClassIds) {
          // Obtenemos la clase actual
          const currentClass = await prisma.class.findUnique({
            where: { id: classId }
          })

          if (currentClass) {
            // Creamos un nuevo array con todos los horarios actuales más el nuevo
            const updatedScheduleIds = [...(currentClass.scheduleIds || []), id]

            // Actualizamos con el nuevo array
            await prisma.class.update({
              where: { id: classId },
              data: {
                scheduleIds: updatedScheduleIds
              }
            })
          }
        }
      }

      // Actualizar las clases del horario
      updateData.classIds = classIds
    }

    // Actualizar el horario
    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(updatedSchedule)
  } catch (error: any) {
    console.error('Error updating schedule:', error)
    return NextResponse.json(
      { error: 'Error updating schedule', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un horario (corregido)
export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = params

    // Verificar que el horario existe
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id },
      include: { classes: true }
    })

    if (!existingSchedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    // Eliminar las relaciones con clases
    if (existingSchedule.classIds && existingSchedule.classIds.length > 0) {
      for (const classId of existingSchedule.classIds) {
        // Obtenemos la clase actual
        const currentClass = await prisma.class.findUnique({
          where: { id: classId }
        })

        if (currentClass && currentClass.scheduleIds) {
          // Filtramos el array en memoria
          const updatedScheduleIds = currentClass.scheduleIds.filter(
            (scheduleId) => scheduleId !== id
          )

          // Actualizamos con el nuevo array
          await prisma.class.update({
            where: { id: classId },
            data: {
              scheduleIds: updatedScheduleIds
            }
          })
        }
      }
    }

    // Eliminar el horario
    await prisma.schedule.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Schedule deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting schedule:', error)
    return NextResponse.json(
      { error: 'Error deleting schedule', details: error.message },
      { status: 500 }
    )
  }
}
