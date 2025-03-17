"use client"

import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { multiSelectTemplate } from '@/lib/multiselect.interface';
import axios from 'axios';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { generateColumns, MostrarAldeasCaserios } from './columns';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';

export default function AldeasCaseriosTotales() {
  //------------------------VARIABLES PARA SELECTORES------------------//
  const [ filtroSelected, setFiltroSelected ] = useState<number>();
  const [ estados, setEstados ] = useState<multiSelectTemplate[]>([]);
  //-------------------------LISTA DE VALORES SELECCIONADOS--------------------------//
  const [ estadosSelected, setEstadosSelected ] = useState<number[]>([]);
  //------------------------LISTA DE DETALLE LUGARES POBLADOS---------------------------//
  const [ lugaresPoblados, setLugaresPoblados ] = useState<MostrarAldeasCaserios[]>([]);
  const [ columns, setColumns ] = useState<ColumnDef<MostrarAldeasCaserios>[]>([]);
  
  useEffect(() => {
    const getEstados = async () => {
        try {
            const getEstados = await axios.get('/api/estados/estados2002');
            if (getEstados.data.code !== 200) {
                toast.error("Error al obtener los estados");
                return;
            }
            const estados: { idestado: number, etiqueta: string }[] = getEstados.data.estados;
            setEstados(
                estados.map((est) => ({
                    value: est.idestado.toString(),
                    label: est.etiqueta
                }))
            )
        } 
        catch (error) 
        {
            toast.error(`Error al obtener estados: ${error}`);
            setEstados([]);
        }
    }

    getEstados();
  }, []);

  const handleOptionChange = (valuesSelected: string) => {
    setFiltroSelected(parseInt(valuesSelected));
  };

  const handleEstadoChange = (valuesSelected: string[]) => {
    const valuesParsed = valuesSelected.map(value => parseInt(value)) as number[];
    setEstadosSelected(valuesParsed);
  }

  const handleClickSearch = async () => {
    const res = await axios
        .post('/api/lugares-poblados/detalle-aldeas-caserios', 
          { 
            filtro: filtroSelected, 
            estados: estadosSelected });
    if (res.data.code !== 200) {
        toast.error("Error al obtener detalle");
        return;
    }
    let lugaresPoblados: MostrarAldeasCaserios[] = [];
    lugaresPoblados = res.data.aldeasCaseriosTotales as MostrarAldeasCaserios[];

    const columns = generateColumns(lugaresPoblados) as ColumnDef<MostrarAldeasCaserios>[];
    setColumns(columns);
    setLugaresPoblados(lugaresPoblados);
  }

  return (
    <>
        <div className="py-5">
            <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Reporte Aldeas y Caserios Totales
            </h2>
            <div className="w-full px-16">
                <p className="text-center text-lg text-muted-foreground">
                    Listado de aldeas y caseríos totales por municipio.
                </p>
            </div>
            <div className="w-full flex flex-row mt-4 gap-x-3">
                <div className="w-60">
                    <Select onValueChange={handleOptionChange}>
                        <SelectTrigger className='w-60'>
                            <SelectValue placeholder="Filtros" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='1'>Mostrar aldeas y caserios</SelectItem>
                            <SelectItem value='2'>No mostrar aldeas y caserios</SelectItem>
                            <SelectItem value='3'>Todos los lugares poblados</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-60">
                    <MultiSelect 
                      options={estados}
                      onValueChange={handleEstadoChange}
                      placeholder='Estados'
                      maxCount={2}
                      variant="inverted"
                    />
                </div>
                <Button variant="outline" size="icon" onClick={handleClickSearch}>
                    <Search />
                </Button>
            </div>
            <DataTable columns={columns} data={lugaresPoblados} />
        </div>
    </>
  )
}
