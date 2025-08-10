import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma'
import { AddTeacherRequest } from '@/types/teacher'
import { RouteParams } from '@/types/global'

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = params

    // Verificar que la clase existe
    const classExists = await prisma.class.findUnique({
      where: { id }
    })

    if (!classExists) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    // Obtener los profesores de la clase
    const teachers = await prisma.teacherInClass.findMany({
      where: {
        classId: id
      },
      include: {
        teacher: {
          select: {
            id: true,
            email: true,
            names: true,
            lastnames: true,
            phone: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json(
      { error: 'Error fetching teachers', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// POST - Añadir un profesor a una clase
export async function POST(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id: classId } = params
    const body: AddTeacherRequest = await request.json()
    const { teacherId } = body
    if (!Array.isArray(teacherId)) {
      return NextResponse.json(
        { error: 'Se requiere un arreglo IDs de profesores' },
        { status: 400 }
      )
    }

    const classExists = await prisma.class.findUnique({
      where: { id: classId }
    })

    if (!classExists) {
      return NextResponse.json({ error: 'La clase no existe' }, { status: 404 })
    }

    const validTeachers = await prisma.users.findMany({
      where: { id: { in: teacherId } }
    })

    const validTeachersIds = validTeachers.map((teacher) => teacher.id)

    if (validTeachersIds.length !== teacherId.length) {
      return NextResponse.json({ error: 'Uno o más profesores no existe' }, { status: 404 })
    }

    const currentRelations = await prisma.teacherInClass.findMany({
      where: { classId }
    })

    const currentTeacherIds = currentRelations.map((item) => item.id)

    const teachersToAdd = validTeachersIds.filter((id) => !currentTeacherIds.includes(id))

    const teachersToRemove = currentTeacherIds.filter((id) => !validTeachersIds.includes(id))

    if (teachersToAdd.length > 0) {
      await Promise.all(
        teachersToAdd.map(async (teacherId) => {
          await prisma.teacherInClass.create({
            data: {
              teacherId,
              classId
            }
          })
        })
      )
    }

    if (teachersToRemove.length > 0) {
      await Promise.all(
        teachersToRemove.map(async (teacherId) => {
          await prisma.teacherInClass.delete({
            where: {
              id: teacherId,
              classId
            }
          })
        })
      )
    }

    return NextResponse.json({ message: 'Profesores modificados correctamente' }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error adding teacher to class', details: (error as Error).message },
      { status: 500 }
    )
  }
}
