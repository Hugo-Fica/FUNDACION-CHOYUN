import { Role } from '@/types/role'
import axios from 'axios'

export const useRoles = () => {
  const getRoles = async () => {
    try {
      const { data } = await axios.get('/api/protected/roles')

      return data.roles as Role[]
    } catch (error) {
      console.log(error)
      return null
    }
  }
  return { getRoles }
}
