import jwt from 'jsonwebtoken'
import { jwtVerify, SignJWT } from 'jose'

export const generarToken = (user_id: string, role_id: string, exp: '1s' | '300s' | '7d') => {
  const token = jwt.sign({ user_id, role_id }, process.env.SECRET_KEY!, { expiresIn: exp })
  return token
}

export const validarToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as {
      user_id: string
      role_id: string
    }
    return decoded
  } catch (error) {
    return null
  }
}

const getSecretKey = () => {
  const secret = process.env.SECRET_KEY
  if (!secret) {
    throw new Error('SECRET_KEY no está definida en las variables de entorno')
  }
  return new TextEncoder().encode(secret)
}

// Genera un token JWT compatible con Edge Runtime
export async function generarTokenEdge(
  user_id: string,
  role_id: string,
  exp: '1s' | '300s' | '7d'
) {
  const expirationTime = {
    '1s': '1 second',
    '300s': '5 minutes',
    '7d': '7 days'
  }[exp]

  const token = await new SignJWT({ user_id, role_id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(await getSecretKey())

  return token
}

// Valida un token JWT en Edge Runtime
export async function validarTokenEdge(token: string) {
  try {
    const { payload } = await jwtVerify(token, await getSecretKey())

    // Verificamos que el payload contenga los campos necesarios
    if (typeof payload.user_id !== 'string' || typeof payload.role_id !== 'string') {
      console.error('Token no contiene los campos requeridos')
      return null
    }

    return {
      user_id: payload.user_id as string,
      role_id: payload.role_id as string,
      exp: payload.exp as number
    }
  } catch (error) {
    console.error('Error al validar token en Edge Runtime:', error)
    return null
  }
}
