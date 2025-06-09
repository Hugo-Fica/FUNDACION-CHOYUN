import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma'

export async function GET() {
  try {
    const roles = await prisma.roles.findMany()
    if (roles.length < 1) return NextResponse.json({ message: 'No se encontraron roles' })
    return NextResponse.json({ roles: roles })
  } catch (error) {
    return NextResponse.json({ message: 'Hubo un error', error: error }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json()
    if (!name || !description) {
      return NextResponse.json(
        { message: 'Error no se proporciono el nombre o descripción del rol' },
        { status: 400 }
      )
    }
    const existeRol = await prisma.roles.findFirst({ where: { name } })
    if (existeRol) return NextResponse.json({ message: 'Ya existe el rol' })
    const nuevoRol = await prisma?.roles.create({
      data: { name, description }
    })
    if (nuevoRol) return NextResponse.json({ message: 'Rol creado', id_role: nuevoRol.id })
  } catch (error) {
    return NextResponse.json({ message: 'Hubo un error', error: error }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, description } = await req.json()
    if (!id || !name || !description) {
      return NextResponse.json(
        { message: 'Error no se proporciono el nombre o descripción del rol' },
        { status: 400 }
      )
    }
    const existeRol = await prisma.roles.findFirst({ where: { id } })
    if (!existeRol) return NextResponse.json({ message: 'No existe el rol' })
    const editarRol = await prisma?.roles.update({
      where: { id },
      data: { name, description }
    })
    if (!editarRol) return NextResponse.json({ message: 'No se pudo actualizar el rol' })
    if (editarRol) return NextResponse.json({ message: 'Se actualizo el rol' })
  } catch (error) {
    return NextResponse.json({ message: 'Hubo un error', error: error }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json(
        { message: 'Error no se proporciono el id del rol' },
        { status: 400 }
      )
    }
    const existeRol = await prisma.roles.findFirst({ where: { id } })
    if (!existeRol) return NextResponse.json({ message: 'No existe el rol' })
    const eliminarRol = await prisma?.roles.delete({ where: { id } })
    if (!eliminarRol) return NextResponse.json({ message: 'No se pudo eliminar el rol' })
    if (eliminarRol) return NextResponse.json({ message: 'Se elimino el rol' })
  } catch (error) {
    return NextResponse.json({ message: 'Hubo un error', error: error }, { status: 500 })
  }
}
