import { ClassAPI } from './class'
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
  dayId?: string
  classIds?: string[]
}

export type ScheduleAPI = {
  id: string
  name: string
  day: string
  startTime: string
  endTime: string
}

type userClass = {
  id: string
  names: string
  lastnames: string
}

export type StudentsTeachersClass = {
  id: string
  student: userClass[]
  teacher: userClass[]
}

export type ScheduleStore = {
  schedules: ScheduleMongo[] | null
  setSchedules: (schedules: ScheduleMongo[]) => void
  classes: ClassAPI[] | null
  setClasses: (classes: ClassAPI[]) => void
}
