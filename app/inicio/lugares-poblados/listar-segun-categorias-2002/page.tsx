"use client"

import { multiSelectTemplate } from '@/lib/multiselect.interface';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Departamento } from '../../departamentos/columns';
import { MultiSelect } from '@/components/multi-select';
import { Municipio } from '../../municipios/listar-municipios/columns';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { columns, DetalleLugarPoblado2002 } from './columns';
import { DataTable } from '@/components/data-table';

export default function ListarSegunCategorias2002() {
  //-----------------------LISTAS PARA SELECTORES------------------------//
  const [ departamentos, setDepartamentos ] = useState<multiSelectTemplate[]>([]);
  const [ municipios, setMunicipios ] = useState<multiSelectTemplate[]>([]);
  //-----------------------LISTAS DE VALORES SELECCIONADOS----------------------------//
  const [ departamentosSelected, setDepartamentosSelected ] = useState<number[]>([]);
  const [ municipiosSelected, setMunicipiosSelected ] = useState<number[]>([]);
  //----------------------LISTA DE DETALLE LUGARES POBLADOS------------------------//
  const [ lugaresPoblados, setLugaresPoblados ] = useState<DetalleLugarPoblado2002[]>([]);

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

  //---------------------------TRIGGERS DE LOS SELECTORES-------------------------//
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
    const res = await axios
        .post('/api/lugares-poblados/listar-segun-categorias-2002', 
          { 
            departamento: departamentosSelected, 
            municipio: municipiosSelected
          }
        );
    if (res.data.code !== 200) {
        toast.error("Error al obtener detalle");
        return;
    }
    const detalleLugaresPoblados: DetalleLugarPoblado2002[] = res.data.lugaresPoblados;
    setLugaresPoblados(detalleLugaresPoblados);
  }

  return (
    <>
        <div className="py-5">
            <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Reporte Lugares Poblados Según Categoría - 2002
            </h2>
            <div className="w-full px-16">
                <p className="text-center text-lg text-muted-foreground">
                    Según las proyecciones del <span className='font-semibold'> Instituto Nacional de Estadística</span> 
                    , con base en el censo nacional de población 2002.
                </p>
            </div>
            <div className="w-full flex flex-row mt-4 gap-x-3">
                <div className="w-60">
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
            <DataTable columns={columns} data={lugaresPoblados} />
        </div>
    </>
  )
}
