"use client"

import { multiSelectTemplate } from '@/lib/multiselect.interface';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Departamento } from '../../departamentos/columns';
import { toast } from 'sonner';
import { MultiSelect } from '@/components/multi-select';
import { Municipio } from '../../municipios/listar-municipios/columns';
import { Button } from '@/components/ui/button';
import { File, Loader2, Search } from 'lucide-react';
import { ArchivoLugarPoblado, columns, DetalleLugarPoblado, SituadoConstitucional, TotalesPorCategoria, UltimaActualizacion } from './columns';
import { DataTable } from '@/components/data-table';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import moment from 'moment';
import { PDFViewer } from '@react-pdf/renderer'
import ReporteLugaresPoblados from '@/components/reporte-lugares-poblados';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ListarSegunCategorias() {
  //-----------------------LISTAS PARA SELECTORES------------------------//
  const [ departamentos, setDepartamentos ] = useState<Departamento[]>([]);
  const [ municipios, setMunicipios ] = useState<Municipio[]>([]);
  const [ estados, setEstados ] = useState<multiSelectTemplate[]>([]);
  const [ categorias, setCategorias ] = useState<multiSelectTemplate[]>([]);
  //-----------------------LISTAS DE VALORES SELECCIONADOS----------------------------//
  const [ departamentoSelected, setDepartamentoSelected ] = useState<Departamento>();
  const [ municipioSelected, setMunicipioSelected ] = useState<Municipio>();
  const [ estadosSelected, setEstadosSelected ] = useState<number[]>([]);
  const [ categoriasSelected, setCategoriasSelected ] = useState<number[]>([]);
  //----------------------LISTA DE DETALLE LUGARES POBLADOS------------------------//
  const [ lugaresPoblados, setLugaresPoblados ] = useState<DetalleLugarPoblado[]>([]);
  const [ totalesPorCategoria, setTotalesPorCategoria ] = useState<TotalesPorCategoria[]>([]);
  const [ situadoConstitucional, setSituadoConstitucional ] = useState<SituadoConstitucional[]>([]);
  const [ UltimaActualizacion, setUltimaActualizacion ] = useState<UltimaActualizacion[]>([]);
  //--------------------------VARIABLES DIALOGO---------------------------//
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>("ARCHIVOS DISPONIBLES");
  const [archivos, setArchivos] = useState<ArchivoLugarPoblado[] | null>(null);
  const [blobUrl, setBlobUrl] = useState<string>();

  //-----------------------VARIABLES PARA REPORTE---------------------------//
  const [openDialogReport, setOpenDialogReport] = useState<boolean>(false);
  const [stateReporte, setStateReporte] = useState<boolean>(false);
  const [fecha, setFecha] = useState<string>("");

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

          const resEstados = await axios.get('/api/estados');
          if (resEstados.data.code !== 200) {
              toast.error("Error al obtener los estados");
              return;
          }
          const estados: { idestado: number, etiqueta: string }[] = resEstados.data.estados;
          setEstados(
              estados.map((est) => ({
                  value: est.idestado.toString(),
                  label: est.etiqueta
              }))
          )

          const resCategorias = await axios.get('/api/categorias');
          if (resEstados.data.code !== 200) {
            toast.error("Error al obtener las categorias");
            return;
          }
          const categorias: { idcategoria: number, etiqueta: string }[] = resCategorias.data.categorias;
        } 
        catch (error) 
        {
          toast.error(`Error al obtener datos: ${error}`);
          setDepartamentos([]);
          setEstados([]);
        }
    }
  
    getInitialData();
  }, []);

  const handleDepartamentoSeleccionadoChange = async (value: string) => {
    try {
        setMunicipios([]);
        const depto = departamentos.find(depto => parseInt(depto.id) === parseInt(value));
        setDepartamentoSelected(depto);
    
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

  const handleEstadoChange = (valuesSelected: string[]) => {
    const valuesParsed = valuesSelected.map(value => parseInt(value)) as number[];
    setEstadosSelected(valuesParsed);
  }

  const handleClickSearch = async () => {
    const res = await axios
        .post('/api/lugares-poblados/listar-segun-categoria', 
          { 
            departamento: departamentoSelected?.id, 
            municipio: municipioSelected?.idMunicipio, 
            estado: estadosSelected });
    if (res.data.code !== 200) {
        toast.error("Error al obtener detalle");
        return;
    }
    const detalleLugaresPoblados: DetalleLugarPoblado[] = res.data.lugaresPoblados;
    setLugaresPoblados(detalleLugaresPoblados);
    const totalesPorCategoria: TotalesPorCategoria[] = res.data.totalesPorCategoria;
    setTotalesPorCategoria(totalesPorCategoria);
    const situadoConstitucional: SituadoConstitucional[] = res.data.situadoConstitucional;
    setSituadoConstitucional(situadoConstitucional);
    const ultimaModificacion: UltimaActualizacion[] = res.data.ultimaModificacion;
    setUltimaActualizacion(ultimaModificacion);
  }

  //----------------------------MANEJO DE ARCHIVOS--------------------------//
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

  const generarReporte = () => {
    setStateReporte(true);
    setTimeout( ()=> {
        const fecha = moment().format('DD/MM/YYYY HH[h]:mm[m]:ss[s]');
        setFecha(fecha);
    }, 300)
  }

  useEffect(() => {
    if (fecha !== '') {
        setOpenDialogReport(true);
    }
  }, [fecha]);

  useEffect(() => {
    if (openDialogReport === true) {
        setStateReporte(false);
    }
  }, [openDialogReport])

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
            <div className='w-full flex flex-row mt-4 gap-x-3'>
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
                <Button variant="outline" size="lg" className='cursor-pointer' onClick={generarReporte}>
                    {stateReporte ? 
                            <><Loader2 className='animate-spin' /> Generando Reporte</> :
                            <><File /> Generar Reporte</>
                    }
                </Button>
            </div>
            <DataTable columns={columns(handleVerArchivosClick)} data={lugaresPoblados} />
        </div>
        <Dialog open={openDialogReport} onOpenChange={() => { setOpenDialogReport(false) }}>
            <DialogContent className='px-0 py-0 h-[90vh] sm:max-w-[90vw] w-[90vw] overflow-hidden'>
                <DialogTitle className='sr-only'>Reporte Lugares Poblados</DialogTitle>
                <DialogDescription className='sr-only'>archivos del lugar poblado</DialogDescription>
                <div className="w-full h-full">
                    <div className='h-[50px] w-full px-5 flex items-center'>
                        Reporte de Lugares Poblados: {municipioSelected?.municipio} - {departamentoSelected?.nombre}
                    </div>
                    <main className='flex h-[calc(100%-50px)] flex-1 flex-col overflow-hidden px-5 pb-5'>
                        {openDialogReport && 
                            <PDFViewer className='w-full h-full'>
                                <ReporteLugaresPoblados 
                                    departamento={departamentoSelected?.nombre}
                                    municipio={municipioSelected?.municipio}
                                    fecha={fecha}
                                    estados={estadosSelected}
                                    detalleLugaresPoblados={lugaresPoblados}
                                    totalesPorCategoria={totalesPorCategoria}
                                    situadoConstitucional={situadoConstitucional}
                                    UltimaActualizacion={UltimaActualizacion} />
                            </PDFViewer>
                        }
                    </main>
                </div>
            </DialogContent>
        </Dialog>
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
