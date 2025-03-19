"use client"

import { PDFDownloadLink } from "@react-pdf/renderer";
import moment from "moment";
import { useEffect, useState } from "react"
import ReporteLugaresPoblados, { IData } from "./reporte-lugares-poblados";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

const DownloadButton = (data: IData) => {
  const [isClient, setIsClient] = useState(false);
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
  }, [])

  const generateDate = () => {
    const date = moment().format('DD/MM/YYYY HH[h]:mm[m]');
    console.log(date);
    setDate(date)
    return date;
  }

  return (
    <PDFDownloadLink 
      fileName={`Departamento-Municipio-${moment.now()}`}
      document={
        <ReporteLugaresPoblados 
          departamento={data.departamento} 
          municipio={data.municipio} 
          fecha={date}
        />
      }>
        {({ blob, url, loading, error }) => {
          const dat = moment().format('DD/MM/YYYY HH[h]:mm[m]');
          setDate(dat)
          return (
            loading ? <Loader2 className="animate-spin" /> : <Button onClick={generateDate}>Descargar</Button>
          );
        }}
    </PDFDownloadLink>
  )
}

export default DownloadButton;