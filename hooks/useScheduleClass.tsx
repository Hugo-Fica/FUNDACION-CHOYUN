import { CreateScheduleRequest, ScheduleMongo } from '@/types/schedule'
import axios, { AxiosError } from 'axios'
import {
  ClassAPI,
  ClassUserAPI,
  CreateClassRequest,
  TClass,
  UpdateClassRequest
} from '../types/class'
import { StudentsTeachersClass } from '../types/schedule'

export const useScheduleClass = () => {
  const getScheduleClass = async () => {
    try {
      const { data } = await axios.get('/api/protected/schedule')

      return {
        data: data as ScheduleMongo[],
        message: 'Lista de horarios cargada'
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response && err.response.data && err.response.data.message) {
        return {
          message: err.response.data.message,
          data: null
        }
      } else {
        return {
          message: 'Error desconocido',
          data: null
        }
      }
    }
  }
  const postScheduleClass = async (schedule: CreateScheduleRequest) => {
    try {
      const { data } = await axios.post('/api/protected/schedule', schedule)

      return {
        message: data.message as string
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response && err.response.data && err.response.data.message) {
        return {
          message: err.response.data.message
        }
      } else {
        return {
          message: 'Error desconocido'
        }
      }
    }
  }
  const getClass = async () => {
    try {
      const { data } = await axios.get('/api/protected/class')
      return {
        data: data.classChoyun as ClassAPI[],
        message: 'Lista de clases cargada'
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response && err.response.data && err.response.data.message) {
        return {
          message: err.response.data.message,
          data: null
        }
      } else {
        return {
          message: 'Error desconocido',
          data: null
        }
      }
    }
  }
  const getClassById = async (classId: string) => {
    try {
      const { data } = await axios.get(`/api/protected/class/${classId}`)
      return { editClass: data as TClass }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response && err.response.data && err.response.data.message) {
        return {
          editClass: null
        }
      } else {
        return {
          editClass: null
        }
      }
    }
  }
  const postClass = async (classSchedule: CreateClassRequest) => {
    try {
      const { data } = await axios.post('/api/protected/class', classSchedule)

      return {
        message: data.message as string
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response && err.response.data && err.response.data.message) {
        return {
          message: err.response.data.message
        }
      } else {
        return {
          message: 'Error desconocido'
        }
      }
    }
  }
  const getStudentsTeachersClass = async (classId: string) => {
    try {
      const { data } = await axios.get(`/api/protected/class/${classId}`)
      return { userClass: data as StudentsTeachersClass, message: 'Lista de alumnos cargada' }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response && err.response.data && err.response.data.message) {
        return {
          userClass: null,
          message: err.response.data.message
        }
      } else {
        return {
          userClass: null,
          message: 'Error desconocido'
        }
      }
    }
  }
  const postAddStudentClass = async (classData: { classId: string; studentId: string[] }) => {
    try {
      const { data } = await axios.post(`/api/protected/class/${classData.classId}/student`, {
        studentId: classData.studentId
      })
      return {
        ok: true,
        message: data.message as string
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response && err.response.data && err.response.data.message) {
        return {
          ok: false,
          message: err.response.data.message
        }
      } else {
        return {
          ok: false,
          message: 'Error desconocido'
        }
      }
    }
  }
  const postAddTeacherClass = async (classData: { classId: string; teacherId: string[] }) => {
    try {
      const { data } = await axios.post(`/api/protected/class/${classData.classId}/teacher`, {
        teacherId: classData.teacherId
      })
      return {
        ok: true,
        message: data.message as string
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response && err.response.data && err.response.data.message) {
        return {
          ok: false,
          message: err.response.data.message
        }
      } else {
        return {
          ok: false,
          message: 'Error desconocido'
        }
      }
    }
  }
  const deleteClass = async (classId: string) => {
    try {
      const { data } = await axios.delete(`/api/protected/class/${classId}`)
      return {
        ok: true,
        message: data.message
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response && err.response.data && err.response.data.message) {
        return {
          ok: false,
          message: err.response.data.message
        }
      } else {
        return {
          ok: false,
          message: 'Error desconocido'
        }
      }
    }
  }
  const putClass = async (classData: { id: string; classUpdate: UpdateClassRequest }) => {
    try {
      const { data } = await axios.put(
        `/api/protected/class/${classData.id}`,
        classData.classUpdate
      )
      return {
        ok: true,
        message: data.message
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      if (err.response && err.response.data && err.response.data.message) {
        return {
          ok: false,
          message: err.response.data.message
        }
      } else {
        return {
          ok: false,
          message: 'Error desconocido'
        }
      }
    }
  }
  const getClassByUserId = async (userId: string) => {
    const { data } = await axios.get(`/api/protected/class/user/${userId}`)

    return data as ClassUserAPI[]
  }
  return {
    getScheduleClass,
    postScheduleClass,
    getClass,
    postClass,
    postAddStudentClass,
    postAddTeacherClass,
    getStudentsTeachersClass,
    deleteClass,
    getClassById,
    putClass,
    getClassByUserId
  }
}
