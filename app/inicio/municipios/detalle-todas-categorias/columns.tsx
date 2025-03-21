"use client"

import { DataTableColumnHeader } from "@/components/datatable-column-header"
import { ColumnDef } from "@tanstack/react-table"

export type TotalCategoria = {
  Codigo_Depto2018: number
  Codigo_Mupio2018: number
  Mupio2018: string
  a1: number
  a2: number
  a3: number
  a4: number
  Y: number
  T: number
  a6: number
  a7: number
  Total2018: number
}

export const columns: ColumnDef<TotalCategoria>[] = [
  {
    accessorKey: "Codigo_Depto2018",
    meta: "Departamento",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Departamento" />
    ),
  },
  {
    accessorKey: "Codigo_Mupio2018",
    meta: "Código Municipio",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Código Municipio" />
    ),
  },
  {
    accessorKey: "Mupio2018",
    meta: "Municipio",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Municipio" />
    ),
  },
  {
    accessorKey: "a1",
    meta: "1",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="1" />
    ),
  },
  {
    accessorKey: "a2",
    meta: "2",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="2" />
    ),
  },
  {
    accessorKey: "a3",
    meta: "3",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="3" />
    ),
  },
  {
    accessorKey: "a4",
    meta: "4",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="4" />
    ),
  },
  {
    accessorKey: "Y",
    meta: "5Y",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="5Y" />
    ),
  },
  {
    accessorKey: "T",
    meta: "5T",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="5T" />
    ),
  },
  {
    accessorKey: "a6",
    meta: "6",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="6" />
    ),
  },
  {
    accessorKey: "a7",
    meta: "7",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="7" />
    ),
  },
  {
    accessorKey: "Total2018",
    meta: "Total2018",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total2018" />
    ),
  },
]
