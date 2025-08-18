import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma'

export async function GET(request: NextRequest) {
  const user_id = request.nextUrl.pathname.split('/')[4]
  try {
    const user = await prisma.users.findUnique({
      where: { id: user_id },
      include: { role: { select: { name: true } } }
    })
    if (!user) return NextResponse.json({ message: 'No se encontró el usuario' })

    const userFinal = {
      email: user?.email,
      names: user?.names,
      lastnames: user?.lastnames,
      birthday: user.birthday,
      age: user?.age,
      phone: user?.phone,
      role: user?.role?.name
    }
    return NextResponse.json(userFinal)
  } catch (error) {
    return NextResponse.json({ message: 'Hubo un error', error: error }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/')[4]

    if (!id) {
      return NextResponse.json(
        { message: 'Error no se proporciono el id del usuario' },
        { status: 400 }
      )
    }
    const existeUsuario = await prisma.users.findFirst({ where: { id } })
    if (!existeUsuario) return NextResponse.json({ message: 'No existe el usuario' })
    const eliminarUsuario = await prisma?.users.delete({ where: { id } })
    if (!eliminarUsuario) return NextResponse.json({ message: 'No se pudo eliminar el usuario' })
    if (eliminarUsuario) return NextResponse.json({ message: 'Se elimino el usuario' })
  } catch (error) {
    return NextResponse.json({ message: 'Hubo un error', error: error }, { status: 500 })
  }
}
