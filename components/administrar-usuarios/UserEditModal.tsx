import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { calcularEdad, cn } from '@/utils/calculate'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { DatePicker } from '../DatePicker'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { useRolesStore } from '@/store/useRolesStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from '@/types/user'
import { useUsers } from '@/hooks/useUsers'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import 'dayjs/locale/es' // idioma español
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)
dayjs.locale('es')

const formSchema = z.object({
  names: z.string().min(6, { message: 'Los nombres son obligatorios' }),
  lastnames: z.string().min(6, { message: 'Los apellidos son obligatorios' }),
  email: z.string().email({ message: 'El correo electrónico no es válido' }),
  phone: z.string().min(10, { message: 'El teléfono es obligatorio' }),
  role: z.string().min(10, { message: 'El permiso es obligatorio' }),
  birthday: z.string().min(10, { message: 'La fecha de nacimiento es obligatoria' }),
  age: z.number().min(1, { message: 'La edad es obligatoria' })
})

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  user: User
  userId: string
}
export const UserEditModal = ({ open, setOpen, user, userId }: Props) => {
  const queryCLient = useQueryClient()
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const roles = useRolesStore((state) => state.roles)
  const { putUser } = useUsers()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      names: '',
      lastnames: '',
      email: '',
      phone: '+56',
      role: '',
      age: 0,
      birthday: ''
    }
  })

  const { mutateAsync: putUserAsync, isPending } = useMutation({
    mutationKey: ['putUser'],
    mutationFn: putUser,
    onSuccess: () => {
      queryCLient.invalidateQueries()
    }
  })

  const handleModal = () => {
    setOpen(!open)
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const isPuted = await putUserAsync({ id: userId, ...data })

    if (isPuted) {
      toast.success('Usuario actualizado exitosamente')
      setOpen(false)
    } else {
      toast.error('Error al actualizar el usuario')
    }
  }
  useEffect(() => {
    form.setValue('names', user.names)
    form.setValue('lastnames', user.lastnames)
    form.setValue('email', user.email)
    form.setValue('phone', user.phone)
    form.setValue('role', roles.find((r) => r.name === user.role)?.id || '')
    form.setValue('age', user.age)
    form.setValue('birthday', dayjs(user.birthday).format('D [de] MMMM [de] YYYY'))
  }, [user, form, roles])
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={handleModal}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>Completa los campos para editar un usuario</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid md:grid-cols-2 xs:grid-cols-1 gap-4'>
                <FormField
                  control={form.control}
                  name='names'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombres</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='nombres del usuario'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lastnames'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='apellidos del usuario'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='correo del usuario'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefono</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='+56912345678'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='birthday'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de nacimiento</FormLabel>
                      <Popover open={openDatePicker}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              onClick={() => setOpenDatePicker(!openDatePicker)}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}>
                              {field.value ? field.value : <span>Selecciona una fecha</span>}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className='w-full p-0'
                          align='center'>
                          <DatePicker
                            onChange={(date) => {
                              field.onChange(date)
                              form.setValue('age', calcularEdad(date))
                            }}
                            setOpenDatePicker={setOpenDatePicker}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='age'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edad</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='0'
                          disabled={true}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acceso de usuario</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Selecciona un permiso' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Accesos</SelectLabel>
                              {roles.map((role) => (
                                <SelectItem
                                  key={role.id}
                                  value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className='flex mt-3 flex-row w-full gap-5 justify-center'>
                <Button
                  className='mt-3 w-full'
                  variant={'ghost'}
                  onClick={() => setOpen(false)}
                  disabled={isPending}>
                  {isPending && <Loader2 className='animate-spin' />}
                  Cancelar
                </Button>
                <Button
                  className='mt-3 bg-green-500  hover:bg-green-700 w-full'
                  disabled={isPending}>
                  {isPending && <Loader2 className='animate-spin' />}
                  Actualizar Usuario
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
