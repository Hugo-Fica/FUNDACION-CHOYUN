import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma'
import dayjs from 'dayjs'
import { generateOTP } from '@/utils/otp'
import { generarToken } from '@/utils/auth'

export async function GET() {
  try {
    const usuarios = await prisma.users.findMany({
      include: { role: { select: { name: true } } }
    })
    if (usuarios.length < 1) return NextResponse.json({ message: 'No se encontraron usuarios' })
    const usuariosFinal = usuarios.map(({ password, role_id, ...u }) => {
      const adjustedDate = dayjs(u?.birthday).add(4, 'hour')
      const formattedBirthday = adjustedDate.format('DD/MM/YYYY')
      return {
        ...u,
        role: u.role?.name,
        birthday: formattedBirthday
      }
    })
    return NextResponse.json({ usuarios: usuariosFinal })
  } catch (error) {
    return NextResponse.json({ error: 'Hubo un error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, names, lastnames, age, phone, role_id, birthday } = await req.json()
    if (!email || !names || !lastnames || !age || !phone || !role_id || !birthday) {
      return NextResponse.json(
        {
          message:
            'Error no se proporciono el nombres o apellidos o contraseña o edad o número de celular o el rol del usuario'
        },
        { status: 400 }
      )
    }
    const emailString = String(email).trim().toLocaleLowerCase()
    const existeUsuario = await prisma.users.findFirst({ where: { email: emailString } })
    if (existeUsuario)
      return NextResponse.json({ message: 'El correo electrónico ya se encuentra registrado' })

    const expiresAt = dayjs().add(5, 'minute').toDate()
    const nuevoUsuario = await prisma?.users.create({
      data: {
        email: emailString,
        names,
        lastnames,
        age,
        phone,
        role_id,
        birthday: new Date(birthday),
        updatedAt: new Date()
      }
    })
    if (nuevoUsuario) {
      await prisma.otp.deleteMany({ where: { user_id: nuevoUsuario?.id } })
      const token = generarToken(nuevoUsuario?.id, nuevoUsuario?.role_id, '300s')
      const userOtp = await prisma.otp.create({
        data: {
          code: generateOTP(),
          expiresAt,
          user_id: nuevoUsuario?.id,
          token
        }
      })
      return NextResponse.json({ message: 'Usuario creado', otp: userOtp })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Hubo un error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, email, names, lastnames, phone, role, age, birthday } = await req.json()
    if (!id) {
      return NextResponse.json(
        { message: 'Error no se proporciono el id del usuario' },
        { status: 400 }
      )
    }
    const existeUsuario = await prisma.users.findFirst({ where: { id } })
    if (!existeUsuario) return NextResponse.json({ message: 'No existe el usuario' })

    const editarUsuario = await prisma?.users.update({
      where: { id },
      data: { email, names, lastnames, phone, role_id: role, age, birthday }
    })

    if (!editarUsuario) return NextResponse.json({ message: 'No se pudo actualizar el usuario' })
    if (editarUsuario) return NextResponse.json({ message: 'Se actualizo el usuario' })
  } catch (error) {
    return NextResponse.json({ message: 'Hubo un error', error: error }, { status: 500 })
  }
}
