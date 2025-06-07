import { BaseModel } from './global'
import { UserMongo } from './user'

export type OtpMongo = BaseModel & {
  code: string
  expiresAt: Date
  createAt: Date
  user_id: string
  user: UserMongo
  token: string
}

export type CreateOtpRequest = {
  code: string
  expiresAt: Date
  user_id: string
  token: string
}
