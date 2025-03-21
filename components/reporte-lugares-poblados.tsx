"use client"

import { Page, Text, View, Document, Image, StyleSheet, Line } from '@react-pdf/renderer'
import INE from '@/public/img/INE.png'
import TextoINE from '@/public/img/TextoINE.png'
import RLP from '@/public/img/rlp.png'
import React from 'react'
import { DetalleLugarPoblado, SituadoConstitucional, TotalesPorCategoria, UltimaActualizacion } from '@/app/inicio/lugares-poblados/listar-segun-categorias/columns'
import moment from 'moment'

const data = {
  title: 'Table title',
  headers: ['No.', 'Lugar Poblado', 'Pertenencia', 'Categoría', 'Criterio'],
  rows: [
    ['1', 'BALBATZUL I', 'Cobán', 'CASERIO', '2'],
    ['2', 'BALBATZUL II', 'Cobán', 'ALDEA', '1'],
    ['3', 'BALBATZUL III', 'Cobán', 'BARRIO', '3'],
    ['3', 'BALBATZUL III', 'Cobán', 'BARRIO', '3'],
    ['3', 'BALBATZUL III', 'Cobán', 'BARRIO', '3'],
    ['3', 'BALBATZUL III', 'Cobán', 'BARRIO', '3']
  ],
  footer: 'footer'
}

const criterios: { [key: number]: string } = {
  1: "Lugares poblados que se encuentran en base de datos del Instituto Nacional de Estadística (correspondientes al XI Censo Nacional de Población y VI de habitación de 2002) y en certificación enviada por la municipalidad en el presente año, con categoría igual, entiéndase coincidencias.",
  2: "Lugares poblados que se encuentran en base de datos del Instituto Nacional de Estadística (correspondientes al XI Censo Nacional de Población y VI de habitación de 2002) pero con categoría distinta de la reportada en certificación enviada por la municipalidad en el presente año, entiéndase entre aldea y caserío o viceversa.",
  3: "Lugares poblados que se encuentran en base de datos del Instituto Nacional de Estadística (correspondientes al XI Censo Nacional de Población y VI de habitación de 2002), con categoría diferente a Aldea y Caserío de la reportada en certificación enviada por la municipalidad en el presente año.",
  4: "Lugares poblados que no obran en base de datos del Instituto Nacional de Estadística (correspondientes al XI Censo Nacional de Población y VI de habitación de 2002) pero si los reporta la municipalidad en certificación enviada en el presente año, entiéndase que técnicamente se reconocerá como un lugar poblado nuevo.",
  5: "Lugares poblados que se encuentran en base de datos del Instituto Nacional de Estadística correspondientes al XI Censo Nacional de Población y VI de habitación de 2002. Se resaltan los Caseríos que no son reconocidos por la municipalidad en el acta remitida en el presente año.",
  6: "Lugares poblados avalados con actas y/o acuerdos del Concejo Municipal, previos a las modificaciones del código municipal, que entraron en vigencia en el año 2010, en donde indica nombre, categoría y otras referencias.",
  7: "Otros Casos. Son casos aislados que no encajan en ningún aspecto legal o técnico o que se debe aclarar su situación, el cual no debe sumar en el conteo de aldeas y caseríos.",
  8: "Lugares poblados (Caseríos y Aldeas) cuya elevación de categoría es avalada por los dictámenes favorables de la Oficina Municipal de Planificación, del Instituto Nacional de Estadística y del Instituto de Fomento Municipal como lo establece el Artículo 22 del Código Municipal.",
  9: "Municipalidad con caso especial. Lugares poblados (Caseríos y Aldeas), cuyo dato estadístico es tomado por parte de las autoridades del INE cuya fuente es: XII Censo Nacional de Población de Población y VII de Vivienda año 2018.",
  10: "Todos los lugares poblados que son reportados en certificación histórica aun No resuelta por el INE, por inconsistencias no definidas (Caso Especial San Francisco El Alto).",
};

export type IData = {
  departamento?: string
  municipio?: string
  fecha?: string
  estados?: number[]
  detalleLugaresPoblados: DetalleLugarPoblado[]
  totalesPorCategoria: TotalesPorCategoria[]
  situadoConstitucional: SituadoConstitucional[]
  UltimaActualizacion: UltimaActualizacion[]
}

const ReporteLugaresPoblados = (data: IData) => {
  const groupedDataByEstado = data.detalleLugaresPoblados?.reduce((acc, item) => {
    if (!acc[item.Estado]) {
      acc[item.Estado] = [];
    }
    acc[item.Estado].push(item);
    return acc;
  }, {} as {[key: number]: DetalleLugarPoblado[] });

  return (
    <Document title={`Reporte de Lugares Poblados: ${data.municipio} - ${data.departamento}`} >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.pageHeader} fixed>
          <Image src={INE.src} style={styles.logoINE}></Image>
          <Image src={TextoINE.src} style={styles.textoINE}></Image>
          <Image src={INE.src} style={styles.logoINE}></Image>
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>
            <Text style={{fontWeight: 'bold'}}>Departamento:</Text> {data.departamento}
          </Text>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={{width: '50%'}}>
            <Text style={{fontWeight: 'bold'}}>Municipio:</Text> {data.municipio}
            </Text>
            <Text style={{textAlign: 'right', fontSize: 10, width: '50%'}}>
              {data.fecha}
            </Text>
          </View>
          {data.estados?.sort((a, b) => a - b).map((estado) => (
            <>
              <View key={estado} style={{paddingVertical: 15}}>
                <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
                  <Text style={{fontWeight: 'bold'}}>CRITERIO {estado}:</Text> {criterios[estado]}
                </Text>
              </View>

              {groupedDataByEstado[estado]?.length > 0 ? (
                <View style={{width: '100%', height: 'auto'}}>
                  <View style={styles.table}>
                    {/* Encabezados de la tabla */}
                    <View style={styles.tableRow}>
                      <View style={styles.tableHeader10}>
                        <Text style={styles.tableCell}>No.</Text>
                      </View>
                      <View style={styles.tableHeader30}>
                        <Text style={styles.tableCell}>Lugar Poblado</Text>
                      </View>
                      <View style={styles.tableHeader30}>
                        <Text style={styles.tableCell}>Pertenencia</Text>
                      </View>
                      <View style={styles.tableHeader20}>
                        <Text style={styles.tableCell}>Categoría</Text>
                      </View>
                      <View style={styles.tableHeader10}>
                        <Text style={styles.tableCell}>Criterio</Text>
                      </View>
                    </View>

                    {/* Filas de la tabla */}
                    {groupedDataByEstado?.[estado]?.map((registro, index) => (
                      <View key={index} style={styles.tableRow}>
                        <View style={styles.tableRow10}>
                          <Text style={styles.tableCell}>{index + 1}</Text>
                        </View>
                        <View style={styles.tableRow30}>
                          <Text style={styles.tableCell}>{registro.Nombre}</Text>
                        </View>
                        <View style={styles.tableRow30}>
                          <Text style={styles.tableCell}>{registro.Pertenencia}</Text>
                        </View>
                        <View style={styles.tableRow20}>
                          <Text style={styles.tableCell}>{registro.Categoria}</Text>
                        </View>
                        <View style={styles.tableRow10}>
                          <Text style={styles.tableCell}>{registro.Estado}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <Text style={{ fontSize: 10, fontStyle: "italic", fontWeight: 'bold'}}>
                  No existen datos en criterio {estado}.
                </Text>
              )}
            </>
          ))}

          <View style={{paddingTop: 15}}>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
            <Text style={{fontWeight: 'bold'}}>NOTA:</Text> Los lugares poblados que tengan criterio 
            tres y cuatro para regular su categoría y reconocerla de manera oficial, la municipalidad 
            deberá remitir al Instituto Nacional de Estadística los dictámenes que establece el 
            artículo 22 del Código Municipal. Con los lugares poblados que tengan criterio dos, de 
            igual manera deberán remitir los referidos dictámenes, entiéndase solamente los que fueron 
            elevados de categoría (Caserío a Aldea) sin embargo estos si se consideran para el conteo 
            de aldeas y caseríos, pero con la categoría de caserío.
            </Text>
          </View>
          
          <View style={{paddingVertical: 15}}>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
            <Text style={{fontWeight: 'bold'}}>TOTALES SEGUN CATEGORIAS:</Text>
            </Text>
          </View>
          <View style={{width: '50%', height: 'auto'}}>
            <View style={styles.table}> 
              <View style={styles.tableRow}>
                  <View style={styles.tableHeader30}>
                    <Text style={styles.tableCell}>No.</Text>
                  </View>
                  <View style={styles.tableHeader35}>
                    <Text style={styles.tableCell}>Categoría</Text>
                  </View>
                  <View style={styles.tableHeader35}>
                    <Text style={styles.tableCell}>Total</Text>
                  </View>
              </View>
              {data.totalesPorCategoria.map((registro, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableRow30}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                  </View>
                  <View style={styles.tableRow35}>
                    <Text style={styles.tableCell}>{registro.Categoria}</Text>
                  </View>
                  <View style={styles.tableRow35}>
                    <Text style={styles.tableCell}>{registro.Totales}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          
          <View style={{paddingVertical: 15}}>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
            <Text style={{fontWeight: 'bold'}}>SITUADO CONSTITUCIONAL:</Text>
            </Text>
          </View>
          <View style={{width: '50%', height: 'auto'}}>
            <View style={styles.table}> 
              <View style={styles.tableRow}>
                  <View style={styles.tableHeader30}>
                    <Text style={styles.tableCell}>Aldeas</Text>
                  </View>
                  <View style={styles.tableHeader35}>
                    <Text style={styles.tableCell}>Caserios</Text>
                  </View>
                  <View style={styles.tableHeader35}>
                    <Text style={styles.tableCell}>Total</Text>
                  </View>
              </View>
              {data.situadoConstitucional.map((registro, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableRow30}>
                    <Text style={styles.tableCell}>{registro.Aldeas}</Text>
                  </View>
                  <View style={styles.tableRow35}>
                    <Text style={styles.tableCell}>{registro.Caserios}</Text>
                  </View>
                  <View style={styles.tableRow35}>
                    <Text style={styles.tableCell}>{registro.Total}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={{paddingVertical: 15}}>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
              <Text style={{fontWeight: 'bold'}}>ULTIMA ACTUALIZACIÓN TÉCNICO ANALISTA:</Text>
            </Text>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
              <Text>{data.UltimaActualizacion[0].UsuarioModificacion !== null ? 
                      data.UltimaActualizacion[0].UsuarioModificacion : data.UltimaActualizacion[0].UsuarioCreacion}</Text>
            </Text>
          </View>
          <View>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
              <Text style={{fontWeight: 'bold'}}>FECHA ULTIMA ACTUALIZACIÓN:</Text>
            </Text>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
              <Text>{moment(data.UltimaActualizacion[0].FechaTransaccion).format('DD/MM/YYYY')}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.pageFooter} fixed>
          <Image src={RLP.src} style={{width: 65, height: 'auto'}}></Image>
          <View style={{width: '100%', height: 'auto', display: 'flex', flexDirection: 'column', paddingHorizontal: 5}}>
              <Text style={{textAlign: 'center', fontSize: 10, paddingVertical: 4, color: '#005183', fontWeight: '600'}}>www.ine.gob.gt</Text>
              <View style={{width: '100%', height: '3px', backgroundColor: '#005183'}}></View>
              <Text style={{textAlign: 'center', fontSize: 8, paddingVertical: 4, color: '#005183', fontWeight: '600'}}>8a. calle 9-55 zona 1, Edificio América Guatemala / PBX 2315-4700</Text>
          </View>
          <View style={{width: 65, height: '100%', paddingHorizontal: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Text render={({ pageNumber, totalPages }) => (`${pageNumber}/${totalPages}`)} />
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ReporteLugaresPoblados;

const styles: { [key: string]: any } = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    fontSize: 12,
    paddingVertical: 15,
    paddingHorizontal: 25
  },
  pageHeader: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15
  },
  section: {
    margin: 10,
    flexGrow: 1
  },
  textoINE: {
    width: 'auto',
    height: 40
  },
  logoINE: {
    width: 55,
    height: 55
  },
  subtitle: {
    fontSize: 12,
    marginVertical: 2,
  },
  table: { 
    width: "auto", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0 
  }, 
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  }, 
  tableHeader10: {
    width: "10%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    fontWeight: 'bold'
  },
  tableHeader20: {
    width: "20%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    fontWeight: 'bold'
  },
  tableHeader25: {
    width: "25%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    fontWeight: 'bold'
  },
  tableHeader30: {
    width: "30%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    fontWeight: 'bold'
  },
  tableHeader35: {
    width: "35%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    fontWeight: 'bold'
  },
  tableRow10: {
    width: "10%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    fontSize: 10
  },
  tableRow20: {
    width: "20%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    fontSize: 10
  },
  tableRow25: {
    width: "25%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    fontSize: 10
  },
  tableRow30: {
    width: "30%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    fontSize: 10
  },
  tableRow35: {
    width: "35%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    fontSize: 10
  },
  tableCell: { 
    margin: "auto", 
    marginBottom: 5, 
    fontSize: 9
  },
  pageFooter: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15
  }
});