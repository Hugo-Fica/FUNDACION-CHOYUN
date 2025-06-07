import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma'
import { CreateScheduleRequest } from '@/types/schedule'
// GET - Obtener todos los horarios
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const schedules = await prisma.schedule.findMany()
    return NextResponse.json(schedules)
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error fetching schedules', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Crear un nuevo horario
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CreateScheduleRequest = await request.json()
    const { day, startTime, endTime, name } = body

    if (!day) return NextResponse.json({ error: 'El día es obligatorio' }, { status: 400 })

    // Validar los datos
    if (!startTime || !endTime)
      return NextResponse.json(
        { error: 'La hora de inicio y la hora de fin son obligatorias' },
        { status: 400 }
      )

    // Verificar que el día existe
    const dayExists = await prisma.schedule.findFirst({
      where: { name: name }
    })

    if (dayExists) return NextResponse.json({ error: 'El horario ya existe' }, { status: 400 })

    // Crear el horario
    const newSchedule = await prisma.schedule.create({
      data: {
        startTime,
        endTime,
        day,
        name
      }
    })
    if (newSchedule) return NextResponse.json({ message: 'Horario creado' }, { status: 201 })

    return NextResponse.json({ message: 'Error al crear el horario' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error creating schedule', details: error.message },
      { status: 500 }
    )
  }
}
