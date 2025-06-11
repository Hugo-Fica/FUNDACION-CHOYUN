'use client'

import { useRoles } from '@/hooks/useRoles'
import { useUsers } from '@/hooks/useUsers'
import { useRolesStore } from '@/store/useRolesStore'
import { useUserStore } from '@/store/useUserStore'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()
export function ClientProviders({ children }: { children: React.ReactNode }) {
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
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position='top-center'
        expand={false}
        richColors
        closeButton
      />
      {children}
    </QueryClientProvider>
  )
}
