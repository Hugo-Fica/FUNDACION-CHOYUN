import { BaseModel } from './global'
import { ClassMogno } from './class'
import { UserMongo } from './user'

export type TeacherInClassMogno = BaseModel & {
  teacherId: string
  teacher: UserMongo
  classId: string
  class: ClassMogno
}

export type AddTeacherRequest = {
  teacherId: string
}
