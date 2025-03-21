"use client"

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Archivo, columns, Municipio } from './columns';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import moment from 'moment';
import { File } from 'lucide-react';

export default function Municipios() {
    const [ municipios, setMunicipios ] = useState<Municipio[]>([]);

    //---------------VARIABLES DIALOGO-----------------//
    const [ dialogIsOpen, setDialogIsOpen ] = useState<boolean>(false);
    const [ dialogTitle, setDialogTitle ] = useState<string>("ARCHIVOS DISPONIBLES");
    const [ archivos, setArchivos ] = useState<Archivo[] | null>(null);
    const [ blobUrl, setBlobUrl ] = useState<string>();

    useEffect(() => {
        const getMunicipios = async () => {
            try {
                const res = await axios.get('/api/municipios/lista-municipios');
                if (res.data.code !== 200) {
                    toast.error("Error al obtener municipios");
                    return;
                }
                const mpios: Municipio[] = res.data.municipios;
                setMunicipios(mpios);
            } 
            catch (error) 
            {
                toast.error(`Error al obtener municipios: ${error}`);
                setMunicipios([]);
            }
        }

        getMunicipios()
    }, []);

    const handleVerArchivosClick = async (idMunicipio: number) => {
        const municipio = municipios.find(mun => mun.idMunicipio === idMunicipio);
        if (municipio)
            setDialogTitle(`ARCHIVOS: ${municipio?.idMunicipio} ${municipio?.municipio} - ${municipio?.departamento}`);
        
        const getArchivos = await axios.get(`/api/municipios/lista-municipios/get-archivos/${idMunicipio}`);
        if (getArchivos.data.code !== 200) {
            toast.error("Error al obtener archivos");
            return;
        }
        const archivosDisponibles: Archivo[] = getArchivos.data.archivosDisponibles;
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

    const handleVerArchivo = async (idArchivo: number) => {
        const url = await getArchivoUrl(idArchivo);
        if(url === ''){
            toast.error("Error en la conversión del archivo");
            return;
        }

        setBlobUrl(url);
        
        return () => {
            URL.revokeObjectURL(url);
        }
    }
    
    const getArchivoUrl = async (idArchivo: number) => {
        try {
            //SE OBTIENE EL ARCHIVO SELECCIONADO
            const archivoSeleccionado = archivos?.find(archivo => archivo.ID_Archivo === idArchivo);
            if (!archivoSeleccionado) {
                toast.error("Error al encontrar el archivo");
                return '';
            }
            const res = await axios.get(`/api/municipios/lista-municipios/download-archivo/${archivoSeleccionado?.ID_Archivo}`);
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
                Reporte Municipal
            </h2>
            <div className="w-full px-16">
                <p className="text-center text-lg text-muted-foreground">
                    La <span className='font-semibold'> República de Guatemala </span> 
                    está conformada por 22 departamentos que agrupan a 340 municipios, 
                    los cuales cuentan con un alto nivel de autonomía con respecto al gobierno central.
                </p>
            </div>
            <DataTable columns={columns(handleVerArchivosClick)} data={municipios} fileName={`Reporte Municipal ${moment().format('DD-MM-YYYY')}`}/>
        </div>

        <Dialog open={dialogIsOpen} onOpenChange={() => { setDialogIsOpen(!dialogIsOpen) }}>
            <DialogContent className='px-0 pt-5 h-[90vh] sm:max-w-[90vw] w-[90vw] overflow-hidden'>
            <DialogTitle className='px-5'>{dialogTitle}</DialogTitle>
            <DialogDescription className='sr-only'>archivos del municipio</DialogDescription>
            <div className="w-full h-full">
                <SidebarProvider className="items-start h-full">
                <Sidebar collapsible="none" className="hidden md:flex">
                    <SidebarContent className='py-3'>
                    <SidebarGroup>
                        <SidebarGroupContent>
                        <SidebarMenu>
                            {archivos && archivos.length > 0 && archivos?.map((archivo) => (
                            <SidebarMenuItem key={archivo.ID_Archivo}>
                                <SidebarMenuButton asChild onClick={() => handleVerArchivo(archivo.ID_Archivo)}>
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
