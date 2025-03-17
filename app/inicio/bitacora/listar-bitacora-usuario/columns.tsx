"use client"

import { DataTableColumnHeader } from "@/components/datatable-column-header"
import { ColumnDef } from "@tanstack/react-table"

export type Usuario = {
  idUsuario: number
  Nombre: string
  Puesto: string
}

export type Bitacora = {
  Accion: string
  CodCategoria: number
  CodEstado: number
  CodMupio: number
  FechaC: string
  FechaM: string
  Nombre: string
  Observacion: string
  UsuarioC: string
  UsuarioM: string
}

export const columnsBit: ColumnDef<Bitacora>[] = [
  {
    accessorKey: "Accion",
    meta: "Acción",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Acción" />
    ),
  },
  {
    accessorKey: "CodMupio",
    meta: "Municipio",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Municipio" />
    ),
  },
  {
    accessorKey: "Nombre",
    meta: "Nombre",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre" />
    ),
  },
  {
    accessorKey: "CodEstado",
    meta: "Estado",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
    ),
  },
  {
    accessorKey: "UsuarioC",
    meta: "Creación",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Creación" />
    ),
  },
  {
    accessorKey: "UsuarioM",
    meta: "Modificación",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Modificación" />
    ),
  },
  {
    accessorKey: "FechaC",
    meta: "Fecha Creación",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha Creación" />
    ),
  },
  {
    accessorKey: "FechaM",
    meta: "Fecha Modificación",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha Modificación" />
    ),
  },
]