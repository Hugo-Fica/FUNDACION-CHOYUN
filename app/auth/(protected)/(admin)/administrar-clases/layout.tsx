import { CustomTrigger } from '@/components/administrar-clases/sidebar/button/CustomTrigger'
import { LeftSidebarCalendar } from '@/components/administrar-clases/sidebar/LeftSidebarCalendar'
import { AdminClassSidebar } from '@/components/administrar-clases/sidebar/admin/AdminClassSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function AdminClassLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className='md:min-h-[95%]'>
      <LeftSidebarCalendar />
      <SidebarInset className='bg-purple-500'>
        <div className='bg-green-500 w-full'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
