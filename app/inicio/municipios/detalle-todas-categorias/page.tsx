"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { columns, TotalCategoria } from './columns';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import moment from 'moment';

export default function DetalleTodasCategorias() {
  const [ todasCategorias, setTodasCategorias ] = useState<TotalCategoria[]>([]);

  useEffect(() => {
    const getTodasCategorias = async () => {
        try {
            const res = await axios.get('/api/municipios/detalle-completo');
            if (res.data.code !== 200) {
                toast.error("Error al obtener detalle");
                return;
            }
            const detalleTodasCategorias: TotalCategoria[] = res.data.detalleTodasCategorias;
            setTodasCategorias(detalleTodasCategorias);
        } catch (error) {
            toast.error(`Error al obtener detalle: ${error}`);
            setTodasCategorias([]);
        }
    }

    getTodasCategorias();
  }, [])

  return (
    <>
        <div className="py-5">
            <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Reporte Detalle Todas las Categorías
            </h2>
            <div className="w-full px-16">
                <p className="text-center text-lg text-muted-foreground">
                    La <span className='font-semibold'> República de Guatemala </span> 
                    está conformada por 22 departamentos que agrupan a 340 municipios, 
                    los cuales cuentan con un alto nivel de autonomía con respecto al gobierno central.
                </p>
            </div>
            <DataTable columns={columns} data={todasCategorias} fileName={`Reporte Detalle Todas las Categorías ${moment().format('DD-MM-YYYY')}`} />
        </div>
    </>
  )
}
