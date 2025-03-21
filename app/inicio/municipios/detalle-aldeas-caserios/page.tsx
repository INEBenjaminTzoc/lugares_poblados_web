"use client"

import { DataTable } from '@/components/data-table'
import React, { useEffect, useState } from 'react'
import { columns, DetalleAldeaCaserio } from './columns'
import axios from 'axios'
import { toast } from 'sonner'
import moment from 'moment'

export default function DetalleAldeasCaserios() {
  const [ aldeasCaserios, setAldeasCaserios ] = useState<DetalleAldeaCaserio[]>([]);

  useEffect(() => {
    const getDetalleAldeasCaserios = async () => {
        try {
            setAldeasCaserios([]);
            const res = await axios.get('/api/municipios/detalle-aldeas-caserios');
            const detalleAldeasCaserios: DetalleAldeaCaserio[] = res.data.detalleAldeasCaserios;
            setAldeasCaserios(detalleAldeasCaserios);
        } 
        catch (error) 
        {
            toast.error(`Error al obtener detalle: ${error}`);
            setAldeasCaserios([]);
        }
    }

    getDetalleAldeasCaserios();
  }, [])
  
  return (
    <>
        <div className="py-5">
            <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Reporte Aldeas Caserios
            </h2>
            <div className="w-full px-16">
                <p className="text-center text-lg text-muted-foreground">
                    La <span className='font-semibold'> República de Guatemala </span> 
                    está conformada por 22 departamentos que agrupan a 340 municipios, 
                    los cuales cuentan con un alto nivel de autonomía con respecto al gobierno central.
                </p>
            </div>
            <DataTable 
                columns={columns} 
                data={aldeasCaserios} 
                pdfOrientation='landscape' 
                fileName={`Reporte Aldeas Caserios ${moment().format('DD-MM-YYYY')}`} />
        </div>
    </>
  )
}
