"use client"

import { DataTableColumnHeader } from "@/components/datatable-column-header"
import { ColumnDef } from "@tanstack/react-table"

export type MunicipioMapa = {
  CodigoMunicipio: number
  Municipio: string
  Estado: string
  Ciudades: number
  Pueblos: number
  Residencias: number
  Aldeas: number
  Colonias: number
  Caserios: number
  Fincas: number
  Condominios: number
  Asentamientos: number
  Cantones: number
  Granjas: number
  Lotificaciones: number
  Otros: number
  Haciendas: number
  Parajes: number
  Labores: number
  Villas: number
  Parcelamientos: number
  Barrios: number
  Comunidades: number
  Rancherias: number
  ComunidadesAgrarias: number
  Microparcelamientos: number
  Guardianias: number
  Sectores: number
  Cabeceras: number
  Municipios: number
  Cooperativas: number
  Zonas: number
  Total: number
}

export const columns: ColumnDef<MunicipioMapa>[] = [
  {
    accessorKey: "CodigoMunicipio",
    meta: "Código Municipio",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Código Municipio" />
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
    accessorKey: "Estado",
    meta: "Estado",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
    ),
  },
  {
    accessorKey: "Ciudades",
    meta: "Ciudades",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ciudades" />
    ),
  },
  {
    accessorKey: "Pueblos",
    meta: "Pueblos",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pueblos" />
    ),
  },
  {
    accessorKey: "Residencias",
    meta: "Residencias",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Residencias" />
    ),
  },
  {
    accessorKey: "Aldeas",
    meta: "Aldeas",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Aldeas" />
    ),
  },
  {
    accessorKey: "Colonias",
    meta: "Colonias",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Colonias" />
    ),
  },
  {
    accessorKey: "Caserios",
    meta: "Caserios",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Caserios" />
    ),
  },
  {
    accessorKey: "Fincas",
    meta: "Fincas",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fincas" />
    ),
  },
  {
    accessorKey: "Condominios",
    meta: "Condominios",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Condominios" />
    ),
  },
  {
    accessorKey: "Asentamientos",
    meta: "Asentamientos",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Asentamientos" />
    ),
  },
  {
    accessorKey: "Cantones",
    meta: "Cantones",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cantones" />
    ),
  },
  {
    accessorKey: "Granjas",
    meta: "Granjas",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Granjas" />
    ),
  },
  {
    accessorKey: "Lotificaciones",
    meta: "Lotificaciones",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lotificaciones" />
    ),
  },
  {
    accessorKey: "Otros",
    meta: "Otros",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Otros" />
    ),
  },
  {
    accessorKey: "Haciendas",
    meta: "Haciendas",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Haciendas" />
    ),
  },
  {
    accessorKey: "Parajes",
    meta: "Parajes",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Parajes" />
    ),
  },
  {
    accessorKey: "Labores",
    meta: "Labores",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Labores" />
    ),
  },
  {
    accessorKey: "Villas",
    meta: "Villas",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Villas" />
    ),
  },
  {
    accessorKey: "Parcelamientos",
    meta: "Parcelamientos",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Parcelamientos" />
    ),
  },
  {
    accessorKey: "Barrios",
    meta: "Barrios",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Barrios" />
    ),
  },
  {
    accessorKey: "Comunidades",
    meta: "Comunidades",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comunidades" />
    ),
  },
  {
    accessorKey: "Rancherias",
    meta: "Rancherias",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rancherias" />
    ),
  },
  {
    accessorKey: "ComunidadesAgrarias",
    meta: "Comunidades Agrarias",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comunidades Agrarias" />
    ),
  },
  {
    accessorKey: "Microparcelamientos",
    meta: "Microparcelamientos",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Microparcelamientos" />
    ),
  },
  {
    accessorKey: "Guardianias",
    meta: "Guardianias",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Guardianias" />
    ),
  },
  {
    accessorKey: "Sectores",
    meta: "Sectores",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sectores" />
    ),
  },
  {
    accessorKey: "Cabeceras",
    meta: "Cabeceras",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cabeceras" />
    ),
  },
  {
    accessorKey: "Municipios",
    meta: "Municipios",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Municipios" />
    ),
  },
  {
    accessorKey: "Cooperativas",
    meta: "Cooperativas",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cooperativas" />
    ),
  },
  {
    accessorKey: "Zonas",
    meta: "Zonas",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Zonas" />
    ),
  },
  {
    accessorKey: "Total",
    meta: "Total",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
    ),
  },
]
