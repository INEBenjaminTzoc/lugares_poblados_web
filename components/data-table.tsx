"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import React from "react"
import { DataTablePagination } from "@/components/pagination"
import { DataTableViewOptions } from "@/components/toggle-column"
import { CopyToClipboard, ExportAsExcel, ExportAsPdf, PrintDocument } from "@siamf/react-export"
import { Check, Copy, FileText, Printer, Table2 } from "lucide-react"
import { Input } from "./ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pdfOrientation?: "portrait" | "landscape"
  fileName?: string
  onRowSelectionChange?: (selectedRows: TData[]) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowSelectionChange,
  pdfOrientation = "portrait",
  fileName
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState<any>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter
  })

  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = Object.keys(rowSelection).map((rowId) => data[parseInt(rowId)]);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, data]);

  const columnHeaders = columns.map(col => String(col.meta));
  const dataObject = data;

  return (
    <div>
        <div className="flex flex-wrap items-center py-4 gap-3">
          <Input 
            type="text" 
            value={globalFilter} 
            onChange={e => table.setGlobalFilter(String(e.target.value))} 
            placeholder="Búsqueda"
            className="w-70" />
          <ExportAsExcel data={dataObject} headers={columnHeaders} fileName={fileName}>
            {(props)=> (
              <Button {...props} variant='outline' 
              className="group transition-all duration-500 ease-in-out hover:w-40 cursor-pointer">
                <Table2/>
                <span className="hidden group-hover:inline">Exportar a excel</span>
              </Button>
            )}
          </ExportAsExcel>
          <ExportAsPdf data={dataObject} headers={columnHeaders} orientation={pdfOrientation} fileName={fileName}>
            {(props)=> (
              <Button {...props} variant='outline' 
              className="group transition-all duration-500 ease-in-out hover:w-40 cursor-pointer">
                <FileText/>
                <span className="hidden group-hover:inline">Exportar a PDF</span>
              </Button>
            )}
          </ExportAsPdf>
          <PrintDocument data={dataObject} headers={columnHeaders} orientation={pdfOrientation}>
            {(props)=> (
              <Button {...props} variant='outline'
                className="group transition-all duration-500 ease-in-out hover:w-40 cursor-pointer">
                <Printer/>
                <span className="hidden group-hover:inline">Imprimir</span>
              </Button>
            )}
          </PrintDocument>
          <CopyToClipboard data={dataObject} headers={columnHeaders}>
            {(props)=> (
              <Button {...props} variant='outline'
              className="group transition-all duration-500 ease-in-out hover:w-60 cursor-pointer">
                <Copy/>
                <span className="hidden group-hover:inline">Copiar al portapapeles</span>
              </Button>
            )}
          </CopyToClipboard>
          <DataTableViewOptions table={table} />
          {Object.keys(rowSelection).length > 0 && 
            <Button variant="outline" size="sm" onClick={() => setRowSelection({})}>
              <Check /> Limpiar Selección
            </Button>
          }
        </div>
        <div className="rounded-md border">
            <Table className="overflow-hidden">
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id}>
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
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
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        No existen registros.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
        <DataTablePagination table={table} />
    </div>
  )
}
