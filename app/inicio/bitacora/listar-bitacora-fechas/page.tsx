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

export default function ListarBitacoraFechas() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2018, 1, 1),
    to: addDays(new Date(2020, 1, 1), 20),
  });
  const [bitacoraFechas, setBitacoraFechas] = useState<Bitacora[]>([]);
  //-----------------------LOADERS---------------------------//
  const [loadingData, setLoadingData] = useState<boolean>(false);
  
  const handleClickSearch = async () => {
    setLoadingData(true);
    try {
      if (date?.from && date?.to) {
        const formattedFrom = format(date.from, 'yyyy-MM-dd');
        const formattedTo = format(date.to, 'yyyy-MM-dd');

        const res = await axios
          .post('/api/bitacora/bitacora-fechas', 
          { fechaInicio: formattedFrom, 
            fechaFin: formattedTo
          });
          console.log(res);
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
    } 
    catch (error) 
    {
      toast.error(`Error al obtener detalle: ${error}`);
      setBitacoraFechas([]);
    } finally {
      setLoadingData(false);
    }
  }

  return (
    <>
      <div className="py-5">
        <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Bitácora por Rango de Fechas
        </h2>
        <div className='w-full flex flex-row flex-wrap mt-4 gap-3'>
          <div className='w-auto'>
            <Popover>
              <PopoverTrigger asChild>
                <Button id='date' variant="outline" 
                  className={cn("w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground")}>
                      <CalendarIcon />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "dd-MM-yyyy")} -{" "}
                            {format(date.to, "dd-MM-yyyy")}
                          </>
                        ) : (
                          format(date.from, "dd-MM-yyyy")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar 
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button variant="outline" size="lg" className='cursor-pointer' disabled={loadingData} onClick={handleClickSearch}>
            {loadingData ? 
              <><><Loader2 className='animate-spin' /> Consultando</></> :
              <><Search /> Consultar</>}
          </Button>
        </div>
        <DataTable columns={columnsBit} data={bitacoraFechas} />
      </div>
    </>
  )
}
