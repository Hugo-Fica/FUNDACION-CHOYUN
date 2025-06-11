'use client'

import { useRoles } from '@/hooks/useRoles'
import { useUsers } from '@/hooks/useUsers'
import { useRolesStore } from '@/store/useRolesStore'
import { useUserStore } from '@/store/useUserStore'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { getUsers } = useUsers()
  const { getRoles } = useRoles()
  const setUsers = useUserStore((state) => state.setUsers)
  const setRoles = useRolesStore((state) => state.setRoles)

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  })

  const { data: roleData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles
  })

  useEffect(() => {
    if (usersData) setUsers(usersData)
  }, [isLoadingUsers, usersData, setUsers])

  useEffect(() => {
    if (roleData) setRoles(roleData)
  }, [isLoadingRoles, roleData, setRoles])
  return <div>{children}</div>
}
