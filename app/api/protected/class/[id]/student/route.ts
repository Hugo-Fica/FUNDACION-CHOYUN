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
    console.log(studentsFinal)
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

    if (!studentId) {
      return NextResponse.json({ error: 'No hay alumno seleccionado' }, { status: 400 })
    }

    // Verificar que la clase existe
    const classExists = await prisma.class.findUnique({
      where: { id: classId }
    })

    if (!classExists) {
      return NextResponse.json({ error: 'La clase seleccionada no existe' }, { status: 404 })
    }

    // Verificar que el usuario existe
    const student = await prisma.users.findUnique({
      where: { id: studentId }
    })

    if (!student) {
      return NextResponse.json({ error: 'El alumno seleccionado no existe' }, { status: 404 })
    }

    // Verificar si ya existe la relación
    const existingRelation = await prisma.studentInClass.findFirst({
      where: {
        studentId,
        classId
      }
    })

    if (existingRelation) {
      return NextResponse.json({ error: 'El alumno ya está inscrito en la clase' }, { status: 400 })
    }

    // Crear la relación
    const studentInClass = await prisma.studentInClass.create({
      data: {
        studentId,
        classId
      }
    })

    return NextResponse.json(studentInClass, { status: 201 })
  } catch (error) {
    console.error('Error adding student to class:', error)
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
