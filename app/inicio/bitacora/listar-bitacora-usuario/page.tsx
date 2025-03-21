"use client"

import axios from 'axios';
import React, { use, useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Bitacora, columnsBit, Usuario } from './columns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import moment from 'moment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ListarBitacoraUsuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario>();

  const [bitacoraCreacion, setBitacoraCreacion] = useState<Bitacora[]>([]);
  const [bitacoraModificacion, setBitacoraModificacion] = useState<Bitacora[]>([]);
  //-----------------------LOADERS---------------------------//
  const [loadingData, setLoadingData] = useState<boolean>(false);

  useEffect(() => {
    const getUsuarios = async () => {
        try {
            const res = await axios.get('/api/usuarios');
            if (res.data.code !== 200) {
                toast.error("Error al obtener los departamentos");
                return;
            }
            const usuarios: Usuario[] = res.data.usuarios;
            setUsuarios(usuarios);
        } 
        catch (error) 
        {
            toast.error(`Error al obtener usuarios: ${error}`);
            setUsuarios([]);
        }
    }

    getUsuarios();
  }, []);

  const handleUsuarioSeleccionadoChange = (valueSelected: string) => {
    setBitacoraCreacion([]);
    setBitacoraModificacion([]);
    const usuario = usuarios.find(user => user.idUsuario === parseInt(valueSelected));
    setUsuarioSeleccionado(usuario);
  }

  const handleClickSearch = async () => {
    setLoadingData(true);
    try {
      const res = await axios
        .post('/api/bitacora/bitacora-usuario-creacion', 
        { usuario: usuarioSeleccionado?.Nombre });
      if (res.data.code !== 200) {
          toast.error("Error al obtener detalle");
          return;
      }
      const bitacoraCreacion: Bitacora[] = res.data.bitacoraCreacion;
      const bitacoraCreacionFormateada = bitacoraCreacion.map(registro => ({
        ...registro,
        FechaC: moment(registro.FechaC).format('DD-MM-YYYY'),
        FechaM: moment(registro.FechaM).format('DD-MM-YYYY')
      }))
      setBitacoraCreacion(bitacoraCreacionFormateada);

      const bitacoraModificacion: Bitacora[] = res.data.bitacoraModificacion;
      const bitacoraModificacionFormateada = bitacoraModificacion.map(registro => ({
        ...registro,
        FechaC: moment(registro.FechaC).format('DD-MM-YYYY'),
        FechaM: moment(registro.FechaM).format('DD-MM-YYYY')
      }))
      setBitacoraModificacion(bitacoraModificacionFormateada);
    } 
    catch (error) 
    {
      toast.error(`Error al obtener detalle: ${error}`);
      setBitacoraCreacion([]);
      setBitacoraModificacion([]);
    } finally {
      setLoadingData(false);
    }
  }

  return (
    <>
      <div className="py-5">
        <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Bitácora por Usuario
        </h2>
        <div className='w-full flex flex-row flex-wrap mt-4 gap-3'>
          <div className='w-auto'>
            <Select onValueChange={handleUsuarioSeleccionadoChange}>
                <SelectTrigger className='w-60'>
                    <SelectValue placeholder="Usuario de creación" />
                </SelectTrigger>
                <SelectContent className='max-h-[20rem]'>
                  {usuarios && usuarios.length > 0 && usuarios.map((user) => (
                    <SelectItem key={user.idUsuario} value={user.idUsuario.toString()}>
                      <div className='flex flex-col'>
                        {user.Nombre}
                        <p className='text-muted-foreground text-xs'>{user.Puesto}</p>
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
        <div className="mt-8">
          <Tabs defaultValue='creacion'>
            <TabsList>
              <TabsTrigger value='creacion' className='cursor-pointer'>
                Creados por {usuarioSeleccionado?.Nombre}
              </TabsTrigger>
              <TabsTrigger value='modificacion' className='cursor-pointer'>
                Modificados por {usuarioSeleccionado?.Nombre}
              </TabsTrigger>
            </TabsList>
            <TabsContent value='creacion'>
              <DataTable columns={columnsBit} data={bitacoraCreacion}
                fileName={`Bitacora Creados por ${usuarioSeleccionado?.Nombre} ${moment().format('DD-MM-YYYY')}`} />
            </TabsContent>
            <TabsContent value='modificacion'>
              <DataTable columns={columnsBit} data={bitacoraModificacion}
                fileName={`Bitacora Modificados por ${usuarioSeleccionado?.Nombre} ${moment().format('DD-MM-YYYY')}`} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
