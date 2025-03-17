"use client"

import { multiSelectTemplate } from '@/lib/multiselect.interface';
import React, { useEffect, useState } from 'react'
import { AldeasCaserios2002, columnsAldeasCaserios2002 } from '../totales-2018-2002/columns';
import { toast } from 'sonner';
import axios from 'axios';
import { Departamento } from '../../departamentos/columns';
import { Municipio } from '../../municipios/listar-municipios/columns';
import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { DataTable } from '@/components/data-table';

export default function Totales2002() {
  const [ departamentos, setDepartamentos ] = useState<multiSelectTemplate[]>([]);
  const [ municipios, setMunicipios ] = useState<multiSelectTemplate[]>([]);

  const [ departamentosSelected, setDepartamentosSelected ] = useState<number[]>([]);
  const [ municipiosSelected, setMunicipiosSelected ] = useState<number[]>([]);

  const [aldeasCaserios2002, setAldeasCaserios2002] = useState<AldeasCaserios2002[]>([]);

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

    getDepartamentos();
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

  const handleClickSearch = async () => {
    try {
        setAldeasCaserios2002([]);
        const res = await axios
            .post('/api/bases-de-datos/totales-2002', 
            { 
                departamentos: departamentosSelected, 
                municipios: municipiosSelected });
        if (res.data.code !== 200) {
            toast.error("Error al obtener detalle");
            return;
        }
        const aldeasCaserios2002: AldeasCaserios2002[] = res.data.aldeasCaserios2002;
        setAldeasCaserios2002(aldeasCaserios2002);
    } 
    catch (error) 
    {
        toast.error(`Error al obtener detalle: ${error}`);
        setAldeasCaserios2002([]);
    }
  }
  
  return (
    <>
        <div className="py-5">
            <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Totales 2002
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
                <Button variant="outline" className='cursor-pointer' size="lg" onClick={handleClickSearch}>
                    <Search /> Consultar
                </Button>
            </div>
            <DataTable columns={columnsAldeasCaserios2002} data={aldeasCaserios2002} />
        </div>
    </>
  )
}
