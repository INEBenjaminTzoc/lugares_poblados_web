"use client"

import { PDFDownloadLink } from "@react-pdf/renderer";
import moment from "moment";
import { useEffect, useState } from "react"
import ReporteLugaresPoblados from "./reporte-lugares-poblados";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

const DownloadButton = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [])

  return isClient ? (
    <PDFDownloadLink 
      fileName={`Departamento-Municipio-${moment.now()}`}
      document={<ReporteLugaresPoblados/>}>
        <Button>Descargar</Button>
    </PDFDownloadLink>
  ) : (
    <Loader2 className="animate-spin" />
  )
}

export default DownloadButton;