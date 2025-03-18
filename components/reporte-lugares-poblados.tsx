import { Page, Text, View, Document, Image, StyleSheet } from '@react-pdf/renderer'
import INE from '@/public/img/INE.png'
import React from 'react'

export default function ReporteLugaresPoblados() {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <Image src={INE.src} style={styles.image}></Image>
          <View style={{paddingVertical: 10}}>
            <Text>Departamento: Alta Verapaz</Text>
            <Text>Municipio: Cobán</Text>
            <Text>Fecha: 17/03/2025 22h:26m</Text>
          </View>
          <View style={{paddingVertical: 10}}>
            <Text style={{fontSize: 11}}>
              CRITERIO 2: Lugares poblados que se encuentran en base de datos del Instituto Nacional de Estadística 
              (correspondientes al XI Censo Nacional de Población y VI de habitación de 2002) pero con categoría 
              distinta de la reportada en certificación enviada por la municipalidad en el presente año, entiéndase 
              entre aldea y caserío o viceversa.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 55,
    height: 55
  },
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    fontSize: 14
  },
  section: {
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    flexGrow: 1
  }
});