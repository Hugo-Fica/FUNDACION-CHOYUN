export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className='w-full h-full'>{children}</main>
    </>
  )
}
