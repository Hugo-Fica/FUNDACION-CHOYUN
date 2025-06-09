'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useScheduleClass } from '@/hooks/useScheduleClass'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  classId: string
}

export const AdminDeleteClassModal = ({ open, setOpen, classId }: Props) => {
  const { deleteClass } = useScheduleClass()
  const queryClient = useQueryClient()
  const handleModal = () => {
    setOpen(!open)
  }

  const { isPending } = useMutation({
    mutationKey: ['deleteClass'],
    mutationFn: deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  })

  const deleteClassHandler = async () => {
    const isDeleted = await deleteClass(classId)
    if (isDeleted) {
      toast.success(isDeleted.message)
      setOpen(false)
    } else {
      toast.error('Error al eliminar el clase')
    }
  }
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={handleModal}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Eliminar clase</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta clase?, esto eliminará a todos los usuarios
              de la clase.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className=''>
            <Button
              className='mt-3 bg-red-500 hover:bg-red-700'
              onClick={deleteClassHandler}
              disabled={isPending}>
              {isPending && <Loader2 className='animate-spin' />}
              Eliminar clase
            </Button>
            <Button
              variant='ghost'
              className='mt-3'
              onClick={() => setOpen(false)}
              disabled={isPending}>
              {isPending && <Loader2 className='animate-spin' />} Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
