export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className='w-full h-full'>{children}</main>
    </>
  )
}
