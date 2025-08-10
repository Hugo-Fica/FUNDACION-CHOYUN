'use server'

import { Resend } from 'resend'
import { OtpUser } from '../components/mail/otp/OtpUser'
import { WelcomClass } from '@/components/mail/class/WelcomClass'
import { CreateClassRequest, TClass } from '@/types/class'
import { EmailsClass } from '@/components/mail/class/EmailsClass'

if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY no está configurada en las variables de entorno')
}

// Inicializa Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY || '')

function formatDate(date: Date | undefined) {
  if (!date) {
    return ''
  }
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

export const sendOtpMail = async (
  user: string,
  email: string,
  timeExpires: string,
  code: string,
  token: string
) => {
  try {
    await resend.emails.send({
      from: 'Fundación Choyün <no-reply@fundacionchoyun.cl>',
      to: email,
      subject: 'Verifica tu cuenta en Fundación Choyün',
      react: OtpUser({ user, timeExpires, code, token })
    })
    return { succes: true }
  } catch (error) {
    return { succes: false }
  }
}

export const sendWelcomeClassMail = async ({ data }: { data: TClass | null }) => {
  if (!data) return { succes: false }
  const emails = [
    ...data.teacherUsers.map((teacher) => teacher.email),
    ...data.studentUsers.map((student) => student.email)
  ]
  try {
    await resend.emails.send({
      from: 'Fundación Choyün <no-reply@fundacionchoyun.cl>',
      to: emails,
      subject: 'Bienvenido a tu clase en Fundación Choyün',
      react: WelcomClass({
        nameClass: data.name,
        startDate: formatDate(new Date(data.fechaInicioClase)),
        teacherName: data.teacherUsers[0].names
      })
    })
    return { succes: true }
  } catch (error) {
    return { succes: false }
  }
}

export const sendEmailClass = async ({
  asunto,
  contenido,
  emails,
  nombreClass,
  profesor,
  adjunto
}: {
  asunto: string
  contenido: string
  emails: string[]
  nombreClass: string
  profesor: string
  adjunto?: string
}) => {
  if (!asunto || !contenido || !emails || !nombreClass || !profesor) return { success: false }
  try {
    await resend.emails.send({
      from: 'Fundación Choyün <no-reply@fundacionchoyun.cl>',
      to: emails,
      subject: asunto,
      react: EmailsClass({
        nombreClase: nombreClass,
        contenido,
        profesor,
        urlContenido: adjunto
      })
    })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
