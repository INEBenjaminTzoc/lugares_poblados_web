"use client"

import React, { useEffect, useState } from 'react'
import { columns, Departamento } from './columns'
import axios from 'axios'
import { DataTable } from '@/components/data-table'
import { toast } from 'sonner'
import moment from 'moment'

export default function Departamentos() {
  const [ departamentos, setDepartamentos ] = useState<Departamento[]>([]);

  useEffect(() => {
    const getDepartamentos = async () => {
      try {
        const res = await axios.get('/api/departamentos');
        if (res.data.code !== 200) {
          toast.error("Error al obtener los departamentos");
          return;
        }
        const deptos: Departamento[] = res.data.departamentos;
        setDepartamentos(deptos);
      } 
      catch (error) 
      {
        toast.error(`Error al obtener departamentos: ${error}`);
        setDepartamentos([]);
      }
    }

    getDepartamentos();
  }, [])

  return (
    <>
      <div className="py-5">
        <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Reporte Departamental
        </h2>
        <div className="w-full px-16">
            <p className="text-center text-lg text-muted-foreground">
              La <span className='font-semibold'> República de Guatemala </span> 
              está dividida territorialmente en 22 departamentos, 
              que se pueden observar en la siguiente tabla.
            </p>
        </div>
        <DataTable columns={columns} data={departamentos} 
          fileName={`Reporte Departamental ${moment().format('DD-MM-YYYY')}`} />
      </div>
    </>
  )
}
