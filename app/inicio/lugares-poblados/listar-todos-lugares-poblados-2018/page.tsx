"use client"

import React, { useEffect, useState } from 'react'
import { columns, DetalleLugarPoblado2018 } from './columns'
import { toast } from 'sonner';
import axios from 'axios';
import { DataTable } from '@/components/data-table';
import moment from 'moment';

export default function ListarTodosLugaresPoblados2018() {
  const [lugaresPoblados, setLugaresPoblados] = useState<DetalleLugarPoblado2018[]>([]);

  useEffect(() => {
    const getDetalle = async () => {
        try {
            const res = await axios.get('/api/lugares-poblados/listar-todos-lugares-poblados-2018');

            if (res.data.code !== 200) {
                toast.error("Error al obtener detalle");
                return;
            }
            const detalleLugaresPoblados: DetalleLugarPoblado2018[] = res.data.todosLugaresPoblados;
            setLugaresPoblados(detalleLugaresPoblados);
        } catch (error) {
            toast.error("Error al obtener detalle");
            setLugaresPoblados([]);
        }
    }

    getDetalle();
  }, [])

  return (
    <>
        <div className="py-5">
            <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Reporte Todos los Lugares Poblados 2018
            </h2>
            <div className="w-full px-16">
                <p className="text-center text-lg text-muted-foreground">
                    Según las proyecciones del <span className='font-semibold'> Instituto Nacional de Estadística</span> 
                    , con base en el censo nacional de población 2018.
                </p>
            </div>
            <DataTable columns={columns} data={lugaresPoblados} fileName={`Todos los Lugares Poblados 2018 ${moment().format('DD-MM-YYYY')}`} />
        </div>
    </>
  )
}
