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
        name: true,
        description: true,
        color: true,
        duration: true,
        schedules: { select: { id: true } },
        studentUsers: { select: { studentId: true } },
        teacherUsers: { select: { teacherId: true } }
      }
    })

    if (!classData) {
      return NextResponse.json({ error: 'No se encontró la clase' }, { status: 404 })
    }
    const respClass = {
      ...classData,
      schedules: classData.schedules.map((item) => item.id),
      studentUsers: classData.studentUsers.map((item) => item.studentId),
      teacherUsers: classData.teacherUsers.map((item) => item.teacherId)
    }
    return NextResponse.json(respClass)
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
    const { name, description, scheduleIds, color, duration } = body

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
    if (color !== undefined) updateData.color = color
    if (duration !== undefined) updateData.duration = duration

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
        return NextResponse.json({ error: 'Uno o más horarios no existen' }, { status: 400 })
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
    // Si se actualiza la clase, retorna un mensaje de exito
    if (updatedClass)
      return NextResponse.json({ message: 'Clase actualizada exitosamente' }, { status: 200 })
    // Si no se actualiza la clase, retorna un mensaje de error
    return NextResponse.json({ message: 'Error al actualizar la clase' }, { status: 500 })
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

    // VERIFICAR SI CLASE EXISTE
    const existingClass = await prisma.class.findUnique({ where: { id } })

    // RETORNAR ERROR SI CLASE NO EXISTE
    if (!existingClass) {
      return NextResponse.json({ error: 'No se encontró la clase' }, { status: 404 })
    }
    // ELIMINAR LA CLASE
    await prisma.class.delete({
      where: { id }
    })
    // RETORNAR MENSAJE DE EXITO
    return NextResponse.json({ message: 'Clase eliminada exitosamente' }, { status: 200 })
  } catch (error) {
    // RETORNAR ERROR
    return NextResponse.json(
      { error: 'Error deleting class', details: (error as Error).message },
      { status: 500 }
    )
  }
}
