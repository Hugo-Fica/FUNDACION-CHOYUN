import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger
} from '@/components/ui/sidebar'

export const LeftSidebarCalendar = () => {
  return (
    <Sidebar
      className='fixed top-16 h-[87.8%] '
      side='left'
      collapsible='icon'>
      <SidebarHeader className='bg-cyan-500'>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className='bg-red-500'>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className='bg-cyan-500'></SidebarFooter>
    </Sidebar>
  )
}
