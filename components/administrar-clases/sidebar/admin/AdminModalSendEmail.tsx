import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  Dialog,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useScheduleClass } from '@/hooks/useScheduleClass'
import { sendEmailClass } from '@/utils/emails'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  asunto: z.string().min(5, { message: 'El asunto del correo es obligatorio' }),
  contenido: z.string().min(5, { message: 'El contenido del correo es obligatorio' }),
  adjunto: z.string().optional()
})

type Props = {
  classId: string
}

export const AdminModalSendEmail = ({ classId }: Props) => {
  const [open, setOpen] = useState(false)
  const { getClassById } = useScheduleClass()
  const handleModal = () => setOpen(!open)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asunto: '',
      contenido: '',
      adjunto: ''
    }
  })

  const { data, isPending } = useQuery({
    queryKey: ['getClassByIdForEmail'],
    queryFn: () => getClassById(classId)
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!data?.editClass) return
    const { success } = await sendEmailClass({
      asunto: values.asunto,
      contenido: values.contenido,
      emails: data.editClass.studentUsers.map((student) => student.email),
      nombreClass: data.editClass.name,
      profesor: data.editClass.teacherUsers[0].names.toUpperCase(),
      adjunto: values.adjunto
    })
    if (success) {
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
                <p>Enviar correo a la clase</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>Plantilla para enviar correo con asuntos, contenidos y adjuntos</p>
              </TooltipContent>
            </Tooltip>
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-5xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Enviar correo a la clase</DialogTitle>
            <DialogDescription>
              Interfaz para el envío de correos a la clase, permitiendo definir el asunto, redactar
              el contenido y adjuntar archivos opcionales.
            </DialogDescription>
          </DialogHeader>
          {isPending ? (
            <Loader2 className='animate-spin' />
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid md:grid-cols-2 xs:grid-cols-1 gap-4'>
                  <FormField
                    control={form.control}
                    name='asunto'
                    render={({ field }) => (
                      <FormItem className='col-span-full'>
                        <FormLabel>Asunto del correo</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Asunto del correo'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='contenido'
                    render={({ field }) => (
                      <FormItem className='col-span-full'>
                        <FormLabel>Contenido del correo</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='Contenido del correo'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{' '}
                  <FormField
                    control={form.control}
                    name='adjunto'
                    render={({ field }) => (
                      <FormItem className='col-span-full'>
                        <FormLabel>URL del documento adjunto</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='URL del documento adjunto'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className='flex mt-3 flex-row w-full gap-5 justify-center'>
                  <Button
                    type='button'
                    variant='ghost'
                    className='w-full'
                    //   disabled={isPending}
                    onClick={handleModal}>
                    {/* {isPending && <Loader2 className='animate-spin' />} */}
                    Cancelar
                  </Button>
                  <Button
                  //   className={`${
                  //     isPending
                  //       ? 'bg-blue-500/50 hover:bg-blue-700/50'
                  //       : 'bg-blue-500 hover:bg-blue-700'
                  //   }   w-full`}
                  //   disabled={isPending}
                  >
                    {/* {isPending && <Loader2 className='animate-spin' />} */}
                    Envíar correo
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
