'use client'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/calculate'
import { CalendarIcon, Loader2, X } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { AdminAddScheduleModal } from './AdminAddScheduleModal'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useScheduleStore } from '@/store/useScheduleStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TClass } from '@/types/class'
import { useScheduleClass } from '@/hooks/useScheduleClass'
import { AdminAddTeacherAndStudent } from './AdminAddTeacherAndStudent'
import { parseDate } from 'chrono-node'
import { Calendar } from '@/components/ui/calendar'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  classId: string
  classEdit: TClass | null
}

const formSchema = z.object({
  name: z.string().min(5, { message: 'El nombre de la clase es obligatorio' }),
  description: z.string(),
  scheduleIds: z
    .array(z.string())
    .min(1, { message: 'Debe seleccionar al menos una hora de clase' }),
  duration: z.number().min(0, { message: 'La duración de la clase es obligatoria' }),
  color: z.string().min(1, { message: 'Debe seleccionar un color para la clase' }),
  fechaInicioClase: z.date({
    required_error: 'Debe seleccionar una fecha de inicio de la clase'
  })
})

function formatDate(date: Date | undefined) {
  if (!date) {
    return ''
  }
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}
export const AdminEditClassModal = ({ open, setOpen, classId, classEdit }: Props) => {
  const queryClient = useQueryClient()
  const { schedules } = useScheduleStore((state) => state)
  const [openPopover, setOpenPopover] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const { putClass } = useScheduleClass()
  const [open2, setOpen2] = useState(false)
  const [value, setValue] = useState('')
  const [date, setDate] = useState<Date | undefined>(parseDate(value) || undefined)
  const [month, setMonth] = useState<Date | undefined>(date)
  const selectedSchedules = schedules?.filter((item) => selectedValues.includes(item.id))
  const handleModal = () => {
    setOpen(!open)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      scheduleIds: [],
      duration: undefined,
      color: ''
    }
  })
  const { isPending, mutateAsync: putClassAsync } = useMutation({
    mutationKey: ['updateClass'],
    mutationFn: putClass,
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  })
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const isPosted = await putClassAsync({
      id: classId,
      classUpdate: {
        name: values.name,
        description: values.description,
        scheduleIds: values.scheduleIds,
        duration: values.duration,
        color: values.color,
        fechaInicioClase: values.fechaInicioClase.toISOString()
      }
    })
    if (isPosted) {
      toast.success('Clase creada exitosamente')
      form.reset()
      setOpen(false)
      setSelectedValues([])
    } else {
      toast.error('Error al crear la clase')
    }
  }

  useEffect(() => {
    if (!classEdit) return
    form.setValue('name', classEdit.name)
    form.setValue('description', classEdit.description || '')
    form.setValue('duration', classEdit.duration)
    form.setValue('color', classEdit.color)
    form.setValue('scheduleIds', classEdit.schedules || [])
    form.setValue('fechaInicioClase', new Date(classEdit.fechaInicioClase))
    setValue(formatDate(new Date(classEdit.fechaInicioClase)))
    setDate(new Date(classEdit.fechaInicioClase))
    setSelectedValues(classEdit.schedules || [])
  }, [classEdit, form])
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={handleModal}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Editar clase</DialogTitle>
            <DialogDescription>Completa los campos para editar una clase</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid md:grid-cols-2 xs:grid-cols-1 gap-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='col-span-full'>
                      <FormLabel>Nombre de la clase</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Nombre de la clase'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem className='col-span-full '>
                      <FormLabel>Descripción de la clase</FormLabel>
                      <FormControl>
                        <Textarea
                          className='w-full h-[7rem] max-h-[7rem]'
                          {...field}
                          placeholder='Descripción de la clase'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AdminAddTeacherAndStudent
                  sidebarState={true}
                  classId={classId}
                />
                <FormField
                  control={form.control}
                  name='fechaInicioClase'
                  render={({ field }) => (
                    <FormItem className='col-span-1 '>
                      <FormLabel>Inicio de clase</FormLabel>
                      <FormControl>
                        <div className='flex flex-col gap-3'>
                          <div className='relative flex gap-2'>
                            <Input
                              id='date'
                              value={value}
                              placeholder='dd/mm/aaaa'
                              className='bg-background pr-10'
                              onChange={(e) => {
                                setValue(e.target.value)
                                const date = parseDate(e.target.value)
                                if (date) {
                                  setDate(date)
                                  setMonth(date)
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                  e.preventDefault()
                                  setOpen2(true)
                                }
                              }}
                            />
                            <Popover
                              open={open2}
                              onOpenChange={setOpen2}>
                              <PopoverTrigger asChild>
                                <Button
                                  id='date-picker'
                                  variant='ghost'
                                  className='absolute top-1/2 right-2 size-6 -translate-y-1/2'>
                                  <CalendarIcon className='size-3.5' />
                                  <span className='sr-only'>Seleccionar fecha</span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className='w-auto overflow-hidden p-0'
                                align='end'>
                                <Calendar
                                  mode='single'
                                  selected={date}
                                  captionLayout='dropdown'
                                  month={month}
                                  onMonthChange={setMonth}
                                  onSelect={(date) => {
                                    field.onChange(date)
                                    setDate(date)
                                    setValue(formatDate(date))
                                    setOpen2(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='scheduleIds'
                  render={({ field }) => (
                    <FormItem className='col-span-full w-full'>
                      <FormLabel>Seleccionar horarios de clase</FormLabel>
                      <FormControl className='w-full'>
                        <Popover
                          open={openPopover}
                          onOpenChange={setOpenPopover}>
                          <PopoverTrigger asChild>
                            <div
                              aria-controls='combobox'
                              aria-expanded={openPopover}
                              className={cn(
                                'flex min-h-10 w-full flex-wrap items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                                field.value.length > 0 && 'pb-1'
                              )}
                              onClick={() => setOpenPopover(!openPopover)}>
                              {selectedSchedules && selectedSchedules.length > 0 ? (
                                <div className='flex flex-wrap gap-1'>
                                  {selectedSchedules.map((item) => (
                                    <Badge
                                      key={item.id}
                                      variant='secondary'
                                      className='mr-1 mb-1 flex items-center gap-1'>
                                      {item.name}
                                      <button
                                        className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            const newValues = field.value.filter(
                                              (value) => value !== item.id
                                            )
                                            setSelectedValues(newValues)
                                            field.onChange(newValues)
                                          }
                                        }}
                                        onMouseDown={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                        }}
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          const newValues = field.value.filter(
                                            (value) => value !== item.id
                                          )
                                          setSelectedValues(newValues)
                                          field.onChange(newValues)
                                        }}>
                                        <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span className='text-muted-foreground'>
                                  Seleccionar horarios de clase...
                                </span>
                              )}
                            </div>
                          </PopoverTrigger>
                          <PopoverContent
                            className='w-full p-0'
                            align='start'>
                            <>
                              <AdminAddScheduleModal sidebarState={true} />
                              <Command className='w-[38.7rem]'>
                                <CommandInput placeholder='Buscar horarios de clase...' />
                                <CommandList>
                                  <CommandEmpty>Horario no encontrado.</CommandEmpty>
                                  <CommandGroup className='max-h-[12rem] overflow-auto'>
                                    {schedules &&
                                      schedules.map((item) => {
                                        const isSelected = field.value.includes(item.id)
                                        return (
                                          <CommandItem
                                            key={item.id}
                                            onSelect={() => {
                                              let newValues
                                              if (isSelected) {
                                                newValues = field.value.filter(
                                                  (value) => value !== item.id
                                                )
                                              } else {
                                                newValues = [...field.value, item.id]
                                              }
                                              setSelectedValues(newValues)
                                              field.onChange(newValues)
                                            }}>
                                            <div
                                              className={cn(
                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                isSelected
                                                  ? 'bg-primary text-primary-foreground'
                                                  : 'opacity-50 [&_svg]:invisible'
                                              )}>
                                              <svg
                                                className='h-3 w-3'
                                                fill='none'
                                                stroke='currentColor'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                viewBox='0 0 24 24'>
                                                <path d='M5 12l5 5 9-9' />
                                              </svg>
                                            </div>
                                            <span>{item.name}</span>
                                          </CommandItem>
                                        )
                                      })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>

                              <div className='flex justify-center gap-5 my-3 px-3'>
                                <Button
                                  type='button'
                                  className=' w-[50%]'
                                  onClick={() => setOpenPopover(!openPopover)}
                                  variant='ghost'>
                                  Cancelar
                                </Button>
                                <Button
                                  className=' bg-green-500 hover:bg-green-700 w-[50%]'
                                  onClick={() => setOpenPopover(!openPopover)}>
                                  Listo
                                </Button>
                              </div>
                            </>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='duration'
                  render={({ field }) => (
                    <FormItem className='col-span-1 '>
                      <FormLabel>Duración de la clase</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='number'
                          className='w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                          min={1}
                          step={1}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          placeholder='Duración en semanas'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='color'
                  render={({ field }) => (
                    <FormItem className='col-span-1 '>
                      <FormLabel>Color de la clase</FormLabel>
                      <FormControl>
                        <Input
                          type='color'
                          className='w-[50px]'
                          {...field}
                          placeholder='Duración en semanas'
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
                  disabled={isPending}
                  onClick={handleModal}>
                  {isPending && <Loader2 className='animate-spin' />}
                  Cancelar
                </Button>
                <Button
                  className={`${
                    isPending
                      ? 'bg-blue-500/50 hover:bg-blue-700/50'
                      : 'bg-blue-500 hover:bg-blue-700'
                  }   w-full`}
                  disabled={isPending}>
                  {isPending && <Loader2 className='animate-spin' />}
                  Modificar clase
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
