"use client"

import { multiSelectTemplate } from '@/lib/multiselect.interface';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Departamento } from '../../departamentos/columns';
import { toast } from 'sonner';
import { MultiSelect } from '@/components/multi-select';
import { Municipio } from '../../municipios/listar-municipios/columns';
import { Button } from '@/components/ui/button';
import { File, Search } from 'lucide-react';
import { ArchivoLugarPoblado, columns, DetalleLugarPoblado } from './columns';
import { DataTable } from '@/components/data-table';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import moment from 'moment';
import { Font, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import ReporteLugaresPoblados from '@/components/reporte-lugares-poblados';
import DownloadButton from '@/components/download-pdf-button';

export default function ListarSegunCategorias() {
  //-----------------------LISTAS PARA SELECTORES------------------------//
  const [ departamentos, setDepartamentos ] = useState<multiSelectTemplate[]>([]);
  const [ municipios, setMunicipios ] = useState<multiSelectTemplate[]>([]);
  const [ estados, setEstados ] = useState<multiSelectTemplate[]>([]);
  //-----------------------LISTAS DE VALORES SELECCIONADOS----------------------------//
  const [ departamentosSelected, setDepartamentosSelected ] = useState<number[]>([]);
  const [ municipiosSelected, setMunicipiosSelected ] = useState<number[]>([]);
  const [ estadosSelected, setEstadosSelected ] = useState<number[]>([]);
  //----------------------LISTA DE DETALLE LUGARES POBLADOS------------------------//
  const [ lugaresPoblados, setLugaresPoblados ] = useState<DetalleLugarPoblado[]>([]);
  //--------------------------VARIABLES DIALOGO---------------------------//
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>("ARCHIVOS DISPONIBLES");
  const [archivos, setArchivos] = useState<ArchivoLugarPoblado[] | null>(null);
  const [blobUrl, setBlobUrl] = useState<string>();

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
            const res = await axios.get('/api/estados');
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
  
  const handleEstadoChange = (valuesSelected: string[]) => {
    const valuesParsed = valuesSelected.map(value => parseInt(value)) as number[];
    setEstadosSelected(valuesParsed);
  }

  const handleClickSearch = async () => {
    const res = await axios
        .post('/api/lugares-poblados/listar-segun-categoria', 
          { 
            departamento: departamentosSelected, 
            municipio: municipiosSelected, 
            estado: estadosSelected });
    if (res.data.code !== 200) {
        toast.error("Error al obtener detalle");
        return;
    }
    const detalleLugaresPoblados: DetalleLugarPoblado[] = res.data.lugaresPoblados;
    setLugaresPoblados(detalleLugaresPoblados);
  }

  const handleVerArchivosClick = async (idLugarPoblado: number) => {
    const lugPob = lugaresPoblados.find(lugPob => lugPob.ID_LugarPoblado === idLugarPoblado);
    if (lugPob)
        setDialogTitle(`ARCHIVOS: ${lugPob?.Nombre} - ${lugPob?.Municipio} - ${lugPob?.Departamento}`);
    
    const getArchivos = await axios.get(`/api/lugares-poblados/listar-segun-categoria/get-archivos/${idLugarPoblado}`);
    if (getArchivos.data.code !== 200) {
        toast.error("Error al obtener archivos");
        return;
    }
    const archivosDisponibles: ArchivoLugarPoblado[] = getArchivos.data.archivosDisponibles;
    setArchivos(archivosDisponibles);
  }

  useEffect(() => {
    const selectFirstFile = async () => {
        if (archivos && archivos.length > 0) {
            const url = await getArchivoUrl(archivos[0].ID_Archivo);
            setBlobUrl(url);
      
            setDialogIsOpen(true);  //SE ABRE EL DIALOG
            return () => {
              URL.revokeObjectURL(url);
            }
        }
        if (archivos) toast.error("Ningún archivo encontrado");
    }
  
    selectFirstFile();
  }, [archivos])

  const getArchivoUrl = async (idArchivo: number) => {
    try {
        //SE OBTIENE EL ARCHIVO SELECCIONADO
        const archivoSeleccionado = archivos?.find(archivo => archivo.ID_Archivo === idArchivo);
        if (!archivoSeleccionado) {
            toast.error("Error al encontrar el archivo");
            return '';
        }
        const res = await axios.get(`/api/lugares-poblados/listar-segun-categoria/download-archivo/${archivoSeleccionado?.ID_Archivo}`);
        if (res.data.code !== 200) {
            toast.error("Error al obtener datos del archivo");
            return '';
        }
        //CONVERSION DEL ARCHIVO DE BASE64 A BLOB DEBIDO A QUE EXISTEN ARCHIVOS DE MUCHO PESO
        const byteArray = Uint8Array.from(atob(res.data.ArchivoBase64), (char) => char.charCodeAt(0));
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        
        return url;
    } catch (error) {
        console.error(error)
        return '';
    }
  }

  return (
    <>
        <div className="py-5">
            <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Reporte Lugares Poblados Según Categoría
            </h2>
            <div className="w-full px-16">
                <p className="text-center text-lg text-muted-foreground">
                    Según las proyecciones del <span className='font-semibold'> Instituto Nacional de Estadística</span> 
                    , con base en el censo nacional de población 2002.
                </p>
            </div>
            <PDFViewer className='w-full h-[90vh]'>
                <ReporteLugaresPoblados/>
            </PDFViewer>
            <div className='w-full flex flex-row mt-4 gap-x-3'>
                <div className='w-52'>
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
                <Button variant="outline" size="lg" className='cursor-pointer' onClick={handleClickSearch}>
                    <Search /> Consultar
                </Button>
            </div>
            <DataTable columns={columns(handleVerArchivosClick)} data={lugaresPoblados} />
            <DownloadButton />
        </div>
        <Dialog open={dialogIsOpen} onOpenChange={() => { setDialogIsOpen(!dialogIsOpen) }}>
            <DialogContent className='px-0 pt-5 h-[90vh] sm:max-w-[90vw] w-[90vw] overflow-hidden'>
            <DialogTitle className='px-5'>{dialogTitle}</DialogTitle>
            <DialogDescription className='sr-only'>archivos del lugar poblado</DialogDescription>
            <div className="w-full h-full">
                <SidebarProvider className="items-start h-full">
                <Sidebar collapsible="none" className="hidden md:flex">
                    <SidebarContent className='py-3'>
                    <SidebarGroup>
                        <SidebarGroupContent>
                        <SidebarMenu>
                            {archivos && archivos.length > 0 && archivos.map((archivo) => (
                            <SidebarMenuItem key={archivo.ID_Archivo}>
                                <SidebarMenuButton asChild>
                                <a href="#">
                                    <File />
                                    <div className='flex flex-col'>
                                    <p className='whitespace-normal'>{archivo.Numero} - {archivo.Tipo_Archivo}</p>
                                    <p className='text-xs text-muted-foreground'>
                                        {moment(archivo.Fecha).format('DD-MM-YYYY')}
                                    </p>
                                    </div>
                                </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
                <main className='flex h-full flex-1 flex-col overflow-hidden'>
                    <iframe src={blobUrl} 
                    title="Archivo" className="flex-1" style={{ border: 'none' }} />
                </main>
                </SidebarProvider>
            </div>
            </DialogContent>
      </Dialog>
    </>
  )
}
