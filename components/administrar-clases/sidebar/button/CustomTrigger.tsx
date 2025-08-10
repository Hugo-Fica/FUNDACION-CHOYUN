'use client'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

type Props = {
  admin?: 'Usuario' | 'Clase'
}

export const CustomTrigger = ({ admin }: Props) => {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      className={``}
      onClick={toggleSidebar}>
      {admin}
    </Button>
  )
}
