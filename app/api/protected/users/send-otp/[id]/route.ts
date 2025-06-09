import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma'
import dayjs from 'dayjs'
import { generarToken } from '@/utils/auth'
import { generateOTP } from '@/utils/otp'

export async function POST(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split('/')[5]

    if (!id) {
      return NextResponse.json(
        {
          message: 'Error no se proporciono el id del usuario'
        },
        { status: 400 }
      )
    }
    const expiresAt = dayjs().add(5, 'minute').toDate()
    const existsUser = await prisma?.users.findFirst({ where: { id } })
    if (existsUser) {
      await prisma.otp.deleteMany({ where: { user_id: existsUser?.id } })
      const token = generarToken(existsUser?.id, existsUser?.role_id, '300s')
      const userOtp = await prisma.otp.create({
        data: {
          code: generateOTP(),
          expiresAt,
          user_id: existsUser?.id,
          token
        }
      })
      return NextResponse.json({ message: 'Código de verificación creado', otp: userOtp })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Hubo un error' }, { status: 500 })
  }
}
