import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function AdminClassLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className='md:min-h-[95%]'>
      <SidebarInset className='bg-purple-500'>
        <div className='bg-green-500 w-full'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
