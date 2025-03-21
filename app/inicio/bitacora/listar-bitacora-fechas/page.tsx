"use client"

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { addDays, format } from 'date-fns'
import { CalendarIcon, Loader2, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { toast } from 'sonner'
import { Bitacora, columnsBit } from '../listar-bitacora-usuario/columns'
import { DataTable } from '@/components/data-table'
import moment from 'moment'
import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'

export default function ListarBitacoraFechas() {
  //----------------------FECHAS SELECCIONADAS---------------------------//
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date());
  //----------------------DETALLE LUGARES POBLADOS--------------------//
  const [bitacoraFechas, setBitacoraFechas] = useState<Bitacora[]>([]);
  //-----------------------LOADERS---------------------------//
  const [loadingData, setLoadingData] = useState<boolean>(false);
  
  const handleClickSearch = async () => {
    setLoadingData(true);
    try {
      const res = await axios
        .post('/api/bitacora/bitacora-fechas', 
        { fechaInicio: moment(selectedStartDate).format('YYYY-MM-DD'), 
          fechaFin: moment(selectedEndDate).format('YYYY-MM-DD')
        });
      if (res.data.code !== 200) {
          toast.error("Error al obtener detalle");
          return;
      }
      const bitacora: Bitacora[] = res.data.bitacoraFechas;
      const bitacoraCreacionFormateada = bitacora.map(registro => ({
        ...registro,
        FechaC: moment(registro.FechaC).format('DD-MM-YYYY'),
        FechaM: moment(registro.FechaM).format('DD-MM-YYYY')
      }))
      setBitacoraFechas(bitacoraCreacionFormateada);
    } 
    catch (error) 
    {
      toast.error(`Error al obtener detalle: ${error}`);
      setBitacoraFechas([]);
    } finally {
      setLoadingData(false);
    }
  }

  const handleStartDateChange = (date: Date) => {
    setSelectedStartDate(date);
  };
  
  const handleEndDateChange = (date: Date) => {
    setSelectedEndDate(date);
  };

  return (
    <>
      <div className="py-5">
        <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Bitácora por Rango de Fechas
        </h2>
        <div className='w-full flex flex-row flex-wrap mt-4 gap-3'>
          <div className='w-auto'>
            <Label className='mb-2'>Fecha inicial:</Label>
            <DatePicker onDateChange={handleStartDateChange} />
          </div>
          <div className='w-auto'>
            <Label className='mb-2'>Fecha final:</Label>
            <DatePicker onDateChange={handleEndDateChange} />
          </div>
          <Button variant="outline" size="lg" className='cursor-pointer self-end' 
            disabled={loadingData} onClick={handleClickSearch}>
            {loadingData ? 
              <><><Loader2 className='animate-spin' /> Consultando</></> :
              <><Search /> Consultar</>}
          </Button>
        </div>
        <DataTable columns={columnsBit} data={bitacoraFechas}
          fileName={`Bitacora por Fechas ${moment().format('DD-MM-YYYY')}`} />
      </div>
    </>
  )
}
