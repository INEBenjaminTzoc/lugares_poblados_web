import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [todosLugaresPoblados] = await pool.execute(`
            SELECT 
            d.nombre AS Departamento, 
            m.nombre AS Municipio, 
            lp.nombre AS LugarPoblado, 
            cat.etiqueta AS Categoria, 
            lp.cod_estado AS Estado, 
            lp.observacion AS Observacion,
            lp.estado AS EstadoMunicipio
            FROM municipio m 
            INNER JOIN departamento d ON d.id = m.departamento_id 
            INNER JOIN lugar_poblado AS lp ON m.id = lp.cod_municipio 
            INNER JOIN categoria AS cat ON cat.idcategoria = lp.cod_categoria
        `);

        return NextResponse.json({ code: 200, todosLugaresPoblados });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ code: 500, error });
    }
}