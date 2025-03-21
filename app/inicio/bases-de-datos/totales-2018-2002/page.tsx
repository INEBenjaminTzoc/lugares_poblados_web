"use client"

import { multiSelectTemplate } from '@/lib/multiselect.interface'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Departamento } from '../../departamentos/columns'
import { MultiSelect } from '@/components/multi-select'
import { Municipio } from '../../municipios/listar-municipios/columns'
import { Button } from '@/components/ui/button'
import { Loader2, Search } from 'lucide-react'
import { AldeasCaserios2002, AldeasCaserios2018, columnsAldeasCaserios2002, columnsAldeasCaserios2018, columnsTotalesCombinados, TotalesCombinados } from './columns'
import { DataTable } from '@/components/data-table'
import moment from 'moment'

export default function Totales20182002() {
  const [ departamentos, setDepartamentos ] = useState<multiSelectTemplate[]>([]);
  const [ municipios, setMunicipios ] = useState<multiSelectTemplate[]>([]);
  const [ estados, setEstados ] = useState<multiSelectTemplate[]>([]);

  const [ departamentosSelected, setDepartamentosSelected ] = useState<number[]>([]);
  const [ municipiosSelected, setMunicipiosSelected ] = useState<number[]>([]);
  const [ estadosSelected, setEstadosSelected ] = useState<number[]>([]);
  const [ estadosMunicipioSelected, setEstadosMunicipioSelected ] = useState<string[]>([]);

  const [aldeasCaserios2018, setAldeasCaserios2018] = useState<AldeasCaserios2018[]>([]);
  const [aldeasCaserios2002, setAldeasCaserios2002] = useState<AldeasCaserios2002[]>([]);
  const [totalesCombinados, setTotalesCombinados] = useState<TotalesCombinados[]>([]);
  //-----------------------LOADERS---------------------------//
  const [loadingData, setLoadingData] = useState<boolean>(false);

  const EstadosMunicipio: multiSelectTemplate[] = [
      { value: 'T', label: 'Terminado' },
      { value: 'P', label: 'En Proceso' },
      { value: 'Y', label: 'Iguales' },
  ]

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

  const handleEstadoMunicipioChange = (valuesSelected: string[]) => {
    setEstadosMunicipioSelected(valuesSelected);
  };

  const handleClickSearch = async () => {
    setLoadingData(true);
    try {
        const res = await axios
            .post('/api/bases-de-datos/totales-2018-2002', 
            { 
                departamentos: departamentosSelected, 
                municipios: municipiosSelected, 
                estados: estadosSelected,
                estadosMunicipio: estadosMunicipioSelected });
        if (res.data.code !== 200) {
            toast.error("Error al obtener detalle");
            setAldeasCaserios2018([]);
            setAldeasCaserios2002([]);
            setTotalesCombinados([]);
            return;
        }
        const aldeasCaserios2018: AldeasCaserios2018[] = res.data.aldeasCaserios2018;
        const aldeasCaserios2002: AldeasCaserios2002[] = res.data.aldeasCaserios2002;
        const totalesCombinados: TotalesCombinados[] = res.data.totalesCombinados;
    
        setAldeasCaserios2018(aldeasCaserios2018);
        setAldeasCaserios2002(aldeasCaserios2002);
        setTotalesCombinados(totalesCombinados);
    } catch (error) {
        toast.error(`Error al obtener detalle: ${error}`);
        setAldeasCaserios2018([]);
        setAldeasCaserios2002([]);
        setTotalesCombinados([]);
    } finally {
      setLoadingData(false);
    }
  }

  return (
    <>
        <div className="py-5">
            <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Aldeas y Caserios Totales 2018 - 2002
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
                <div className='w-60'>
                  <MultiSelect 
                    options={EstadosMunicipio}
                    onValueChange={handleEstadoMunicipioChange}
                    placeholder='Estados Municipios'
                    maxCount={2}
                    variant="inverted"
                  />
                </div>
                <Button variant="outline" size="lg" disabled={loadingData} onClick={handleClickSearch}>
                  {loadingData ? 
                      <><><Loader2 className='animate-spin' /> Consultando</></> :
                      <><Search /> Consultar</>}
                </Button>
            </div>
            <DataTable columns={columnsAldeasCaserios2018} data={aldeasCaserios2018}
              fileName={`Aldeas y Caserios 2018 ${moment().format('DD-MM-YYYY')}`} />
            <DataTable columns={columnsAldeasCaserios2002} data={aldeasCaserios2002}
              fileName={`Aldeas y Caserios 2002 ${moment().format('DD-MM-YYYY')}`} />
            <DataTable columns={columnsTotalesCombinados} data={totalesCombinados}
              fileName={`Aldeas y Caserios 2002 - 2018 ${moment().format('DD-MM-YYYY')}`} />
        </div>
    </>
  )
}
