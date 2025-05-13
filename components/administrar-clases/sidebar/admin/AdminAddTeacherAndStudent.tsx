import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useScheduleClass } from '@/hooks/useScheduleClass'
import { useUserAuthStore } from '@/store/userAuthStore'
import { useScheduleStore } from '@/store/useScheduleStore'
import { useUserStore } from '@/store/useUserStore'
import { StudentsTeachersClass } from '@/types/schedule'
import { cn } from '@/utils/calculate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Users, X } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {
  sidebarState: boolean
}

const formSchema = z.object({
  classId: z.string().min(1, { message: 'Debe seleccionar una clase' }),
  teacherIds: z.array(z.string()).min(1, { message: 'Debe seleccionar al menos un profes@r' }),
  studentsIds: z.array(z.string()).min(1, { message: 'Debe seleccionar al menos un alumn@' })
})

export const AdminAddTeacherAndStudent = ({ sidebarState }: Props) => {
  const role = useUserAuthStore((state) => state.user?.role)
  const classes = useScheduleStore((state) => state.classes)
  const users = useUserStore((state) => state.users)
  const [openPopoverTeacher, setOpenPopoverTeacher] = useState(false)
  const [openPopoverStudent, setOpenPopoverStudent] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<string[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string[]>([])
  const [studentsTeachersClass, setStudentsTeachersClass] = useState<StudentsTeachersClass[]>([])
  const { postAddStudentClass, getStudentsClass } = useScheduleClass()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: '',
      teacherIds: [],
      studentsIds: []
    }
  })

  const { mutateAsync: addStudentClassAsync, isPending: isPendingAddStudentClass } = useMutation({
    mutationKey: ['addStudentClass'],
    mutationFn: postAddStudentClass
  })

  const { mutateAsync: getStudentsClassAsync, isPending } = useMutation({
    mutationKey: ['getStudentsClass'],
    mutationFn: getStudentsClass
  })

  const selectedTeachers = useMemo(
    () => users?.filter((item) => selectedTeacher.includes(item.id)),
    [selectedTeacher, users]
  )
  const selectedStudents = useMemo(
    () => users?.filter((item) => selectedStudent.includes(item.id)),
    [selectedStudent, users]
  )

  const handleModal = () => {
    setOpen(!open)
    form.reset()
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    //ASIGNAR PROFESOR A CLASE
    //ASIGNAR ESTUDIANTE A CLASE
    const algo = await Promise.all(
      values.studentsIds.map(async (item) => {
        await addStudentClassAsync({
          classId: values.classId,
          studentId: item
        })
      })
    )

    console.log(algo)
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
                <Users className='text-black w-4 h-4' />
                <span>Asignar usuarios</span>
              </>
            ) : (
              <Users className='text-black w-4 h-4' />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Asignar profesores y estudiantes</DialogTitle>
            <DialogDescription>
              Completa los campos para asignar profesores y estudiantes a una clase
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid md:grid-cols-2 xs:grid-cols-1 gap-4'>
                <FormField
                  control={form.control}
                  name='classId'
                  render={({ field }) => (
                    <FormItem className='col-span-full'>
                      <FormLabel>Clase</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={async (value) => {
                            field.onChange(value)
                            const { userClass } = await getStudentsClassAsync(value)
                            userClass && setStudentsTeachersClass(userClass)
                          }}>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Selecciona una clase' />
                          </SelectTrigger>
                          <SelectContent className='max-h-[15rem]'>
                            {classes &&
                              classes.map((item) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.id}>
                                  {item.name}
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
                  name='teacherIds'
                  render={({ field }) => (
                    <FormItem className='col-span-full w-full'>
                      <FormLabel>Seleccionar profesor/es de clase</FormLabel>
                      <FormControl className='w-full'>
                        <Popover
                          open={openPopoverTeacher}
                          onOpenChange={setOpenPopoverTeacher}>
                          <PopoverTrigger asChild>
                            <div
                              aria-controls='combobox'
                              aria-expanded={openPopoverTeacher}
                              className={cn(
                                'flex min-h-10 w-full flex-wrap items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                                field.value.length > 0 && 'pb-1'
                              )}
                              onClick={() => setOpenPopoverTeacher(!openPopoverTeacher)}>
                              {selectedTeachers && selectedTeachers.length > 0 ? (
                                <div className='flex flex-wrap gap-1'>
                                  {selectedTeachers.map((item) => (
                                    <Badge
                                      key={item.id}
                                      variant='secondary'
                                      className='mr-1 mb-1 flex items-center gap-1 uppercase'>
                                      {`${item.names} ${item.lastnames}`}
                                      <button
                                        className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            const newValues = field.value.filter(
                                              (value) => value !== item.id
                                            )
                                            setSelectedTeacher(newValues)
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
                                          setSelectedTeacher(newValues)
                                          field.onChange(newValues)
                                        }}>
                                        <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span className='text-muted-foreground'>
                                  Seleccionar usuario...
                                </span>
                              )}
                            </div>
                          </PopoverTrigger>
                          <PopoverContent
                            className='w-full p-0'
                            align='start'>
                            <>
                              <Command className='w-[38.7rem]'>
                                <CommandInput placeholder='Buscar usuario...' />
                                <CommandList>
                                  <CommandEmpty>Usuario no encontrado.</CommandEmpty>
                                  <CommandGroup className='max-h-[12rem] overflow-auto'>
                                    {users &&
                                      users
                                        .filter((item) => !item.role.includes('user'))
                                        .map((item) => {
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
                                                setSelectedTeacher(newValues)
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
                                              <span className='uppercase'>{`${item.names} ${item.lastnames}`}</span>
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
                                  onClick={() => setOpenPopoverTeacher(!setOpenPopoverTeacher)}
                                  variant='ghost'>
                                  Cancelar
                                </Button>
                                <Button
                                  className=' bg-green-500 hover:bg-green-700 w-[50%]'
                                  onClick={() => setOpenPopoverTeacher(!openPopoverTeacher)}>
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
                  name='studentsIds'
                  render={({ field }) => (
                    <FormItem className='col-span-full w-full'>
                      <FormLabel>Seleccionar alumno/s de clase</FormLabel>
                      <FormControl className='w-full'>
                        <Popover
                          open={openPopoverStudent}
                          onOpenChange={setOpenPopoverStudent}>
                          <PopoverTrigger asChild>
                            <div
                              aria-controls='combobox'
                              aria-expanded={openPopoverStudent}
                              className={cn(
                                'flex min-h-10 w-full flex-wrap items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                                field.value.length > 0 && 'pb-1'
                              )}
                              onClick={() => setOpenPopoverStudent(!openPopoverStudent)}>
                              {selectedStudents && selectedStudents.length > 0 ? (
                                <div className='flex flex-wrap gap-1'>
                                  {selectedStudents.map((item) => (
                                    <Badge
                                      key={item.id}
                                      variant='secondary'
                                      className='mr-1 mb-1 flex items-center gap-1 uppercase'>
                                      {`${item.names} ${item.lastnames}`}
                                      <button
                                        className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            const newValues = field.value.filter(
                                              (value) => value !== item.id
                                            )
                                            setSelectedStudent(newValues)
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
                                          setSelectedStudent(newValues)
                                          field.onChange(newValues)
                                        }}>
                                        <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span className='text-muted-foreground'>
                                  Seleccionar usuario...
                                </span>
                              )}
                            </div>
                          </PopoverTrigger>
                          <PopoverContent
                            className='w-full p-0'
                            align='start'>
                            <>
                              <Command className='w-[38.7rem]'>
                                <CommandInput placeholder='Buscar usuario...' />
                                <CommandList>
                                  <CommandEmpty>Usuario no encontrado.</CommandEmpty>
                                  <CommandGroup className='max-h-[12rem] overflow-auto'>
                                    {users &&
                                      users.map((item) => {
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
                                              setSelectedStudent(newValues)
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
                                            <span className='uppercase'>{`${item.names} ${item.lastnames}`}</span>
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
                                  onClick={() => setOpenPopoverStudent(!openPopoverStudent)}
                                  variant='ghost'>
                                  Cancelar
                                </Button>
                                <Button
                                  className=' bg-green-500 hover:bg-green-700 w-[50%]'
                                  onClick={() => setOpenPopoverStudent(!openPopoverStudent)}>
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
              </div>
              <DialogFooter className='flex mt-3 flex-row w-full gap-5 justify-center'>
                <Button
                  type='button'
                  className='w-full'
                  variant='ghost'
                  // disabled={isPending}
                  onClick={handleModal}>
                  {/* {isPending && <Loader2 className='animate-spin' />} */}
                  Cancelar
                </Button>
                <Button
                  className=' bg-green-500 hover:bg-green-700 w-full'
                  // disabled={isPending}
                >
                  {/* {isPending && <Loader2 className='animate-spin' />} */}
                  Asignar usuarios
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
