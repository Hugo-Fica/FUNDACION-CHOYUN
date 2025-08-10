import { BaseModel } from './global'
import { ScheduleAPI, ScheduleMongo } from './schedule'
import { StudentInClassMongo } from './student'
import { TeacherInClassMogno } from './teacher'

export type ClassMogno = BaseModel & {
  name: string
  description?: string | null
  scheduleIds: string[]
  schedules: ScheduleMongo[]
  teacherUsers: TeacherInClassMogno[]
  studentUsers: StudentInClassMongo[]
}

export type CreateClassRequest = {
  name: string
  description?: string
  schedules?: string[]
  duration: number
  color: string
  fechaInicioClase: string
}
export type TClass = {
  id: string
  name: string
  description: string
  color: string
  duration: number
  fechaInicioClase: Date
  schedules: string[]
  studentUsers: TUserClass[]
  teacherUsers: TUserClass[]
  students: number
  teachers: number
}

export type UpdateClassRequest = {
  name?: string
  description?: string
  scheduleIds?: string[]
  color?: string
  duration?: number
  fechaInicioClase?: string
}
export type TUserClass = {
  id: string
  email: string
  names: string
}
export type ClassAPI = {
  id: string
  name: string
  description: string
  color: string
  duration: number
  schedules: ScheduleAPI[]
  teacherUsers: TUserClass[]
  studentUsers: TUserClass[]
  fechaInicioClase: string
}
