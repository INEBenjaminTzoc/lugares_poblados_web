"use client"

import { DataTableColumnHeader } from "@/components/datatable-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"

export type LugarPobladoMunicipio = {
  ID: number
  LugarPoblado: string
  Observacion: string
}

export const columns: ColumnDef<LugarPobladoMunicipio>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "ID",
    meta: "ID Lugar Poblado",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID Lugar Poblado" />
    ),
  },
  {
    accessorKey: "LugarPoblado",
    meta: "Lugar Poblado",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lugar Poblado" />
    ),
  },
  {
    accessorKey: "Observacion",
    meta: "Observación",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Observación" />
    ),
  },
]
