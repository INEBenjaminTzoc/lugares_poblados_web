"use client"

import { DataTableColumnHeader } from "@/components/datatable-column-header"
import { ColumnDef } from "@tanstack/react-table"

export type DetalleLugarPoblado2018 = {
  ID_Departamento: number
  Departamento: string
  ID_Municipio: number
  Municipio: string
  LugarPoblado: string
  Categoria:   string
  Estado: string
  Observacion: string
  EstadoMunicipio: string
}

export const columns: ColumnDef<DetalleLugarPoblado2018>[] = [
  {
    accessorKey: "Departamento",
    meta: "Departamento",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Departamento" />
    ),
  },
  {
    accessorKey: "Municipio",
    meta: "Municipio",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Municipio" />
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
    accessorKey: "Categoria",
    meta: "Categoría",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categoría" />
    ),
  },
  {
    accessorKey: "Estado",
    meta: "Estado",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
    ),
  },
  {
    accessorKey: "Observacion",
    meta: "Observación",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Observación" />
    ),
  },
  {
    accessorKey: "EstadoMunicipio",
    meta: "Estado Municipio",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado Municipio" />
    ),
  },
]
