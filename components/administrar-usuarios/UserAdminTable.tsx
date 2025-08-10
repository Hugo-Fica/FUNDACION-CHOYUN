'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, Loader2, Pencil, Send, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useMutation } from '@tanstack/react-query'
import { useUsers } from '@/hooks/useUsers'
import { useState } from 'react'
import { useUserStore } from '@/store/useUserStore'
import { User } from '@/types/user'
import { DataTablePagination } from '../DataTablePagination'
import { UserCreateModal } from './UserCreateModal'
import { UserDeleteModal } from './UserDeleteModal'
import { UserEditModal } from './UserEditModal'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { useUserAuthStore } from '@/store/userAuthStore'
import { toast } from 'sonner'
import { sendOtpMail } from '@/utils/emails'

export const UserAdminTable = () => {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [sendMail, setSendMail] = useState(false)
  const [idUser, setIdUser] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const role = useUserAuthStore((state) => state.user?.role)
  const userId = useUserAuthStore((state) => state.user_id)
  const { getUser, reSendOtp } = useUsers()
  const users = useUserStore((state) => state.users)

  const { mutateAsync: getUserAsync, data: userData } = useMutation({
    mutationKey: ['getUser'],
    mutationFn: getUser
  })

  const { mutateAsync: reSendOtpAsync, isPending: isPendingReSendOtp } = useMutation({
    mutationKey: ['reSendOtp'],
    mutationFn: reSendOtp
  })

  const reSendMail = async (userId: string, names: string, lastnames: string, email: string) => {
    const resendOtp = await reSendOtpAsync(userId)
    if (resendOtp) {
      toast.success('Codigo de verificación creado exitosamente')
      setSendMail(true)
      const { succes } = await sendOtpMail(
        `${names} ${lastnames}`,
        email,
        '05:00',
        resendOtp.otp.code,
        resendOtp.otp.token
      )
      if (succes) {
        toast.success('Se envió el código de verificación')
      } else {
        toast.error('Error al enviar el código de verificación')
      }
      setSendMail(false)
    } else {
      toast.error('Error al generar el código de verificación')
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'names',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Nombres <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className='capitalize pl-4'>{row.getValue('names')}</div>
    },
    {
      accessorKey: 'lastnames',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Apellidos <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className='capitalize pl-4'>{row.getValue('lastnames')}</div>
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant='ghost'>
            Email <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className='capitalize pl-4'>{row.getValue('email')}</div>
    },
    {
      accessorKey: 'phone',
      header: 'Telefono',
      cell: ({ row }) => <div className='capitalize '>{row.getValue('phone')}</div>
    },
    {
      accessorKey: 'role',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Permiso <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className='capitalize pl-4'>{row.getValue('role')}</div>
    },
    {
      accessorKey: 'age',
      header: 'Edad',
      cell: ({ row }) => <div className='capitalize pl-1'>{row.getValue('age')}</div>
    },
    {
      accessorKey: 'birthday',
      header: 'Cumpleaños',
      cell: ({ row }) => <div className='capitalize '>{row.getValue('birthday')}</div>
    },
    {
      accessorKey: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className='flex justify-end'>
          <Button
            variant='ghost'
            size='icon'
            className={`${!!row.original.valid && 'hidden'} ${
              sendMail || (isPendingReSendOtp && 'cursor-not-allowed')
            }`}
            disabled={sendMail || isPendingReSendOtp}
            onClick={async () => {
              const { id, names, lastnames, email } = row.original
              await reSendMail(id, names, lastnames, email)
            }}>
            {sendMail || isPendingReSendOtp ? (
              <Loader2 className='animate-spin text-blue-600' />
            ) : (
              <Send
                size={16}
                className='text-blue-600'
              />
            )}
          </Button>
          <Button
            variant='ghost'
            size='icon'
            disabled={role?.includes('user')}
            onClick={async () => {
              await getUserAsync(row.original.id)
              setIdUser(row.original.id)
              setEditOpen(true)
            }}>
            <Pencil
              size={16}
              className='text-yellow-600'
            />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            disabled={row.original.id === userId || role?.includes('user')}
            className={`${
              row.original.id === userId ||
              (role?.includes('user') && 'opacity-50 cursor-not-allowed')
            } `}
            onClick={() => {
              setIdUser(row.original.id)
              setDeleteOpen(true)
            }}>
            <Trash
              size={16}
              className={`${row.original.id === userId && 'text-opacity-50'} text-red-600 `}
            />
          </Button>
        </div>
      )
    }
  ]

  // Tabla de usuarios
  const table = useReactTable({
    data: users || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return (
    <div className='w-[99vw] pt-[2.5rem] px-[2rem] xs:py-[5rem] flex flex-col items-center'>
      {/* Filtro para buscar usuarios */}
      <div className='flex justify-center items-center py-4 gap-4 flex-wrap max-w-[60rem] w-full'>
        {/* Boton para crear nuevo usuario */}
        <UserCreateModal />
        <Input
          placeholder='Filtrar nombres...'
          value={table.getColumn('names')?.getFilterValue() as string}
          onChange={(event) => table.getColumn('names')?.setFilterValue(event.target.value)}
          className='max-w-[15rem]'
        />
        <Input
          placeholder='Filtrar apellidos...'
          value={table.getColumn('lastnames')?.getFilterValue() as string}
          onChange={(event) => table.getColumn('lastnames')?.setFilterValue(event.target.value)}
          className='max-w-[15rem]'
        />
        <Input
          placeholder='Filtrar correo...'
          value={table.getColumn('email')?.getFilterValue() as string}
          onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
          className='max-w-[15rem]'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className='max-w-[15rem] w-full'>
              Columnas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Tabla de usuarios */}
      <ScrollArea className='w-full mx-auto h-[25rem] relative'>
        <div className='w-full flex justify-center'>
          <div className='w-max h-max rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className='whitespace-nowrap'>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'>
                      Sin resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <ScrollBar orientation='horizontal' />
        <ScrollBar orientation='vertical' />
      </ScrollArea>
      {/* Paginación y ordenamiento de la tabla */}
      <div className='flex items-center justify-center space-x-2 py-4'>
        <DataTablePagination table={table} />
      </div>
      {deleteOpen && (
        <UserDeleteModal
          open={deleteOpen}
          setOpen={setDeleteOpen}
          userId={idUser}
        />
      )}
      {editOpen && (
        <UserEditModal
          open={editOpen}
          setOpen={setEditOpen}
          user={userData}
          userId={idUser}
        />
      )}
    </div>
  )
}
