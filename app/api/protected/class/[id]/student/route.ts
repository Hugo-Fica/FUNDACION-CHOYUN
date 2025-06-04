import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma'
import { AddStudentRequest } from '@/types/student'
import { RouteParams } from '@/types/global'

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = params

    // Verificar que la clase existe
    const classExists = await prisma.class.findUnique({
      where: { id }
    })

    if (!classExists) {
      return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 })
    }

    // Obtener los estudiantes de la clase
    const studentsClass = await prisma.studentInClass.findMany({
      where: {
        classId: id
      },
      include: {
        student: {
          select: { id: true, names: true, lastnames: true }
        }
      }
    })
    const studentsFinal = studentsClass.map(
      ({ createdAt, updatedAt, classId, studentId, ...item }) => {
        return {
          ...item
        }
      }
    )
    return NextResponse.json(studentsFinal)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Error fetching students', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// POST - Añadir un estudiante a una clase
export async function POST(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id: classId } = params
    const body: AddStudentRequest = await request.json()
    const { studentId } = body

    if (!Array.isArray(studentId)) {
      return NextResponse.json(
        { error: 'Se requiere un arreglo de IDs de alumnos' },
        { status: 400 }
      )
    }

    const classExists = await prisma.class.findUnique({
      where: { id: classId }
    })

    if (!classExists) {
      return NextResponse.json({ error: 'La clase no existe' }, { status: 404 })
    }

    const validStudents = await prisma.users.findMany({
      where: { id: { in: studentId } }
    })

    const validStudentsIds = validStudents.map((student) => student.id)

    if (validStudentsIds.length !== studentId.length) {
      return NextResponse.json({ error: 'Uno o más alumnos no existe' }, { status: 404 })
    }

    const currentRelations = await prisma.studentInClass.findMany({
      where: { classId }
    })

    const currentStudentIds = currentRelations.map((item) => item.id)

    const studentsToAdd = validStudentsIds.filter((id) => !currentStudentIds.includes(id))

    const studentsToRemove = currentStudentIds.filter((id) => !validStudentsIds.includes(id))

    if (studentsToAdd.length > 0) {
      await Promise.all(
        studentsToAdd.map(async (studentId) => {
          await prisma.studentInClass.create({
            data: {
              studentId,
              classId
            }
          })
        })
      )
    }

    if (studentsToRemove.length > 0) {
      await Promise.all(
        studentsToRemove.map(async (studentId) => {
          await prisma.studentInClass.delete({
            where: {
              id: studentId,
              classId
            }
          })
        })
      )
    }

    return NextResponse.json({ message: 'Clase  actualizada correctamente' }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error adding student to class', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un estudiante de una clase
export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id: classId } = params
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    // Verificar que existe la relación
    const relation = await prisma.studentInClass.findFirst({
      where: {
        studentId,
        classId
      }
    })

    if (!relation) {
      return NextResponse.json({ error: 'Student is not enrolled in this class' }, { status: 404 })
    }

    // Eliminar la relación
    await prisma.studentInClass.delete({
      where: {
        id: relation.id
      }
    })

    return NextResponse.json(
      { message: 'Student removed from class successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error removing student from class:', error)
    return NextResponse.json(
      { error: 'Error removing student from class', details: (error as Error).message },
      { status: 500 }
    )
  }
}
