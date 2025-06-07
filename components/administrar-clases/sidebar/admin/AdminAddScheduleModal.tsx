'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { CalendarPlus, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import 'dayjs/locale/es'
import { HourPicker } from '@/components/HourPicker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useUserAuthStore } from '@/store/userAuthStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useScheduleClass } from '@/hooks/useScheduleClass'
import { toast } from 'sonner'

type Props = {
  sidebarState: boolean
}
dayjs.locale('es')

const formSchema = z.object({
  day: z.string().min(5, { message: 'El nombre del día es obligatorio' }),
  startTime: z.string().min(5, { message: 'EL hora de inicio es obligatoria' }),
  endTime: z.string().min(5, { message: 'EL hora de fin es obligatoria' }),
  name: z.string()
})

const days: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export const AdminAddScheduleModal = ({ sidebarState }: Props) => {
  const role = useUserAuthStore((state) => state.user?.role)
  const queryCLient = useQueryClient()
  const { postScheduleClass } = useScheduleClass()
  const [open, setOpen] = useState(false)

  const handleModal = () => {
    setOpen(!open)
    form.reset()
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      day: '',
      startTime: '',
      endTime: '',
      name: ''
    }
  })

  const { mutateAsync: postScheduleClassAsync, isPending } = useMutation({
    mutationKey: ['createSchedule'],
    mutationFn: postScheduleClass,
    onSuccess: () => {
      queryCLient.invalidateQueries()
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const isPosted = await postScheduleClassAsync({
      ...values,
      name: `${values.day} | ${values.startTime} - ${values.endTime}`
    })

    if (isPosted) {
      toast.success('Horario creado exitosamente')

      form.reset()
      setOpen(false)
    } else {
      toast.error('Error al crear el Horario')
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={handleModal}>
        <DialogTrigger asChild>
          <Button
            className={`${
              sidebarState ? '' : 'border border-black hover:bg-black hover:bg-opacity-5'
            } `}
            variant='ghost'
            disabled={role?.includes('user')}>
            {sidebarState ? (
              <>
                <CalendarPlus className='text-black w-4 h-4' />
                <span>Crear hora de clase</span>
              </>
            ) : (
              <CalendarPlus className='text-black w-4 h-4' />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Crear nueva hora de clase</DialogTitle>
            <DialogDescription>
              Completa los campos para agregar una nueva hora de clase
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid md:grid-cols-2 xs:grid-cols-1 gap-4'>
                <FormField
                  control={form.control}
                  name='day'
                  render={({ field }) => (
                    <FormItem className='col-span-full'>
                      <FormLabel>Día</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Selecciona un día' />
                          </SelectTrigger>
                          <SelectContent className='h-[15rem]'>
                            {days.map((h) => (
                              <SelectItem
                                key={h}
                                value={h}>
                                {h}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='startTime'
                  render={({ field }) => (
                    <FormItem className='xs:col-span-full md:col-span-1'>
                      <FormLabel>Hora inicio</FormLabel>
                      <FormControl>
                        <HourPicker onTimeChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='endTime'
                  render={({ field }) => (
                    <FormItem className='xs:col-span-full md:col-span-1'>
                      <FormLabel>Hora fin</FormLabel>
                      <FormControl>
                        <HourPicker onTimeChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className='flex mt-3 flex-row w-full gap-5 justify-center'>
                <Button
                  type='button'
                  className='w-full'
                  variant='ghost'
                  disabled={isPending}
                  onClick={handleModal}>
                  {isPending && <Loader2 className='animate-spin' />}
                  Cancelar
                </Button>
                <Button
                  className=' bg-green-500 hover:bg-green-700 w-full'
                  disabled={isPending}>
                  {isPending && <Loader2 className='animate-spin' />}
                  Crear hora de clase
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
