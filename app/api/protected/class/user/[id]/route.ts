import { RouteParams } from '@/types/global'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const { id } = params
  const classData = await prisma?.class.findMany({
    where: {
      OR: [
        { teacherUsers: { some: { teacherId: id } } },
        { studentUsers: { some: { studentId: id } } }
      ]
    },
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      duration: true,
      fechaInicioClase: true,
      schedules: { select: { id: true, name: true, day: true, startTime: true, endTime: true } },
      studentUsers: { select: { student: { select: { id: true, email: true, names: true } } } },
      teacherUsers: { select: { teacher: { select: { id: true, email: true, names: true } } } }
    }
  })

  if (!classData) {
    return NextResponse.json({ error: 'No se encontró la clase' }, { status: 404 })
  }
  const respClass = classData.map((item) => ({
    ...item,
    schedules: item.schedules.map((schedule) => ({ ...schedule })),
    studentUsers: {
      ...item.studentUsers.find((s) => s.student.id === id)?.student,
      view: item.studentUsers.some((s) => s.student.id === id)
    },
    teacherUsers: {
      ...item.teacherUsers.find((t) => t.teacher.id === id)?.teacher,
      view: item.teacherUsers.some((t) => t.teacher.id === id)
    }
  }))

  return NextResponse.json(respClass)
}
