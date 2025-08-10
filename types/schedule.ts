import { ClassAPI, TUserClass } from './class'
import { BaseModel } from './global'
import { StudentInClassMongo } from './student'

export type ScheduleMongo = BaseModel & {
  startTime: string
  endTime: string
  name: string
  day: string
  classIds: string[]
  classes: StudentInClassMongo[]
}
export type CreateScheduleRequest = {
  startTime: string
  endTime: string
  day: string
  name: string
}

export type UpdateScheduleRequest = {
  startTime?: string
  endTime?: string
  day?: string
  classIds?: string[]
}

export type ScheduleAPI = {
  id: string
  name: string
  day: string
  startTime: string
  endTime: string
}
export type StudentsTeachersClass = {
  id: string
  name: string
  description: string
  color: string
  duration: number
  schedules: string[]
  studentUsers: TUserClass[]
  teacherUsers: TUserClass[]
}

export type ScheduleStore = {
  schedules: ScheduleMongo[] | null
  setSchedules: (schedules: ScheduleMongo[]) => void
  classes: ClassAPI[] | null
  setClasses: (classes: ClassAPI[]) => void
}
