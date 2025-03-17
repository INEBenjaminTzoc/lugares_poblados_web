"use client"

import React, { useState } from 'react'
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

export default function MapaInteractivo() {
  const [selectedDepto, setSelectedDepto] = useState(null);
  const geoUrl = "https://raw.githubusercontent.com/minfin-bi/mapas/main/deptos.json";

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
        <div className="h-80 w-80 bg-gray-400">
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
                    <Geography key={geo.rsmKey} geography={geo} onClick={() => setSelectedDepto(geo.properties.Departamento)}
                      style={{
                        default: {
                          fill: isSelected ? "#0051B3" : "#F2F2F2",
                          outlineWidth: "0",
                          border: "none",
                          stroke: "#CCC",
                          strokeWidth: 0.1,
                        },
                        hover: {
                          fill: "#0051B3",
                          outlineWidth: "0",
                          border: "none",
                        },
                        pressed: {
                          fill: "#0051B3",
                          outlineWidth: "0",
                          border: "none",
                        }
                      }} />
                  )
                })
              }
              </Geographies>
          </ComposableMap>
        </div>
      </div>
    </>
  )
}
