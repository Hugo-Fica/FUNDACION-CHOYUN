'use server'

import { Resend } from 'resend'
import { OtpUser } from '../components/mail/otp/opt_user'

if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY no está configurada en las variables de entorno')
}

// Inicializa Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY || '')

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
