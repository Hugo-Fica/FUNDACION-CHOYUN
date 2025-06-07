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
  scheduleIds?: string[]
}

export type UpdateClassRequest = {
  name?: string
  description?: string
  scheduleIds?: string[]
}

export type ClassAPI = {
  id: string
  name: string
  description: string
  schedules: ScheduleAPI[]
  teacherUsers: any[]
  studentUsers: any[]
}
