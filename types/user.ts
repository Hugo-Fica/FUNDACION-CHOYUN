import { BaseModel } from './global'
import { OtpMongo } from './opt'
import { RoleMongo } from './role'
import { StudentInClassMongo } from './student'
import { TeacherInClassMogno } from './teacher'

export type UserMongo = BaseModel & {
  email: string
  names?: string | null
  lastnames?: string | null
  password?: string | null
  birthday?: Date | null
  age?: number | null
  phone?: string | null
  valid: boolean
  role_id: string
  role: RoleMongo
  otp?: OtpMongo | null
  teacherClasses?: TeacherInClassMogno[]
  studentClasses?: StudentInClassMongo[]
}
export type CreateUserRequest = {
  email: string
  names?: string
  lastnames?: string
  password?: string
  birthday?: string | Date
  age?: number
  phone?: string
  role_id: string
}

export type UpdateUserRequest = {
  email?: string
  names?: string
  lastnames?: string
  password?: string
  birthday?: string | Date
  age?: number
  phone?: string
  valid?: boolean
  role_id?: string
}
export type User = {
  id: string
  email: string
  names: string
  lastnames: string
  birthday: string
  age: number
  phone: string
  role: string
  valid?: boolean
}

export type NewUser = {
  email: string
  names: string
  lastnames: string
  age: number
  birthday: string
  phone: string
  role_id: string
}

export type UserStore = {
  users: User[] | null
  setUsers: (users: User[]) => void
}
