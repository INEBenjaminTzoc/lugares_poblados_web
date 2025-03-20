import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { departamento, municipio, estado, categoria } = await request.json();
    
    try {
        const [rows] = await pool.execute(`
            SELECT 
                d.id as ID_Departamento, 
                d.nombre AS Departamento, 
                lp.pertenencia as Pertenencia,
                m.id AS ID_Municipio, 
                m.nombre AS Municipio, 
                lp.id as ID_LugarPoblado,
                lp.nombre AS Nombre, 
                cat.etiqueta AS Categoria, 
                lp.cod_estado AS Estado, 
                lp.observacion AS Observacion,
                lp.estado AS EstadoMunicipio

            FROM municipio AS m 
            INNER JOIN departamento AS d ON d.id = m.departamento_id 
            INNER JOIN lugar_poblado AS lp ON m.id = lp.cod_municipio 
            INNER JOIN categoria AS cat ON cat.idcategoria = lp.cod_categoria
            WHERE d.id IN (${departamento}) 
            AND m.id IN (${municipio}) 
            AND lp.cod_estado in (${estado})
            AND cat.idcategoria IN (${categoria})
            ORDER BY lp.cod_categoria, lp.cod_estado, lp.nombre ASC    
        `);

        const [totalesPorCategoria] = await pool.execute(`
            SELECT  
                cat.etiqueta AS Categoria, 
                count(lp.cod_categoria) AS Totales
            FROM municipio AS m 
            INNER JOIN departamento AS d ON d.id=m.departamento_id 
            INNER JOIN lugar_poblado AS lp ON m.id=lp.cod_municipio 
            INNER JOIN categoria AS cat ON cat.idcategoria=lp.cod_categoria
            WHERE d.id IN (${departamento}) 
            and m.id IN (${municipio}) 
            and lp.cod_estado in (${estado})
            and cat.idcategoria in (${categoria}) 
            GROUP BY lp.cod_categoria
            ORDER BY lp.cod_categoria, lp.cod_estado, lp.nombre ASC    
        `);

        const [situadoConstitucional] = await pool.execute(`
            SELECT 
                SUM(IF(cat.idcategoria = '4', 1, 0)) AS Aldeas,
                SUM(IF(cat.idcategoria = '6', 1, 0)) AS Caserios,
                SUM(IF(cat.idcategoria = '4', 1, 0)) + SUM(IF(cat.idcategoria = '6', 1, 0)) AS Total
            FROM municipio AS m
            INNER JOIN departamento AS d ON d.id = m.departamento_id
            INNER JOIN lugar_poblado AS lp ON m.id = lp.cod_municipio
            INNER JOIN categoria AS cat ON cat.idcategoria = lp.cod_categoria
            WHERE m.id=(${municipio}) 
            AND (cat.idcategoria IN (4 , 6))
            AND ((lp.cod_estado IN (1 , 2, 6, 8, 9)
            AND lp.estado = 'T') OR (lp.cod_estado = 5 AND lp.estado = 'Y'))  
            GROUP BY d.id , d.nombre , m.id , m.nombre    
        `);

        const [ultimaModificacion] = await pool.execute(`
           SELECT 
                usuario_c AS UsuarioCreacion, 
                usuario_u AS UsuarioModificacion,
                DATE(FechaTransaccion) as FechaTransaccion
            FROM bitacora
            WHERE cod_municipio IN (101)
            and transaccion <> 'Cambio de estado'
            ORDER BY idbitacora desc limit 1; 
        `);

        return NextResponse.json({ code: 200, lugaresPoblados: rows, totalesPorCategoria, situadoConstitucional, ultimaModificacion });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ code: 500, error });
    }
}