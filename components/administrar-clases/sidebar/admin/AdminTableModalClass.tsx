'use client'

import { DataTablePagination } from '@/components/DataTablePagination'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useUserAuthStore } from '@/store/userAuthStore'
import { useScheduleStore } from '@/store/useScheduleStore'
import { ClassAPI } from '@/types/class'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Pencil, Table2, Trash } from 'lucide-react'
import { useState } from 'react'
import { AdminEditClassModal } from './AdminEditClassModal'
import { AdminDeleteClassModal } from './AdminDeleteClassModal'
import { useMutation } from '@tanstack/react-query'
import { useScheduleClass } from '@/hooks/useScheduleClass'

type Props = {
  sidebarState: boolean
}

export const AdminTableModalClass = ({ sidebarState }: Props) => {
  const userId = useUserAuthStore((state) => state.user_id)
  const role = useUserAuthStore((state) => state.user?.role)
  const classes = useScheduleStore((state) => state.classes)
  const { getClassById } = useScheduleClass()
  const [open, setOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [classId, setClassId] = useState('')

  const handleModal = () => {
    setOpen(!open)
  }

  const {
    mutateAsync: getClassByIdAsync,
    isPending: isPendingClass,
    data: classData
  } = useMutation({
    mutationKey: ['getClassById'],
    mutationFn: getClassById
  })

  const columns: ColumnDef<ClassAPI>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => <div className='capitalize pl-4'>{row.getValue('name')}</div>
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => <div className='capitalize pl-4'>{row.getValue('description')}</div>
    },
    {
      accessorKey: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className=''>
          <Button
            variant='ghost'
            onClick={async () => {
              await getClassByIdAsync(row.original.id)
              setClassId(row.original.id)
              setEditOpen(true)
            }}>
            <Pencil
              size={16}
              className='text-yellow-600'
            />
          </Button>
          <Button
            variant='ghost'
            onClick={() => {
              setClassId(row.original.id)
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

  const table = useReactTable({
    data: classes || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })
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
                <Table2 className='text-black w-4 h-4' />
                <span>Ver clases</span>
              </>
            ) : (
              <Table2 className='text-black w-4 h-4' />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Ver clases</DialogTitle>
            <DialogDescription>
              Ventana para ver las clases, modificarlas y eliminarlas
            </DialogDescription>
          </DialogHeader>
          <div>
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
            {!isPendingClass && editOpen && (
              <AdminEditClassModal
                open={editOpen}
                setOpen={setEditOpen}
                classId={classId}
                classEdit={classData?.editClass || null}
              />
            )}
            {deleteOpen && (
              <AdminDeleteClassModal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                classId={classId}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
