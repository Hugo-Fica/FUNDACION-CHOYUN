import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma'
import { CreateClassRequest } from '@/types/class'

export async function GET(req: NextRequest) {
  try {
    const classChoyun = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        schedules: { select: { id: true, name: true, day: true, startTime: true, endTime: true } },
        teacherUsers: { select: { id: true, teacher: true } },
        studentUsers: { select: { id: true, student: true } }
      }
    })
    return NextResponse.json({ classChoyun: classChoyun }, { status: 200 })
  } catch (error) {
    NextResponse.json({ message: 'Hubo un error', error: error }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateClassRequest = await req.json()
    const { name, description, scheduleIds = [] } = body

    if (!name) {
      return NextResponse.json(
        { message: 'Error no se proporciono el nombre de la clase' },
        { status: 400 }
      )
    }

    if (scheduleIds.length > 0) {
      const existingSchedules = await prisma.schedule.findMany({
        where: { id: { in: scheduleIds } }
      })

      if (existingSchedules.length !== scheduleIds.length) {
        return NextResponse.json(
          { message: 'Error al crear la clase, los horarios no existen' },
          { status: 400 }
        )
      }
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        scheduleIds
      }
    })

    if (scheduleIds.length > 0) {
      await Promise.all(
        scheduleIds.map(async (id) => {
          prisma.schedule.update({
            where: { id },
            data: { classIds: { push: newClass.id } }
          })
        })
      )
    }
    return NextResponse.json({ message: 'Clase creada' }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating class', details: (error as Error).message },
      { status: 500 }
    )
  }
}
