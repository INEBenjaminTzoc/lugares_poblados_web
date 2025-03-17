"use client"

import { multiSelectTemplate } from '@/lib/multiselect.interface';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Departamento } from '../../departamentos/columns';
import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Municipio } from '../../municipios/listar-municipios/columns';
import { DataTable } from '@/components/data-table';
import { columns, LugaresPobladosHistorial } from './columns';

export default function HistorialLugaresPoblados() {
  //-----------------------LISTAS PARA SELECTORES------------------------//
  const [ departamentos, setDepartamentos ] = useState<multiSelectTemplate[]>([]);
  const [ municipios, setMunicipios ] = useState<multiSelectTemplate[]>([]);
  const [ estados, setEstados ] = useState<multiSelectTemplate[]>([]);
  //-----------------------LISTAS DE VALORES SELECCIONADOS----------------------------//
  const [ departamentosSelected, setDepartamentosSelected ] = useState<number[]>([]);
  const [ municipiosSelected, setMunicipiosSelected ] = useState<number[]>([]);
  const [ estadosSelected, setEstadosSelected ] = useState<number[]>([]);

  const [ lugaresPobladosHistorial, setLugaresPobladosHistorial ] = useState<LugaresPobladosHistorial[]>([]);

  useEffect(() => {
    const getDepartamentos = async () => {
        try {
          const res = await axios.get('/api/departamentos');
          if (res.data.code !== 200) {
            toast.error("Error al obtener los departamentos");
            return;
          }
          const deptos: Departamento[] = res.data.departamentos;
          setDepartamentos(
            deptos.map((depto) => ({
                value: depto.id.toString(),
                label: depto.nombre
            }))
          )
        } 
        catch (error) 
        {
          toast.error(`Error al obtener departamentos: ${error}`);
          setDepartamentos([]);
        }
    }

    const getEstados = async () => {
        try {
            const res = await axios.get('/api/estados/estados2002');
            if (res.data.code !== 200) {
                toast.error("Error al obtener los estados");
                return;
            }
            const estados: { idestado: number, etiqueta: string }[] = res.data.estados;
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

    getDepartamentos();
    getEstados();
  }, []);

  const handleDepartamentoChange = (valuesSelected: string[]) => {
    setMunicipios([]);
    const valuesParsed = valuesSelected.map(value => parseInt(value)) as number[];

    setDepartamentosSelected(valuesParsed);

    valuesParsed.forEach(async (idDepartamento) => {
        try {
            const res = await axios.get(`/api/municipios/lista-municipios/${idDepartamento}`);
            if (res.data.code !== 200) {
                toast.error(`Error al obtener los municipios del departamento: ${idDepartamento}`);
                return;
            }
            const municipios: Municipio[] = res.data.municipios;
            setMunicipios((prevMunicipios) => [
             ...prevMunicipios,
             ...municipios.map((mun) => ({
                value: mun.idMunicipio.toString(),
                label: mun.municipio
              }))   
            ]);
        } 
        catch (error) 
        {
          toast.error(`Error al obtener municipios: ${error}`);
          setMunicipios([]);
        }
    })
  }

  const handleMunicipioChange = (valuesSelected: string[]) => {
    const valuesParsed = valuesSelected.map(value => parseInt(value)) as number[];
    setMunicipiosSelected(valuesParsed);
  }

  const handleEstadoChange = (valuesSelected: string[]) => {
    const valuesParsed = valuesSelected.map(value => parseInt(value)) as number[];
    setEstadosSelected(valuesParsed);
  }

  const handleClickSearch = async () => {
    const res = await axios
        .post('/api/lugares-poblados/historial-lugares-poblados', 
          { 
            departamentos: departamentosSelected, 
            municipios: municipiosSelected, 
            estados: estadosSelected });
    if (res.data.code !== 200) {
        toast.error("Error al obtener detalle");
        return;
    }
    const lugaresPobladosHistorial: LugaresPobladosHistorial[] = res.data.lugaresPobladosHistorial;
    setLugaresPobladosHistorial(lugaresPobladosHistorial);
  }

  return (
    <>
        <div className="py-5">
            <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Reporte Historial Lugares Poblados
            </h2>
            <div className="w-full px-16">
                <p className="text-center text-lg text-muted-foreground">
                    Según las proyecciones del <span className='font-semibold'> Instituto Nacional de Estadística</span> 
                    , con base en el censo nacional de población 2002.
                </p>
            </div>
            <div className='w-full flex flex-row mt-4 gap-x-3'>
                <div className='w-60'>
                    <MultiSelect 
                        options={departamentos}
                        onValueChange={handleDepartamentoChange}
                        placeholder='Departamentos'
                        maxCount={2}
                        variant="inverted"
                      />
                </div>
                <div className='w-60'>
                    <MultiSelect 
                      options={municipios}
                      onValueChange={handleMunicipioChange}
                      placeholder='Municipios'
                      maxCount={2}
                      variant="inverted"
                    />
                </div>
                <div className='w-60'>
                    <MultiSelect 
                      options={estados}
                      onValueChange={handleEstadoChange}
                      placeholder='Estados'
                      maxCount={2}
                      variant="inverted"
                    />
                </div>
                <Button variant="outline" className='cursor-pointer' size="lg" onClick={handleClickSearch}>
                    <Search /> Consultar
                </Button>
            </div>
            <DataTable columns={columns} data={lugaresPobladosHistorial} />
        </div>
    </>
  )
}
