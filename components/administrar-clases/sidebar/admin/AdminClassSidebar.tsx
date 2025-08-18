'use client'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar
} from '@/components/ui/sidebar'
import { BookPlus } from 'lucide-react'
import { AdminAddScheduleModal } from './AdminAddScheduleModal'
import { useQuery } from '@tanstack/react-query'
import { useScheduleClass } from '@/hooks/useScheduleClass'
import { AdminAddClassModal } from './AdminAddClassModal'
import { useScheduleStore } from '@/store/useScheduleStore'
import { useEffect } from 'react'
import { AdminAddTeacherAndStudent } from './AdminAddTeacherAndStudent'
import { AdminTableModalClass } from './AdminTableModalClass'

export const AdminClassSidebar = () => {
  const { open, toggleSidebar } = useSidebar()
  const { setSchedules } = useScheduleStore((state) => state)
  const { getScheduleClass } = useScheduleClass()

  const { data: dataSchedules, isPending: isPendingSchedules } = useQuery({
    queryKey: ['getScheduleClass'],
    queryFn: getScheduleClass
  })

  useEffect(() => {
    if (dataSchedules?.data) {
      setSchedules(dataSchedules.data)
    }
  }, [dataSchedules, isPendingSchedules, setSchedules])
  return (
    <Sidebar
      className='fixed top-16 h-scree z-[9]'
      side='right'
      collapsible='icon'>
      <SidebarHeader className='z-[9]'>
        <Button
          onClick={toggleSidebar}
          className={`${open ? '' : 'border border-black hover:bg-black hover:bg-opacity-5'} `}
          variant='ghost'>
          {open ? (
            <>
              <BookPlus className='text-black w-4 h-4' />
              <span className='text-black'>Administrador de Clases</span>
            </>
          ) : (
            <BookPlus className='text-black w-4 h-4' />
          )}
        </Button>
      </SidebarHeader>
      <SidebarContent className='z-[9]'>
        <SidebarGroup
          title='Crear horarios'
          className='gap-3'>
          <AdminAddScheduleModal sidebarState={open} />
        </SidebarGroup>
        <SidebarGroup
          title='Crear clases'
          className='gap-3'>
          <AdminAddClassModal sidebarState={open} />
        </SidebarGroup>
        <SidebarGroup
          title='Ver clases'
          className='gap-3'>
          <AdminTableModalClass sidebarState={open} />
        </SidebarGroup>
        <SidebarGroup
          title='Asignar profesores y estudiantes'
          className='gap-3'>
          <AdminAddTeacherAndStudent sidebarState={open} />
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className='' />
    </Sidebar>
  )
}
