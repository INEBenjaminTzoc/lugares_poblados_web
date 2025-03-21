"use client"

import axios from 'axios';
import React, { useState } from 'react'
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { columns, MunicipioMapa } from './columns';
import { DataTable } from '@/components/data-table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import moment from 'moment';

export default function MapaInteractivo() {
  const [selectedDepto, setSelectedDepto] = useState(null);
  const geoUrl = "https://raw.githubusercontent.com/minfin-bi/mapas/main/deptos.json";

  const [municipios, setMunicipios] = useState<MunicipioMapa[]>([]);

  const handleChangeDepartamento = async (departamento: any) => {
    setSelectedDepto(departamento.Departamento);

    const idDepartamento = parseInt(departamento.id.toString().slice(0, -2));
    const res = await axios.post('/api/mapa-interactivo', { idDepartamento });
    const municipios: MunicipioMapa[] = res.data.municipios;
    setMunicipios(municipios);
  }

  return (
    <>
        <div className='py-5'>
          <h2 className="text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Mapa Interactivo
          </h2>
          <div className="w-full px-16 mb-8">
            <p className="text-center text-lg text-muted-foreground">
                La <span className='font-semibold'> República de Guatemala </span> 
                está conformada por 22 departamentos que agrupan a 340 municipios, 
                los cuales cuentan con un alto nivel de autonomía con respecto al gobierno central.
            </p>
          </div>
          {selectedDepto && 
            <h3 className="text-center scroll-m-20 pb-2 text-xl font-semibold tracking-tight first:mt-0">
              Reporte Situado Nacional - Municipios del Departamento de {selectedDepto}
            </h3>
          }
          <div className='h-full grid grid-cols-2'>
            <div className='aspect-square w-full'>
              <TooltipProvider>
                <ComposableMap
                  projection="geoMercator" 
                  projectionConfig={{ scale: 1000, center: [-90.3, 15.8], }} 
                  width={80} 
                  height={80}>
                    <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const isSelected = selectedDepto === geo.properties.Departamento;
                        return (
                          <Tooltip key={geo.properties.id}>
                            <TooltipTrigger asChild>
                              <Geography 
                                key={geo.rsmKey} 
                                geography={geo} 
                                onClick={() => handleChangeDepartamento(geo.properties)}
                                className={`${isSelected ? 'fill-[#0051B3]' : 'dark:fill-gray-400'}`}
                                style={{
                                  default: {
                                    outlineWidth: "0",
                                    border: "none",
                                    stroke: "#353535",
                                    strokeWidth: 0.1,
                                    cursor: "pointer"
                                  },
                                  hover: {
                                    fill: "#6A7282",
                                    outlineWidth: "0",
                                    border: "none",
                                    cursor: "pointer"
                                  },
                                  pressed: {
                                    fill: "#0051B3",
                                    outlineWidth: "0",
                                    border: "none",
                                  }
                                }} />
                            </TooltipTrigger>
                            <TooltipContent className='text-lg'>{geo.properties.Departamento}</TooltipContent>
                          </Tooltip>
                        )
                      })
                    }
                    </Geographies>
                </ComposableMap>
              </TooltipProvider>
            </div>
            <div className='aspect-square w-full'>
              <DataTable columns={columns} data={municipios} pdfOrientation='landscape'
                fileName={`Reporte Situado Nacional ${moment().format('DD-MM-YYYY')}`} />
            </div>
          </div>
        </div>
    </>
  )
}
