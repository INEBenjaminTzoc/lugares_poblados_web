"use client"

import { multiSelectTemplate } from '@/lib/multiselect.interface';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Departamento } from '../../departamentos/columns';
import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { Municipio } from '../../municipios/listar-municipios/columns';
import { DataTable } from '@/components/data-table';
import { columns, LugaresPobladosHistorial } from './columns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bitacora, columnsBit } from '../../bitacora/listar-bitacora-usuario/columns';

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
  const [ historiales, setHistoriales ] = useState<{ NombreDepartamento: string, bitacoras: Bitacora[] }[]>([]);
  //-----------------------LOADERS---------------------------//
  const [loadingData, setLoadingData] = useState<boolean>(false);

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
    setLoadingData(true);
    try {
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

      getHistorialDepartamentos();
    } catch (error) {
      toast.error("Error al obtener lugares poblados");
      setLugaresPobladosHistorial([]);
    } finally {
      setLoadingData(false);
    }
  }

  const getHistorialDepartamentos = () => {
    setHistoriales([]);
    departamentosSelected.forEach(async idDepartamento => {
      const departamento = departamentos.find(dep => parseInt(dep.value) === idDepartamento);
      const resHist = await axios
        .get(`/api/lugares-poblados/historial-lugares-poblados/${idDepartamento}`);
      if (resHist.data.code !== 200) {
        toast.error(`Error al obtener historial del departamento: ${departamento?.label}`);
        return;
      }
      const historial: Bitacora[] = resHist.data.historial;
      setHistoriales((prevHistoriales) => [
        ...prevHistoriales,
        { 
          NombreDepartamento: departamento?.label || '', 
          bitacoras: historial 
        }
      ])
    })
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
            <div className='w-full flex flex-row flex-wrap mt-4 gap-3'>
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
                <Button variant="outline" className='cursor-pointer' disabled={loadingData} size="lg" onClick={handleClickSearch}>
                  {loadingData ? 
                      <><><Loader2 className='animate-spin' /> Consultando</></> :
                      <><Search /> Consultar</>}
                </Button>
            </div>
            <div className="mt-8">
              <Tabs defaultValue='lugPob'>
                <TabsList>
                  <TabsTrigger value='lugPob' className='cursor-pointer'>
                    Lugares Poblados
                  </TabsTrigger>
                  <TabsTrigger value='historial' className='cursor-pointer'>
                    Historial del departamento
                  </TabsTrigger>
                </TabsList>
                <TabsContent value='lugPob'>
                  <DataTable columns={columns} data={lugaresPobladosHistorial} />
                </TabsContent>
                <TabsContent value='historial'>
                  {historiales && historiales.map((historial, index) => (
                    <div key={index} className='mt-5'>
                      <h2 className="text-start scroll-m-20 pb-2 text-xl font-semibold tracking-tight first:mt-0">
                        {historial.NombreDepartamento}
                      </h2>
                      <DataTable columns={columnsBit} data={historial.bitacoras} />
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
        </div>
    </>
  )
}
