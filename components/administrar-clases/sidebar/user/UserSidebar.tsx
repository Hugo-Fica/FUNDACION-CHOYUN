import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger
} from '@/components/ui/sidebar'

export const UserSidebar = () => {
  return (
    <Sidebar
      collapsible='icon'
      side='left'
      className='h-[20rem] mt-[4rem]'>
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className='bg-purple-500'></SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}
