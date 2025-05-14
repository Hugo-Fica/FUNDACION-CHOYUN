import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma'
import { UpdateClassRequest } from '@/types/class'
import { RouteParams } from '@/types/global'

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = params

    const classData = await prisma.class.findUnique({
      where: { id },
      select: {
        id: true,
        studentUsers: { select: { studentId: true } },
        teacherUsers: { select: { teacherId: true } }
      }
    })

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    return NextResponse.json(classData)
  } catch (error) {
    console.error('Error fetching class:', error)
    return NextResponse.json(
      { error: 'Error fetching class', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// PUT - Actualizar una clase
export async function PUT(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = params
    const body: UpdateClassRequest = await request.json()
    const { name, description, scheduleIds } = body

    const existingClass = await prisma.class.findUnique({
      where: { id },
      include: { schedules: true }
    })

    if (!existingClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    // Datos para actualizar
    const updateData: UpdateClassRequest = {}

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description

    // Si se proporcionan nuevos horarios
    if (scheduleIds) {
      // Validar que los horarios existen
      const existingSchedules = await prisma.schedule.findMany({
        where: {
          id: {
            in: scheduleIds
          }
        }
      })

      if (existingSchedules.length !== scheduleIds.length) {
        return NextResponse.json({ error: 'One or more schedule IDs are invalid' }, { status: 400 })
      }

      // Eliminar la clase de los horarios anteriores que ya no están en la lista
      const oldScheduleIds = existingClass.scheduleIds || []
      const scheduleIdsToRemove = oldScheduleIds.filter((oldId) => !scheduleIds.includes(oldId))

      if (scheduleIdsToRemove.length > 0) {
        for (const scheduleId of scheduleIdsToRemove) {
          // Primero obtenemos el horario para saber qué IDs de clase tiene actualmente
          const schedule = await prisma.schedule.findUnique({
            where: { id: scheduleId }
          })

          if (schedule) {
            // Filtramos el ID de la clase actual
            const updatedClassIds = schedule.classIds.filter((classId) => classId !== id)

            // Actualizamos con el nuevo array (sin usar función callback)
            await prisma.schedule.update({
              where: { id: scheduleId },
              data: {
                classIds: updatedClassIds
              }
            })
          }
        }
      }

      // Añadir la clase a los nuevos horarios
      const newScheduleIds = scheduleIds.filter((newId) => !oldScheduleIds.includes(newId))

      if (newScheduleIds.length > 0) {
        for (const scheduleId of newScheduleIds) {
          await prisma.schedule.update({
            where: { id: scheduleId },
            data: {
              classIds: {
                push: id
              }
            }
          })
        }
      }

      // Actualizar los horarios de la clase
      updateData.scheduleIds = scheduleIds
    }

    // Actualizar la clase
    const updatedClass = await prisma.class.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { error: 'Error updating class', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// Solución para DELETE - Eliminar una clase
export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = params

    // Verificar que la clase existe
    const existingClass = await prisma.class.findUnique({
      where: { id },
      include: {
        schedules: true,
        teacherUsers: true,
        studentUsers: true
      }
    })

    if (!existingClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    // Eliminar las relaciones con horarios
    if (existingClass.scheduleIds && existingClass.scheduleIds.length > 0) {
      for (const scheduleId of existingClass.scheduleIds) {
        // Primero obtenemos el horario para saber qué IDs de clase tiene actualmente
        const schedule = await prisma.schedule.findUnique({
          where: { id: scheduleId }
        })

        if (schedule) {
          // Filtramos el ID de la clase actual
          const updatedClassIds = schedule.classIds.filter((classId) => classId !== id)

          // Actualizamos con el nuevo array (sin usar función callback)
          await prisma.schedule.update({
            where: { id: scheduleId },
            data: {
              classIds: updatedClassIds
            }
          })
        }
      }
    }

    // Eliminar la clase (las relaciones con profesores y estudiantes se eliminarán automáticamente)
    await prisma.class.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Class deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { error: 'Error deleting class', details: (error as Error).message },
      { status: 500 }
    )
  }
}
