"use client"

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { DataTable } from '@/components/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Departamento } from '../departamentos/columns';
import { Municipio } from '../municipios/listar-municipios/columns';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Search } from 'lucide-react';
import { columns, LugarPobladoMunicipio } from './columns';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import moment from 'moment';

export default function MapaInteractivo() {
    //-----------------------LISTAS PARA SELECTORES------------------------//
    const [ departamentos, setDepartamentos ] = useState<Departamento[]>([]);
    const [ municipios, setMunicipios ] = useState<Municipio[]>([]);
    //-----------------------LISTAS DE VALORES SELECCIONADOS----------------------------//
    const [ municipioSelected, setMunicipioSelected ] = useState<Municipio>();
    //----------------------LISTA DE DETALLE LUGARES POBLADOS------------------------//
    const [ lugaresPoblados, setLugaresPoblados ] = useState<LugarPobladoMunicipio[]>([]);
    //-----------------------LOADERS---------------------------//
    const [ loadingData, setLoadingData ] = useState<boolean>(false);
    const [ loadingUpdate, setLoadingUpdate ] = useState<boolean>(false);
    //-----------------------FILAS SELECCIONADAS---------------------------//
    const [selectedRows, setSelectedRows] = useState<LugarPobladoMunicipio[]>([]);
    const [nuevaObservacion, setNuevaObservacion] = useState<string>("");

    useEffect(() => {
        const getInitialData = async () => {
            try {
              const resDepartamentos = await axios.get('/api/departamentos');
              if (resDepartamentos.data.code !== 200) {
                toast.error("Error al obtener los departamentos");
                return;
              }
              const deptos: Departamento[] = resDepartamentos.data.departamentos;
              setDepartamentos(deptos);
            } 
            catch (error) 
            {
              toast.error(`Error al obtener datos: ${error}`);
              setDepartamentos([]);
            }
        }
      
        getInitialData();
    }, [])

    const handleDepartamentoSeleccionadoChange = async (value: string) => {
        setLugaresPoblados([]);
        try {
            setMunicipios([]);
            const depto = departamentos.find(depto => parseInt(depto.id) === parseInt(value));
        
            const res = await axios.get(`/api/municipios/lista-municipios/${parseInt(value)}`);
            if (res.data.code !== 200) {
                toast.error(`Error al obtener los municipios del departamento: ${depto?.nombre}`);
                return;
            }
            const municipios: Municipio[] = res.data.municipios;
            setMunicipios(municipios);
        } 
        catch (error) 
        {
            toast.error(`Error al obtener municipios: ${error}`);
            setMunicipios([]);
        }
    }

    const handleMunicipioSeleccionadoChange = async (value: string) => {
        try {
            const muni = municipios.find(mun => mun.idMunicipio === parseInt(value));
            setMunicipioSelected(muni);
        } 
        catch (error) 
        {
            toast.error(`Error al obtener municipio: ${error}`);
            setMunicipios([]);
        }
    }

    const handleClickSearch = async () => {
        try {
            setLoadingData(true);
            const res = await axios
                .post('/api/multiples-observaciones', 
                  { municipio: municipioSelected?.idMunicipio });
            if (res.data.code !== 200) {
                toast.error("Error al obtener detalle");
                return;
            }
            const detalleLugaresPoblados: LugarPobladoMunicipio[] = res.data.lugaresPoblados;
            setLugaresPoblados(detalleLugaresPoblados);
        } 
        catch (error) 
        {
            toast.error(`Error al obtener detalle: ${error}`);
            setLugaresPoblados([]);
        } 
        finally 
        {
            setLoadingData(false);
        }
    }

    const handleRowSelectionChange = (selected: LugarPobladoMunicipio[]) => {
        setSelectedRows(selected);
    };

    const handleClickUpdate = async () => {
        if (nuevaObservacion === "") {
            toast.warning("Debe digitar una nueva observación");
            return;
        }
        try {
            setLoadingUpdate(true);
            const updatedLugaresPoblados = [...lugaresPoblados];
    
            for (const registro of selectedRows) {
                try {
                    const res = await axios.put('/api/multiples-observaciones', {
                        idLugarPoblado: registro.ID,
                        nuevaObservacion: nuevaObservacion.trim()
                    });
    
                    if (res.data.code === 200) {
                        const index = updatedLugaresPoblados.findIndex(item => item.ID === registro.ID);
                        if (index !== -1) {
                            updatedLugaresPoblados[index] = {
                                ...updatedLugaresPoblados[index],
                                Observacion: nuevaObservacion.trim()
                            };
                        }
                    } else {
                        toast.error(`Error al actualizar el registro con ID ${registro.ID}`);
                    }
                } catch (error) {
                    toast.error(`Error al actualizar el registro con ID ${registro.ID}: ${error}`);
                }
            }
    
            setLugaresPoblados(updatedLugaresPoblados);
            toast.success("Registros actualizados correctamente");
        } catch (error) {
            toast.error(`Error al actualizar observaciones: ${error}`);
            setLugaresPoblados([]);
        } finally {
            setLoadingUpdate(false);
        }
    };

  return (
    <>
        <div className='py-5'>
          <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Múltiples Observaciones
          </h2>
          <div className='w-full flex flex-row flex-wrap mt-4 gap-3'>
            <div className='w-auto'>
              <Select onValueChange={handleDepartamentoSeleccionadoChange}>
                  <SelectTrigger className='w-60'>
                      <SelectValue placeholder="Departamento" />
                  </SelectTrigger>
                  <SelectContent className='max-h-[20rem]'>
                  {departamentos && departamentos.length > 0 && departamentos.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                      <div className='flex flex-col'>
                          {dept.nombre}
                      </div>
                      </SelectItem>
                  ))}
                  </SelectContent>
              </Select>
            </div>
            <div className='w-auto'>
              <Select onValueChange={handleMunicipioSeleccionadoChange}>
                <SelectTrigger className='w-60'>
                  <SelectValue placeholder="Municipio" />
                </SelectTrigger>
                <SelectContent className='max-h-[20rem]'>
                  {municipios && municipios.length > 0 && municipios.map((mun) => (
                  <SelectItem key={mun.idMunicipio} value={mun.idMunicipio.toString()}>
                  <div className='flex flex-col'>
                      {mun.municipio}
                  </div>
                  </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="lg" className='cursor-pointer' disabled={loadingData} onClick={handleClickSearch}>
                {loadingData ? 
                    <><><Loader2 className='animate-spin' /> Consultando</></> :
                    <><Search /> Consultar</>}
            </Button>
          </div>
          <DataTable 
            columns={columns} 
            data={lugaresPoblados} 
            onRowSelectionChange={handleRowSelectionChange}
            fileName={`Múltiples Observaciones ${moment().format('DD-MM-YYYY')}`} />
          <div className="grid w-full gap-1.5 mt-5 xl:px-[10rem]">
            <Label htmlFor="message-2" className='mb-3'>Nueva Observación:</Label>
            <div className='flex flex-row gap-3'>
                <Textarea 
                    placeholder="Digite la nueva observación aquí." 
                    id="message-2" 
                    value={nuevaObservacion} 
                    onChange={(e) => setNuevaObservacion(e.target.value)}
                />
                <Button variant="outline" size="lg" className='cursor-pointer' disabled={loadingUpdate || selectedRows.length === 0} onClick={handleClickUpdate}>
                    {loadingUpdate ? 
                        <><><Loader2 className='animate-spin' /> Modificando los registros</></> :
                        <><Save /> Guardar</>}
                </Button>
            </div>
            <p className="text-sm text-muted-foreground">
                Esta observación se aplicará a todos los registros seleccionados: {selectedRows.length} registros.
            </p>
          </div>
        </div>
    </>
  )
}
