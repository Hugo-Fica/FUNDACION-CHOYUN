import { BaseModel } from './global'
import { ClassMogno } from './class'
import { UserMongo } from './user'

export type StudentInClassMongo = BaseModel & {
  studentId: string
  student: UserMongo
  classId: string
  class: ClassMogno
}

export type AddStudentRequest = {
  studentId: string
}
