import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma'
import bcrypt from 'bcrypt'
import { generarToken } from '@/utils/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Error no se proporciono el correo electrónico o la contraseña' },
        { status: 400 }
      )
    }
    const emailString = String(email).trim().toLocaleLowerCase()
    const usuario = await prisma.users.findFirst({ where: { email: emailString } })
    if (!usuario)
      return NextResponse.json({ message: 'El correo electrónico no existe' }, { status: 400 })
    if (!usuario.password)
      return NextResponse.json({ message: 'Error en las credenciales' }, { status: 400 })
    const isValidPassword = bcrypt.compare(password, usuario.password)
    if (!isValidPassword)
      return NextResponse.json(
        {
          message: 'El correo electrónico o la contraseña no son correctos'
        },
        { status: 400 }
      )
    const token = generarToken(usuario.id, usuario.role_id, '7d')
    const response = NextResponse.json({ message: `Bienvenido ${usuario.names}`, token })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax'
    })

    return response
  } catch (error) {
    return NextResponse.json({ message: 'Hubo un error', error: error }, { status: 500 })
  }
}
