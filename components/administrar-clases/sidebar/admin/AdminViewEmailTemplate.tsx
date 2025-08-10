import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useScheduleClass } from '@/hooks/useScheduleClass'
import { sendWelcomeClassMail } from '@/utils/emails'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AdminModalSendEmail } from './AdminModalSendEmail'

type Props = {
  classId: string
}

export const AdminViewEmailTemplate = ({ classId }: Props) => {
  const [open, setOpen] = useState(false)
  const { getClassById } = useScheduleClass()

  const { isPending: isPendingClass, data } = useQuery({
    queryKey: ['getClassByIdForEmail'],
    queryFn: () => getClassById(classId)
  })

  const handleModal = () => setOpen(!open)

  const sendEmailWelcomeClass = async () => {
    if (!data?.editClass) return
    const { succes } = await sendWelcomeClassMail({ data: data?.editClass })
    if (succes) {
      toast.success('Correo enviado exitosamente')
      handleModal()
    } else {
      toast.error('Error al enviar el correo')
    }
  }
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={handleModal}>
        <DialogTrigger asChild>
          <Button variant='ghost'>
            <Tooltip>
              <TooltipTrigger>
                <Send
                  size={16}
                  className='text-blue-600'
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Plantilla para enviar correos de la clase</p>
              </TooltipContent>
            </Tooltip>
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-5xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Plantilla de correos</DialogTitle>
            <DialogDescription>
              Ventana para realizar envio de correos de incio de clase y de contenido. ademas de
              poder escribir en ellos.
            </DialogDescription>
          </DialogHeader>
          <div className='grid grid-cols-4 gap-4'>
            {data?.editClass?.fechaInicioClase &&
              new Date(data.editClass.fechaInicioClase) > new Date() && (
                <Button
                  onClick={sendEmailWelcomeClass}
                  variant='ghost'
                  disabled={isPendingClass}>
                  {isPendingClass ? (
                    <p>
                      <Loader2 className='animate-spin' />
                      Enviando...
                    </p>
                  ) : (
                    'Enviar correo de inicio de clase'
                  )}
                </Button>
              )}
            <AdminModalSendEmail classId={classId} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
