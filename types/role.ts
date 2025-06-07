import { BaseModel } from './global'
import { UserMongo } from './user'

export type RoleMongo = BaseModel & {
  name: string
  description: string
  users: UserMongo[]
}

export type CreateRoleRequest = {
  name: string
  description: string
}

export type UpdateRoleRequest = {
  name?: string
  description?: string
}

export type Role = {
  id: string
  name: string
  description: string
}

export type RolesStore = {
  roles: Role[]
  setRoles: (roles: Role[]) => void
}
