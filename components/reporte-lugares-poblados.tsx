"use client"

import { Page, Text, View, Document, Image, StyleSheet,  } from '@react-pdf/renderer'
import INE from '@/public/img/INE.png'
import TextoINE from '@/public/img/TextoINE.png'
import React from 'react'

const data = {
  title: 'Table title',
  headers: ['No.', 'Lugar Poblado', 'Pertenencia', 'Categoría', 'Criterio'],
  rows: [
    ['1', 'BALBATZUL I', 'Cobán', 'CASERIO', '2'],
    ['2', 'BALBATZUL II', 'Cobán', 'ALDEA', '1'],
    ['3', 'BALBATZUL III', 'Cobán', 'BARRIO', '3']
  ],
  footer: 'footer'
}

export default function ReporteLugaresPoblados() {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.pageHeader}>
          <Image src={INE.src} style={styles.logoINE}></Image>
          <Image src={TextoINE.src} style={styles.textoINE}></Image>
          <Image src={INE.src} style={styles.logoINE}></Image>
        </View>
        {/* <View style={styles.section}>
          <Text style={styles.subtitle}>
            <Text style={{fontWeight: 'bold'}}>Departamento:</Text> Alta Verapaz
          </Text>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={{width: '50%'}}>
            <Text style={{fontWeight: 'bold'}}>Municipio:</Text> Cobán
            </Text>
            <Text style={{textAlign: 'right', fontSize: 10, width: '50%'}}>
              17/03/2025 22h:26m
            </Text>
          </View>
          
          <View style={{paddingVertical: 15}}>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
            <Text style={{fontWeight: 'bold'}}>CRITERIO 1:</Text> Lugares poblados que se encuentran en 
            base de datos del Instituto Nacional de Estadística (correspondientes al XI Censo Nacional 
            de Población y VI de habitación de 2002) y en certificación enviada por la municipalidad en 
            el presente año, con categoría igual, entiéndase coincidencias.
            </Text>
          </View>
          <View style={{width: '100%', height: 'auto'}}>
            <View style={styles.table}> 
              <View style={styles.tableRow}>
                {data.headers.map((header, index) => (
                  <View key={index} style={styles[`tableHeader${100 / data.headers.length}`]}>
                    <Text style={styles.tableCell}>{header}</Text>
                  </View>
                ))}
              </View>
              {data.rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tableRow}>
                  {row.map((cell, cellIndex) => (
                    <View key={cellIndex} style={styles[`tableRow${100 / data.headers.length}`]}>
                      <Text style={styles.tableCell}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
          
          <View style={{paddingVertical: 15}}>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
            <Text style={{fontWeight: 'bold'}}>CRITERIO 2:</Text> Lugares poblados que se encuentran en 
            base de datos del Instituto Nacional de Estadística (correspondientes al XI Censo Nacional 
            de Población y VI de habitación de 2002) pero con categoría distinta de la reportada en certificación 
            enviada por la municipalidad en el presente año, entiéndase entre aldea y caserío o viceversa.
            </Text>
          </View>
          <View style={{width: '100%', height: 'auto'}}>
            <View style={styles.table}> 
              <View style={styles.tableRow}>
                {data.headers.map((header, index) => (
                  <View key={index} style={styles[`tableHeader${100 / data.headers.length}`]}>
                    <Text style={styles.tableCell}>{header}</Text>
                  </View>
                ))}
              </View>
              {data.rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tableRow}>
                  {row.map((cell, cellIndex) => (
                    <View key={cellIndex} style={styles[`tableRow${100 / data.headers.length}`]}>
                      <Text style={styles.tableCell}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
          
          <View style={{paddingVertical: 15}}>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
            <Text style={{fontWeight: 'bold'}}>CRITERIO 3:</Text> Lugares poblados que se encuentran en 
            base de datos del Instituto Nacional de Estadística (correspondientes al XI Censo Nacional 
            de Población y VI de habitación de 2002), con categoría diferente a Aldea y Caserío de la 
            reportada en certificación enviada por la municipalidad en el presente año.
            </Text>
          </View>
          <View style={{width: '100%', height: 'auto'}}>
            <View style={styles.table}> 
              <View style={styles.tableRow}>
                {data.headers.map((header, index) => (
                  <View key={index} style={styles[`tableHeader${100 / data.headers.length}`]}>
                    <Text style={styles.tableCell}>{header}</Text>
                  </View>
                ))}
              </View>
              {data.rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tableRow}>
                  {row.map((cell, cellIndex) => (
                    <View key={cellIndex} style={styles[`tableRow${100 / data.headers.length}`]}>
                      <Text style={styles.tableCell}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
          
          <View style={{paddingVertical: 15}}>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
            <Text style={{fontWeight: 'bold'}}>CRITERIO 4:</Text> Lugares poblados que no obran en 
            base de datos del Instituto Nacional de Estadística (correspondientes al XI Censo Nacional 
            de Población y VI de habitación de 2002) pero si los reporta la municipalidad en certificación 
            enviada en el presente año, entiéndase que técnicamente se reconocerá como un lugar poblado nuevo.
            </Text>
          </View>
          <View style={{width: '100%', height: 'auto'}}>
            <View style={styles.table}> 
              <View style={styles.tableRow}>
                {data.headers.map((header, index) => (
                  <View key={index} style={styles[`tableHeader${100 / data.headers.length}`]}>
                    <Text style={styles.tableCell}>{header}</Text>
                  </View>
                ))}
              </View>
              {data.rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tableRow}>
                  {row.map((cell, cellIndex) => (
                    <View key={cellIndex} style={styles[`tableRow${100 / data.headers.length}`]}>
                      <Text style={styles.tableCell}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
          
          <View style={{paddingVertical: 15}}>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
            <Text style={{fontWeight: 'bold'}}>CRITERIO 5:</Text> Lugares poblados que se encuentran en 
            base de datos del Instituto Nacional de Estadística correspondientes al XI Censo Nacional de 
            Población y VI de habitación de 2002. Se resaltan los Caseríos que no son reconocidos por la 
            municipalidad en el acta remitida en el presente año.
            </Text>
          </View>
          <View style={{width: '100%', height: 'auto'}}>
            <View style={styles.table}> 
              <View style={styles.tableRow}>
                {data.headers.map((header, index) => (
                  <View key={index} style={styles[`tableHeader${100 / data.headers.length}`]}>
                    <Text style={styles.tableCell}>{header}</Text>
                  </View>
                ))}
              </View>
              {data.rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tableRow}>
                  {row.map((cell, cellIndex) => (
                    <View key={cellIndex} style={styles[`tableRow${100 / data.headers.length}`]}>
                      <Text style={styles.tableCell}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
          
          <View style={{paddingVertical: 15}}>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
            <Text style={{fontWeight: 'bold'}}>CRITERIO 6:</Text> Lugares poblados avalados con actas y/o 
            acuerdos del Concejo Municipal, previos a las modificaciones del código municipal, que entraron 
            en vigencia en el año 2010, en donde indica nombre, categoria y otras referencias.
            </Text>
          </View>
          <View style={{width: '100%', height: 'auto'}}>
            <View style={styles.table}> 
              <View style={styles.tableRow}>
                {data.headers.map((header, index) => (
                  <View key={index} style={styles[`tableHeader${100 / data.headers.length}`]}>
                    <Text style={styles.tableCell}>{header}</Text>
                  </View>
                ))}
              </View>
              {data.rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tableRow}>
                  {row.map((cell, cellIndex) => (
                    <View key={cellIndex} style={styles[`tableRow${100 / data.headers.length}`]}>
                      <Text style={styles.tableCell}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
          
          <View style={{paddingVertical: 15}}>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
            <Text style={{fontWeight: 'bold'}}>CRITERIO 7:</Text> Otros Casos. Son casos aislados que no encaja 
            en ningún aspecto legal o técnico o que se debe aclarar su situación, el cual no debe sumar en 
            el conteo de aldeas y caseríos.
            </Text>
          </View>
          <View style={{width: '100%', height: 'auto'}}>
            <View style={styles.table}> 
              <View style={styles.tableRow}>
                {data.headers.map((header, index) => (
                  <View key={index} style={styles[`tableHeader${100 / data.headers.length}`]}>
                    <Text style={styles.tableCell}>{header}</Text>
                  </View>
                ))}
              </View>
              {data.rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tableRow}>
                  {row.map((cell, cellIndex) => (
                    <View key={cellIndex} style={styles[`tableRow${100 / data.headers.length}`]}>
                      <Text style={styles.tableCell}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
          
          <View style={{paddingVertical: 15}}>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
            <Text style={{fontWeight: 'bold'}}>CRITERIO 8:</Text> Lugares poblados (Caseríos y Aldeas) cuya 
            elevación de categoría es avalada por los dictámenes favorables de la Oficina Municipal de 
            Planificación, del Instituto Nacional de Estadística y del Instituto de Fomento Municipal como lo 
            establece el Artículo 22 del Código Municipal.
            </Text>
          </View>
          <View style={{width: '100%', height: 'auto'}}>
            <View style={styles.table}> 
              <View style={styles.tableRow}>
                {data.headers.map((header, index) => (
                  <View key={index} style={styles[`tableHeader${100 / data.headers.length}`]}>
                    <Text style={styles.tableCell}>{header}</Text>
                  </View>
                ))}
              </View>
              {data.rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tableRow}>
                  {row.map((cell, cellIndex) => (
                    <View key={cellIndex} style={styles[`tableRow${100 / data.headers.length}`]}>
                      <Text style={styles.tableCell}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
          
          <View style={{paddingVertical: 15}}>
            <Text style={{fontSize: 11.5, lineHeight: 1.5}}>
            <Text style={{fontWeight: 'bold'}}>CRITERIO 9:</Text> Municipalidad con caso especial. 
            Lugares poblados (Caserios y Aldeas), cuyo dato estadístico es tomado por parte de las autoridades 
            del INE cuya fuente es: XII Censo Nacional de Población de Población y VII de Vivienda año 2018.
            </Text>
          </View>
          <View style={{width: '100%', height: 'auto'}}>
            <View style={styles.table}> 
              <View style={styles.tableRow}>
                {data.headers.map((header, index) => (
                  <View key={index} style={styles[`tableHeader${100 / data.headers.length}`]}>
                    <Text style={styles.tableCell}>{header}</Text>
                  </View>
                ))}
              </View>
              {data.rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tableRow}>
                  {row.map((cell, cellIndex) => (
                    <View key={cellIndex} style={styles[`tableRow${100 / data.headers.length}`]}>
                      <Text style={styles.tableCell}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View> */}

      </Page>
    </Document>
  )
}

const styles: { [key: string]: any } = StyleSheet.create({
  page: {
    // flexDirection: 'row',
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
    // paddingVertical: 10,
    // paddingHorizontal: 25,
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
  tableRow35: {
    width: "35%", 
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
  tableCell: { 
    margin: "auto", 
    marginTop: 5, 
    fontSize: 9
  }
});