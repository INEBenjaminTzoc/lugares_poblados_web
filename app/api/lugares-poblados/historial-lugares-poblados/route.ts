import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { departamentos, municipios, estados } = await request.json();
    
    try {
        const [results] = await pool.execute(`
            SELECT 
                d.nombre AS Departamento,
                m.id AS ID_Municipio, 
                m.nombre AS Municipio, 
                lp.nombre AS LugarPoblado, 
                cat.etiqueta AS Categoria, 
                lp.cod_estado AS Estado, 
                lp.observacion AS Observacion,
                lp.estado AS EstadoMunicipio
            FROM municipio AS m 
            INNER JOIN departamento AS d ON d.id = m.departamento_id 
            INNER JOIN lugar_poblado AS lp ON m.id = lp.cod_municipio 
            INNER JOIN categoria AS cat ON cat.idcategoria = lp.cod_categoria
            WHERE d.id IN (${departamentos})
            AND m.id IN (${municipios})
            AND lp.cod_estado in (${estados})
            ORDER BY lp.cod_categoria, lp.cod_estado, lp.nombre ASC    
        `);

        return NextResponse.json({ code: 200, lugaresPobladosHistorial: results });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ code: 500, error });
    }
}