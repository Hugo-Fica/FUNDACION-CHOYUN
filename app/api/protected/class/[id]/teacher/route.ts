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

    if (!teacherId) {
      return NextResponse.json({ error: 'No hay profesor seleccionado' }, { status: 400 })
    }

    // Verificar que la clase existe
    const classExists = await prisma.class.findUnique({
      where: { id: classId }
    })

    if (!classExists) {
      return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 })
    }

    // Verificar que el usuario existe y tiene rol de profesor
    const teacher = await prisma.users.findUnique({
      where: { id: teacherId },
      include: { role: true }
    })

    if (!teacher) {
      return NextResponse.json({ error: 'Profesor no encontrado' }, { status: 404 })
    }

    // Verificar que el usuario tiene rol de profesor
    if (teacher.role.name !== 'user') {
      return NextResponse.json(
        { error: 'El usuario no tiene el rol de administrador' },
        { status: 403 }
      )
    }

    // Verificar si ya existe la relación
    const existingRelation = await prisma.teacherInClass.findFirst({
      where: {
        teacherId,
        classId
      }
    })

    if (existingRelation) {
      return NextResponse.json(
        { error: 'El profesor ya está asignado a esta clase' },
        { status: 400 }
      )
    }

    // Crear la relación
    const teacherInClass = await prisma.teacherInClass.create({
      data: {
        teacherId,
        classId
      }
    })

    return NextResponse.json(teacherInClass, { status: 201 })
  } catch (error) {
    console.error('Error adding teacher to class:', error)
    return NextResponse.json(
      { error: 'Error adding teacher to class', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un profesor de una clase
export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id: classId } = params
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId')

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 })
    }

    // Verificar que existe la relación
    const relation = await prisma.teacherInClass.findFirst({
      where: {
        teacherId,
        classId
      }
    })

    if (!relation) {
      return NextResponse.json({ error: 'Teacher is not assigned to this class' }, { status: 404 })
    }

    // Eliminar la relación
    await prisma.teacherInClass.delete({
      where: {
        id: relation.id
      }
    })

    return NextResponse.json(
      { message: 'Teacher removed from class successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error removing teacher from class:', error)
    return NextResponse.json(
      { error: 'Error removing teacher from class', details: (error as Error).message },
      { status: 500 }
    )
  }
}
